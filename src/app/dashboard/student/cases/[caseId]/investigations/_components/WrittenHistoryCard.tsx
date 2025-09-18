// This new component is responsible for displaying the student's written history.
// Encapsulating this logic makes the main page component cleaner and more focused.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { WrittenHistory } from '@/types/case-attempt';

interface WrittenHistoryCardProps {
  history: WrittenHistory;
}

export function WrittenHistoryCard({ history }: WrittenHistoryCardProps) {
  if (!history) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>شرح حال نوشته شده توسط دانشجو</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        {/* Main sections are always visible */}
        <div>
          <h3 className="font-semibold mb-1">شکایت اصلی (Chief Complaint)</h3>
          <p className="text-muted-foreground">{history.chiefComplaint}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">بیماری فعلی (Present Illness)</h3>
          <p className="text-muted-foreground">{history.presentIllness}</p>
        </div>

        {/* Other sections are in an accordion to keep the UI clean */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>مشاهده سایر بخش‌های شرح حال</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <h3 className="font-semibold mb-1">سابقه پزشکی (Past Medical History)</h3>
                <p className="text-muted-foreground">{history.pastMedicalHistory}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">سابقه دارویی (Drug History)</h3>
                <p className="text-muted-foreground">{history.drugHistory}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">سابقه اجتماعی (Social History)</h3>
                <p className="text-muted-foreground">{history.socialHistory}</p>
              </div>
               <div>
                <h3 className="font-semibold mb-1">سابقه خانوادگی (Family History)</h3>
                <p className="text-muted-foreground">{history.familyHistory}</p>
              </div>
               <div>
                <h3 className="font-semibold mb-1">آلرژی‌ها (Allergies)</h3>
                <p className="text-muted-foreground">{history.allergies}</p>
              </div>
               <div>
                <h3 className="font-semibold mb-1">مرور سیستم‌ها (Review of Systems)</h3>
                <p className="text-muted-foreground">{history.reviewOfSystems}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
