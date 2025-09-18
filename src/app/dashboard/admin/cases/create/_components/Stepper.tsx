'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  Icon: LucideIcon;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', { 'flex-1': stepIdx !== steps.length - 1 })}>
            <>
              <div className="flex items-center font-medium">
                <motion.div
                  initial={false}
                  animate={currentStep > stepIdx ? 'completed' : currentStep === stepIdx ? 'current' : 'upcoming'}
                  variants={{
                    completed: { scale: 1, backgroundColor: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' },
                    current: { scale: 1.1, backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--primary))' },
                    upcoming: { scale: 1, backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' },
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2"
                >
                  {currentStep > stepIdx ? (
                    <Check className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <step.Icon
                      className={cn('h-6 w-6', {
                        'text-primary': currentStep === stepIdx,
                        'text-muted-foreground': currentStep < stepIdx,
                      })}
                    />
                  )}
                </motion.div>
                <span className="mr-4 hidden sm:block text-sm font-medium">{step.name}</span>
              </div>

              {/* Connecting line */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute right-[calc(100%+1rem)] top-1/2 h-0.5 w-[calc(100%-4rem)] -translate-y-1/2" aria-hidden="true">
                  <motion.div
                    className="h-full w-full bg-border"
                    initial={false}
                    animate={{ backgroundColor: currentStep > stepIdx ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>
              )}
            </>
          </li>
        ))}
      </ol>
    </nav>
  );
};
