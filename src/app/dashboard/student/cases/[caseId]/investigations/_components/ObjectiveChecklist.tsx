import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { LearningObjectives } from '@/types/case-attempt';
import { LEARNING_OBJECTIVES } from '@/data/learningObjectivesData';

interface ChecklistProps {
  objectives: LearningObjectives;
}

export function ObjectiveChecklist({ objectives }: ChecklistProps) {
  if (!objectives) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>چک‌لیست اهداف یادگیری</CardTitle>
        <CardDescription>جزئیات عملکرد در گرفتن شرح حال</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['achieved', 'missed']}>
          <AccordionItem value="achieved">
            <AccordionTrigger className="text-green-600 hover:no-underline">
              موارد انجام شده ({objectives.achieved_items.length})
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                {objectives.achieved_items.map(item => (
                  <li key={item} className="flex items-start text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="capitalize">{LEARNING_OBJECTIVES.find((obj) => obj.id === item)?.statement}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="missed">
            <AccordionTrigger className="text-red-600 hover:no-underline">
              موارد فراموش شده ({objectives.missed_items.length})
            </AccordionTrigger>
            <AccordionContent>
               <ul className="space-y-2 pt-2">
                {objectives.missed_items.map(item => (
                  <li key={item} className="flex items-start text-sm">
                    <XCircle className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                    <span className="capitalize">{LEARNING_OBJECTIVES.find((obj) => obj.id === item)?.statement}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
