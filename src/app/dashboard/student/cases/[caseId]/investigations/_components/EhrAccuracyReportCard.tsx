import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { EhrAccuracyReport } from '@/types/case-attempt'; // Using centralized types

// A more complete mapping for user-friendly Persian display names
const sectionTitles: Record<string, string> = {
  chiefComplaint: 'شکایت اصلی',
  presentIllness: 'بیماری فعلی',
  pastMedicalHistory: 'سابقه پزشکی',
  drugHistory: 'سابقه دارویی',
  socialHistory: 'سابقه اجتماعی',
  familyHistory: 'سابقه خانوادگی',
  allergies: 'آلرژی‌ها',
  reviewOfSystems: 'مرور سیستم‌ها',
};

export function EhrAccuracyReportCard({ report }: { report: EhrAccuracyReport }) {
  if (!report?.sections) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>گزارش دقت ثبت در پرونده الکترونیک (EHR)</CardTitle>
        <CardDescription>مقایسه نوشته‌های شما با بازخورد هوش مصنوعی.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {report.sections.map((section) => (
            <AccordionItem value={section.section_name} key={section.section_name}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{sectionTitles[section.section_name] || section.section_name}</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {section.score}/{section.max_points}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Progress value={(section.score / section.max_points) * 100} className="h-2 mb-3" />
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                    <h4 className="font-semibold text-sm mb-2 text-blue-800">تحلیل و بازخورد:</h4>
                    <p className="text-sm text-blue-700">{section.justification}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
