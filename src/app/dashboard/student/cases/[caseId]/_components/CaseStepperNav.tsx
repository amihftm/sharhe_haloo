'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCaseStep } from './CaseStepProvider';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  NotebookPen,
  FileText,
  Beaker,
  ListFilter,
  GraduationCap,
} from 'lucide-react';

// Define the structure of our sequential steps.
const navSteps = [
  {
    stepIndex: 0,
    label: 'شرح حال و معاینه',
    icon: NotebookPen,
    subPages: [
      { value: 'history', label: 'شرح حال', path: 'history' },
      { value: 'examination', label: 'معاینه', path: 'examination' },
    ],
  },
  { stepIndex: 1, label: 'نوشتن شرح حال', icon: FileText, path: 'writing' },
  // { stepIndex: 2, label: 'درخواست آزمایش', icon: Beaker, path: 'investigations' },
  { stepIndex: 2, label: 'تحلیل تستی', icon: Beaker, path: 'investigations' },
  { stepIndex: 3, label: 'تشخیص افتراقی', icon: ListFilter, path: 'diagnosis' },
  { stepIndex: 4, label: 'گزارش نهایی', icon: GraduationCap, path: 'report' },
];

/**
 * Renders the main stepper navigation for the simulation.
 * It dynamically enables/disables steps based on user progress
 * and is responsive for mobile devices.
 */
export function CaseStepperNav() {
  const pathname = usePathname();
  const { highestCompletedStep } = useCaseStep();

  const currentPath = pathname.split('/').pop() || 'history';

  // Determine the current active step index from the URL.
  const currentStepIndex = navSteps.findIndex(step => 
    step.subPages ? step.subPages.some(p => p.path === currentPath) : step.path === currentPath
  );
  
  return (
    <nav className="flex w-full flex-col items-center gap-4">
      {/* Scrollable container for the main stepper on small screens */}
      <div className="w-full overflow-x-auto pb-2 lg:overflow-x-visible">
        {/* Stepper UI with a minimum width to enforce scrolling instead of breaking */}
        <div className="flex w-full items-center justify-start lg:justify-center min-w-[500px] lg:min-w-full" dir="rtl">
          {navSteps.map((step, index) => {
            const isAccessible = index <= highestCompletedStep + 1;
            const isActive = currentStepIndex === index;
            const isCompleted = index <= highestCompletedStep;
            const targetPath = step.subPages ? step.subPages[0].path : step.path!;

            return (
              <div key={step.stepIndex} className="flex flex-1 items-center">
                {/* The clickable step icon and label */}
                <Link
                  href={isAccessible ? `./${targetPath}` : '#'}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors duration-200 w-28', // Increased width for better spacing
                    !isAccessible && 'cursor-not-allowed opacity-40',
                    isAccessible && 'hover:bg-muted',
                    isActive && 'text-primary'
                  )}
                  aria-disabled={!isAccessible}
                  onClick={(e) => !isAccessible && e.preventDefault()}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all",
                    isActive ? "border-primary scale-110" : "border-border",
                    isCompleted ? "bg-primary text-primary-foreground border-primary" : "bg-muted"
                  )}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">{step.label}</span>
                </Link>
                
                {/* The connector line between steps */}
                {index < navSteps.length - 1 && (
                   <div className={cn(
                      "h-1 flex-1 transition-colors",
                      isCompleted ? "bg-primary" : "bg-border"
                   )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-navigation for Step 0 (History/Examination) */}
      {currentStepIndex === 0 && (
        <div className="mt-2">
          <Tabs value={currentPath} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1.5 bg-muted/60 backdrop-blur-sm rounded-full shadow-md border border-border/30" dir='rtl'>
              {navSteps[0].subPages!.map((subPage) => (
                <TabsTrigger
                  key={subPage.value}
                  asChild
                  value={subPage.value}
                  className="text-sm font-semibold py-2.5 px-4 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 ease-in-out"
                >
                  <Link href={`./${subPage.path}`}>
                    {subPage.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
    </nav>
  );
}
