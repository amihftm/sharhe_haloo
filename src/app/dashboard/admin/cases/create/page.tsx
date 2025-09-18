'use client';

import { useState, useTransition } from 'react';
import { FieldName, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createCaseSchema } from '@/lib/validations';
import { createCaseAction } from '@/lib/actions/case.actions';
import { LEARNING_OBJECTIVES } from '@/data/learningObjectivesData';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, ChevronRight, Check, ClipboardList, User, Target, Stethoscope, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Step1Content } from './_components/Step1Content';
import { Step2Content } from './_components/Step2Content';
import { Step3Content } from './_components/Step3Content';
import { Step4Content } from './_components/Step4Content'; // Assuming this component exists
import { Step5Content } from './_components/Step5Content';
import { Stepper } from './_components/Stepper';

// Define the type based on the Zod schema
type CreateCaseValues = z.infer<typeof createCaseSchema>;

// Map fields to their respective steps for targeted validation
const fieldsByStep: FieldName<CreateCaseValues>[][] = [
  ['title', 'description', 'specialty', 'keywords', 'riveFileUrl', 'emotional_state'], // Step 1
  [
    'systemPrompt.demographics.name',
    'systemPrompt.demographics.age',
    'systemPrompt.demographics.gender',
    'systemPrompt.education',
    'systemPrompt.chiefComplaint',
    'systemPrompt.presentIllnessHistory',
  ], // Step 2 (and others as needed)
  ['learningObjectives'], // Step 3
  ['physicalExamFindings'], // Step 4 (Add fields for Step4Content here)
  ['differentialDiagnosis', 'finalDiagnosis'], // Step 5
];

const steps = [
  { id: 'مرحله اول', name: 'اطلاعات اولیه', Icon: ClipboardList },
  { id: 'مرحله دوم', name: 'شخصیت بیمار', Icon: User },
  { id: 'مرحله سوم', name: 'اهداف یادگیری', Icon: Target },
  { id: 'مرحله چهارم', name: 'معاینه بالینی', Icon: Stethoscope },
  { id: 'مرحله پنجم', name: 'تشخیص نهایی', Icon: BrainCircuit },
];

export default function CreateCasePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCaseValues>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      // Step 1
      title: "",
      description: "",
      specialty: "",
      emotional_state: "",
      riveFileUrl: "",
      keywords: [],
      // Step 2
      systemPrompt: {
        demographics: {
          name: "",
          age: undefined,
          gender: undefined,
          birthLocation: "",
          livingLocation: "",
        },
        education: undefined,
        persona: "",
        chiefComplaint: "",
        presentIllnessHistory: "",
        pastMedicalHistory: "",
        pastSurgicalHistory: "",
        drugHistory: "",
        familyHistory: "",
        socialHistory: "",
        reviewOfSystems: {
          positive: [],
          negative: [],
        },
      },
      // Step 3 (pre-populated from our data file)
      learningObjectives: LEARNING_OBJECTIVES.map(obj => ({ ...obj, score: 3 })), // Default score to 3
      // Step 5
      differentialDiagnosis: [],
      finalDiagnosis: "",
    },
  });

  const onSubmit = (values: CreateCaseValues) => {
    startTransition(async () => {
      const result = await createCaseAction(values);
      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/admin/cases/`);
      } else {
        toast.error(result.message);
      }
    });
  };

  const nextStep = async () => {
    // Get the fields for the current step
    const fieldsForCurrentStep = fieldsByStep[currentStep];
    // @ts-expect-error Trigger validation ONLY for those fields
    const isValid = await form.trigger(fieldsForCurrentStep);
    console.log(form.getValues())
    
    if (isValid) {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ساخت کیس جدید</h1>
      <div className="mb-12">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className={currentStep !== 0 ? 'hidden' : ''}><Step1Content control={form.control} /></div>
          <div className={currentStep !== 1 ? 'hidden' : ''}><Step2Content control={form.control} /></div>
          <div className={currentStep !== 2 ? 'hidden' : ''}><Step3Content /></div>
          <div className={currentStep !== 3 ? 'hidden' : ''}><Step4Content control={form.control} /></div>
          <div className={currentStep !== 4 ? 'hidden' : ''}><Step5Content control={form.control} /></div>

          <div className="flex justify-between pt-8">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0 || isPending}>
              <ChevronRight className="ml-2 h-4 w-4" />
              قبلی
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={isPending}>
                بعدی
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Check className="ml-2 h-4 w-4" />}
                ساخت کیس
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
