'use client';

import { useState, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';
import { uploadRiveFile } from '@/lib/actions/upload.actions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, CheckCircle } from 'lucide-react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface RiveFileInputProps {
  name: string; // The form field name, e.g., 'riveFileUrl'
}

export const RiveFileInput = ({ name }: RiveFileInputProps) => {
  const { setValue, getValues } = useFormContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('لطفاً ابتدا یک فایل را انتخاب کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('riveFile', selectedFile);

    startTransition(async () => {
      const result = await uploadRiveFile(formData);
      if (result.success && result.filePath) {
        setValue(name, result.filePath, { shouldValidate: true });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const clearFile = () => {
    setSelectedFile(null);
    setValue(name, '', { shouldValidate: true });
    // This is needed to clear the native file input's visual selection
    const input = document.getElementById('rive-file-input') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
  };

  const uploadedFilePath = getValues(name);

  return (
    <FormItem>
      <FormLabel>فایل انیمیشن کاراکتر (Rive)</FormLabel>
      <div className="flex items-center gap-2">
        <FormControl>
          <Input
            id="rive-file-input"
            type="file"
            accept=".riv"
            onChange={handleFileChange}
            className="flex-grow cursor-pointer"
            disabled={isPending || !!uploadedFilePath}
          />
        </FormControl>
        {selectedFile && !uploadedFilePath && (
          <Button type="button" onClick={handleUpload} disabled={isPending} size="sm">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span className="mr-2 hidden sm:inline">آپلود</span>
          </Button>
        )}
      </div>
      
      {selectedFile && (
          <div className="mt-2 text-sm text-muted-foreground p-2 border rounded-md flex justify-between items-center bg-muted/50">
              <span>{selectedFile.name}</span>
              {uploadedFilePath ? (
                  <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>آپلود شد</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearFile}>
                          <X className="h-4 w-4" />
                      </Button>
                  </div>
              ) : (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedFile(null)}>
                     <X className="h-4 w-4" />
                  </Button>
              )}
          </div>
      )}
      <FormMessage />
    </FormItem>
  );
};
