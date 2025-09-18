import { z } from "zod";

// --- Schemas for Case Creation ---

// Schema for items that are simple string values in an array (used for keywords, ROS, DDx)
const keywordSchema = z.object({
  value: z.string().min(1, { message: "مقدار نمی‌تواند خالی باشد." }),
});

// Schema for a single learning objective item in the form
const learningObjectiveItemSchema = z.object({
  id: z.string(),
  statement: z.string(),
  category: z.string(),
  score: z.coerce.number().min(1, "امتیاز باید بین ۱ تا ۵ باشد.").max(5, "امتیاز باید بین ۱ تا ۵ باشد."),
});

/**
 * The main schema for the entire multi-step case creation form.
 */
export const createCaseSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(5, { message: "عنوان باید حداقل ۵ کاراکتر باشد." }),
  description: z.string().min(10, { message: "توضیحات کوتاه باید حداقل ۱۰ کاراکتر باشد." }),
  specialty: z.string({ required_error: "انتخاب تخصص الزامی است." }).min(1, { message: "انتخاب تخصص الزامی است." }),
  emotional_state: z.string({ required_error: "انتخاب وضعیت روانی اولیه الزامی است." }),
  riveFileUrl: z.string().optional(),
  keywords: z.array(keywordSchema).min(1, { message: "حداقل یک کلمه کلیدی وارد کنید." }),

  // Step 2: System Prompt (Patient Persona & History)
  systemPrompt: z.object({
    demographics: z.object({
      name: z.string().min(3, { message: "نام بیمار باید حداقل ۳ کاراکتر باشد." }),
      age: z.coerce.number({invalid_type_error: "سن باید عدد باشد."}).min(0, { message: "سن نمی‌تواند منفی باشد." }).max(120, { message: "سن بیمار معتبر نیست." }),
      gender: z.enum(['male', 'female'], { required_error: "انتخاب جنسیت الزامی است." }),
      birthLocation: z.string().min(2, { message: "محل تولد باید حداقل ۲ کاراکتر باشد." }),
      livingLocation: z.string().min(2, { message: "محل سکونت باید حداقل ۲ کاراکتر باشد." }),
    }),
    education: z.enum(['illiterate', 'primary', 'middle_school', 'high_school', 'diploma', 'bachelors', 'masters', 'phd'], {
      required_error: "انتخاب سطح تحصیلات الزامی است.",
    }),
    persona: z.string().min(10, { message: "ویژگی‌های شخصیتی باید حداقل ۱۰ کاراکتر باشد." }),
    chiefComplaint: z.string().min(5, { message: "شکایت اصلی باید حداقل ۵ کاراکتر باشد." }),
    presentIllnessHistory: z.string().min(20, { message: "شرح بیماری فعلی باید حداقل ۲۰ کاراکتر باشد." }),
    pastMedicalHistory: z.string().optional(),
    pastSurgicalHistory: z.string().optional(),
    drugHistory: z.string().optional(),
    familyHistory: z.string().optional(),
    socialHistory: z.string().optional(),
    reviewOfSystems: z.object({
      positive: z.array(keywordSchema).optional(),
      negative: z.array(keywordSchema).optional(),
    }),
  }),

  // Step 3: Learning Objectives
  learningObjectives: z.array(learningObjectiveItemSchema).min(1, { message: "حداقل یک هدف یادگیری باید تعریف شود." }),

  // Step 4: P/E
  physicalExamFindings: z.object({raw: z.string()}),
  // Step 5: Diagnosis
  differentialDiagnosis: z.array(keywordSchema).min(1, { message: "حداقل یک تشخیص افتراقی وارد کنید." }),
  finalDiagnosis: z.string().min(3, { message: "تشخیص نهایی باید حداقل ۳ کاراکتر باشد." }),
});


export const historyActionSchema = z.object({
  patientId: z.string(),
  userMessage: z.string().min(1, "Message cannot be empty."),
});

export const examinationActionSchema = z.object({
  patientId: z.string(),
  examinationItem: z.string(),
  userQuery: z.string().min(1, "Query cannot be empty."),
});

/**
 * Defines the schema for the written history form.
 * Each field corresponds to a part of the standard medical history.
 */
export const writtenHistorySchema = z.object({
  chiefComplaint: z.string().min(10, { message: 'لطفاً شکایت اصلی بیمار را با جزئیات بیشتری بنویسید.' }).max(200),
  presentIllness: z.string().min(50, { message: 'لطفاً تاریخچه بیماری فعلی را با جزئیات بیشتری شرح دهید.' }).max(2000),
  pastMedicalHistory: z.string().max(1000).optional(),
  drugHistory: z.string().max(1000).optional(),
  socialHistory: z.string().max(1000).optional(),
  familyHistory: z.string().max(1000).optional(),
  allergies: z.string().max(500).optional(),
  reviewOfSystems: z.string().max(2000).optional(),
});

// This type can be inferred and used in our form component.
export type WrittenHistoryValues = z.infer<typeof writtenHistorySchema>;


// --- Schemas for Case Creation ---

// export const createCaseSchema = z.object({
//   // Step 1: Basic Information
//   title: z.string().min(5, 'عنوان کیس باید حداقل ۵ کاراکتر باشد.'),
//   description: z.string().min(20, 'توضیحات کیس باید حداقل ۲۰ کاراکتر باشد.'),
//   specialty: z.string().min(3, 'تخصص باید مشخص شود.'),
//   keywords: z.array(z.string()).min(1, 'حداقل یک کلمه کلیدی وارد کنید.'),

//   // Step 2: Patient Persona (System Prompt)
//   name: z.string().min(2, 'نام بیمار الزامی است.'),
//   gender: z.enum(['مرد', 'زن', 'دیگر']),
//   age: z.number().min(0).max(120),
//   education: z.string().min(2, 'سطح تحصیلات الزامی است.'),
//   characterAttributes: z.array(z.string()).min(1, 'حداقل یک ویژگی شخصیتی انتخاب کنید.'),
//   otherAttributes: z.string().optional(),
//   history: z.object({
//     chiefComplaint: z.string().min(1, 'شکایت اصلی الزامی است.'),
//     presentIllness: z.string().min(1, 'شرح بیماری فعلی الزامی است.'),
//     pastMedicalHistory: z.string().optional(),
//     drugHistory: z.string().optional(),
//     allergies: z.string().optional(),
//     familyHistory: z.string().optional(),
//     socialHistory: z.string().optional(),
//     reviewOfSystems: z.string().optional(),
//   }),

//   // Step 3: Learning Objectives
//   // This now correctly defines `learningObjectives` as a top-level property.
//   learningObjectives: z.object({
//     objectives: z.array(learningObjectiveItemSchema),
//   }),

//   // Step 4: phisical exam.

//   // Step 5: Final Details
//   differentialDiagnosis: z.array(z.string()).min(1, 'حداقل یک تشخیص افتراقی وارد کنید.'),
//   finalDiagnosis: z.string().min(3, 'تشخیص نهایی الزامی است.'),
// });

// // This inferred type will now correctly match the form's defaultValues.
export type CreateCaseValues = z.infer<typeof createCaseSchema>;