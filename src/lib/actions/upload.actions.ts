'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { stat, mkdir } from 'fs/promises';

// Define the state for the upload action's return value
type UploadState = {
  success: boolean;
  message: string;
  filePath?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadRiveFile(formData: FormData): Promise<UploadState> {
  const file = formData.get('riveFile') as File | null;

  if (!file) {
    return { success: false, message: 'فایلی انتخاب نشده است.' };
  }

  // Validate file type and size
  if (!file.name.endsWith('.riv')) {
    return { success: false, message: 'فقط فایل‌های با فرمت .riv مجاز هستند.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, message: 'حجم فایل باید کمتر از ۵ مگابایت باشد.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid overwriting files
    const uniqueFilename = `${Date.now()}-${file.name}`;
    
    // Define the destination path in the public directory
    const publicDir = join(process.cwd(), 'public', 'assets', 'rives');
    const filePath = join(publicDir, uniqueFilename);

    // Ensure the destination directory exists
    await stat(publicDir).catch(() => mkdir(publicDir, { recursive: true }));
    
    // Write the file to the filesystem
    await writeFile(filePath, buffer);
    
    // The public URL path to be saved in the database
    const fileUrl = `/assets/rives/${uniqueFilename}`;

    return { 
        success: true, 
        message: 'فایل با موفقیت آپلود شد.',
        filePath: fileUrl 
    };

  } catch (error) {
    console.error('Error uploading Rive file:', error);
    return { success: false, message: 'خطا در آپلود فایل. لطفاً دوباره تلاش کنید.' };
  }
}
