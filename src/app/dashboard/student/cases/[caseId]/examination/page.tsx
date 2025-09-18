// app/cases/[caseId]/examination/page.tsx
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getOrCreateCaseAttempt } from '@/lib/actions/case.actions';
import { getPhysicalExaminationResponse } from '@/lib/actions/case.actions';
import { ExaminationMessage } from '@/lib/types';
import {
  Heart,
  Brain,
  Eye,
  PersonStanding,
  Loader2,
  SendHorizontal,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCaseStep } from '../_components/CaseStepProvider';

const examinationCategories = [
  { name: 'علائم حیاتی', icon: Waves, categoryKey: 'vitals' },
  { name: 'معاینه عمومی', icon: PersonStanding, categoryKey: 'general' },
  { name: 'سر و گردن', icon: Eye, categoryKey: 'headAndNeck' },
  { name: 'قلب', icon: Heart, categoryKey: 'cardiac' },
  { name: 'ریه', icon: Heart, categoryKey: 'pulmonary' },
  { name: 'سیستم عصبی', icon: Brain, categoryKey: 'neurological' },
];

export default function CaseExaminationPage() {
  const params = useParams();
  const { completeStep } = useCaseStep();
  const caseId = params.caseId as string;

  const [isPending, startTransition] = useTransition();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [chat, setChat] = useState<ExaminationMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedExam, setSelectedExam] = useState<{ name: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch the attemptId when the component mounts
  useEffect(() => {
    getOrCreateCaseAttempt(caseId).then((result) => {
      if (result.success && result.data) {
        setAttemptId(result.data.attemptId);
      }
    });
  }, [caseId]);

  const handleOpenDialog = (examItem: { name: string }) => {
    setSelectedExam(examItem);
    setChat([
      {
        sender: 'SYSTEM',
        text: `معاینه "${examItem.name}" انتخاب شد. دستور خود را وارد کنید (مثال: سمع قلب).`,
      },
    ]);
    setCurrentInput('');
    setIsDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim() || !selectedExam || isPending || !attemptId) return;

    const userMessage: ExaminationMessage = { sender: 'USER', text: currentInput };
    setChat((prev) => [...prev, userMessage]);
    const examName = selectedExam.name;
    setCurrentInput('');

    startTransition(async () => {
      const result = await getPhysicalExaminationResponse(
        attemptId,
        examName,
        userMessage.text
      );
      
      const reply: ExaminationMessage = result.success
        ? { sender: 'AI', text: result.data! }
        : { sender: 'SYSTEM', text: `خطا: ${result.error}` };
      
      setChat((prev) => [...prev, reply]);
      // Mark step as completed after the first successful interaction
      if(result.success) {
        completeStep(0);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">معاینه فیزیکی</h1>
        <p className="text-muted-foreground mt-1">
          بخش مورد نظر را انتخاب کرده و دستورات خود را در پنجره باز شده وارد کنید.
        </p>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-8 pb-6">
          {examinationCategories.map((item) => (
            <Dialog key={item.name} open={isDialogOpen && selectedExam?.name === item.name} onOpenChange={(open) => { if (!open) setIsDialogOpen(false); }}>
              <DialogTrigger asChild>
                <Card
                  onClick={() => handleOpenDialog(item)}
                  className="cursor-pointer group hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <item.icon className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                    </div>
                    <span className="font-semibold text-lg">{item.name}</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] flex flex-col h-[80vh] max-h-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedExam?.name}</DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="flex-1 my-4 p-4 space-y-4 rounded-md border bg-muted/50">
                  {chat.map((msg, index) => (
                    <div
                      key={index}
                      className={cn('flex w-full items-start gap-3', {
                        'justify-end': msg.sender === 'USER',
                        'justify-start': msg.sender === 'AI' || msg.sender === 'SYSTEM',
                      })}
                    >
                      <div
                        className={cn('rounded-lg p-2 px-3 max-w-[90%] text-sm', {
                          'bg-primary text-primary-foreground': msg.sender === 'USER',
                          'bg-background': msg.sender === 'AI',
                          'text-center w-full bg-transparent text-muted-foreground italic': msg.sender === 'SYSTEM',
                        })}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isPending && (
                    <div className="flex justify-start">
                      <span className="p-2 bg-background rounded-lg inline-flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </span>
                    </div>
                  )}
                </ScrollArea>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="دستور خود را وارد کنید..."
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isPending}
                    />
                    <Button onClick={handleSendMessage} disabled={isPending || !currentInput.trim()} size="icon" className="flex-shrink-0">
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <SendHorizontal size={16}/>}
                    </Button>
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" className="w-full">
                        بستن
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
