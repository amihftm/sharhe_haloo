'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  writtenHistorySchema,
  WrittenHistoryValues,
} from '@/lib/validations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useTransition, useEffect } from 'react';
import {
  getConversationScoring,
  getOrCreateCaseAttempt,
  submitAndScoreWrittenHistory,
} from '@/lib/actions/case.actions';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCaseStep } from '../_components/CaseStepProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formFields: {
  name: keyof WrittenHistoryValues;
  label: string;
  placeholder: string;
  isTextarea?: boolean;
}[] = [
  { name: 'chiefComplaint', label: 'شکایت اصلی (Chief Complaint)', placeholder: 'مثال: درد قفسه سینه از ۲ ساعت قبل...' },
  { name: 'presentIllness', label: 'شرح بیماری فعلی (Present Illness)', placeholder: 'شرح کامل و طبقه‌بندی شده بیماری فعلی بیمار...', isTextarea: true },
  { name: 'pastMedicalHistory', label: 'سابقه پزشکی گذشته (Past Medical History)', placeholder: 'بیماری‌های زمینه‌ای، جراحی‌ها و بستری‌های قبلی...', isTextarea: true },
  { name: 'drugHistory', label: 'سابقه دارویی (Drug History)', placeholder: 'لیست داروهای مصرفی بیمار به همراه دوز و علت مصرف...', isTextarea: true },
  { name: 'socialHistory', label: 'سابقه اجتماعی (Social History)', placeholder: 'شغل، وضعیت تاهل، مصرف سیگار و الکل...', isTextarea: true },
  { name: 'familyHistory', label: 'سابقه خانوادگی (Family History)', placeholder: 'بیماری‌های مهم در اعضای خانواده...', isTextarea: true },
  { name: 'allergies', label: 'حساسیت‌ها (Allergies)', placeholder: 'هرگونه حساسیت دارویی یا غذایی شناخته شده...', isTextarea: true },
  { name: 'reviewOfSystems', label: 'مرور سیستم‌ها (Review of Systems)', placeholder: 'بررسی سایر دستگاه‌های بدن...', isTextarea: true },
];

type ehr_values = {
      chiefComplaint: string,
      presentIllness: string,
      pastMedicalHistory: string,
      drugHistory: string,
      socialHistory: string,
      familyHistory: string,
      allergies: string,
      reviewOfSystems: string,
    } 

export default function WritingHistoryPage() {
  const [isPending, startTransition] = useTransition();
  const [submissionResult, setSubmissionResult] = useState<{ score: number; feedback: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { completeStep } = useCaseStep();
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const {history_taken, attemptId, setTaken_history} = useCaseStep()

  const form = useForm<WrittenHistoryValues>({
    resolver: zodResolver(writtenHistorySchema),
    defaultValues: {
      chiefComplaint: '',
      presentIllness: '',
      pastMedicalHistory: '',
      drugHistory: '',
      socialHistory: '',
      familyHistory: '',
      allergies: '',
      reviewOfSystems: '',
    },
  });

  useEffect(() => {
    getOrCreateCaseAttempt(caseId).then((res) => {
      if (!!history_taken) {
        const hr = history_taken as ehr_values
        form.setValue('chiefComplaint', hr.chiefComplaint || "")
        form.setValue('presentIllness', hr.presentIllness || "")
        form.setValue('pastMedicalHistory', hr.pastMedicalHistory || "")
        form.setValue('drugHistory', hr.drugHistory || "")
        form.setValue('socialHistory', hr.socialHistory || "")
        form.setValue('familyHistory', hr.familyHistory || "")
        form.setValue('allergies', hr.allergies || "")
        form.setValue('reviewOfSystems', hr.reviewOfSystems || "")
      }
      else setError('Failed to get case attempt ID.');
    });
  }, [caseId]);

  function onSubmit(values: WrittenHistoryValues) {
    if (!attemptId) {
      setError('خطا در شناسایی کیس. لطفاً صفحه را رفرش کنید.');
      return;
    }
    setError(null);
    setSubmissionResult(null);

    startTransition(async () => {
      const result = await submitAndScoreWrittenHistory(attemptId, values);
      await getConversationScoring(attemptId)
      if (result.success && result.data) {
        setSubmissionResult(result.data);
        completeStep(1); // Mark step 1 as complete
      } else {
        setError(result.error || 'یک خطای ناشناخته در هنگام ارزیابی رخ داد.');
      }
    });
  }

  function handleNavigateNext() {
    router.push(`./investigations`);
  }

  const {watch} = form

  const [
    chiefComplaint,
    presentIllness,
    pastMedicalHistory,
    drugHistory,
    allergies,
    familyHistory,
    socialHistory,
    reviewOfSystems,
  ] = watch([
    "chiefComplaint",
    "presentIllness",
    "pastMedicalHistory",
    "drugHistory",
    "allergies",
    "familyHistory",
    "socialHistory",
    "reviewOfSystems",
  ]);
  useEffect(() => {
    const hr = {
      chiefComplaint,
      presentIllness,
      pastMedicalHistory,
      drugHistory,
      allergies,
      familyHistory,
      socialHistory,
      reviewOfSystems,
    };
    setTaken_history(hr)
  }, [chiefComplaint,
    presentIllness,
    pastMedicalHistory,
    drugHistory,
    allergies,
    familyHistory,
    socialHistory,
    reviewOfSystems,])


  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">برگه شرح حال</h1>
        <p className="text-muted-foreground mt-1">
          اطلاعاتی را که از بیمار کسب کرده‌اید در فرم زیر وارد کنید.
        </p>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        {!submissionResult ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-8">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-base" dir='rtl'>{field.label}</FormLabel>
                      <FormControl>
                        {field.isTextarea ? (
                          <Textarea
                            placeholder={field.placeholder}
                            dir='rtl'
                            className="resize-y min-h-[120px]"
                            {...formField}
                          />
                        ) : (
                          <Input dir='rtl' placeholder={field.placeholder} {...formField} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ثبت اطلاعات
              </Button>
            </form>
          </Form>
        ) : (
          // Result View
          <Card className="w-full max-w-2xl mx-auto my-8">
            <CardHeader className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <CardTitle className="text-2xl mt-4">ممکن بود دنیا رو فتح کنیم، ولی فعلا یوخده</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground">نمره شما در این بخش</p>
                <p className="text-6xl font-bold text-primary">{submissionResult.score}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">بازخورد:</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{submissionResult.feedback}</p>
              </div>
              <Button onClick={handleNavigateNext} className="w-full">
                ادامه به مرحله بعد (درخواست آزمایش)
              </Button>
            </CardContent>
          </Card>
        )}
        {error && (
          <div className="flex items-center gap-2 text-destructive mt-4 p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
