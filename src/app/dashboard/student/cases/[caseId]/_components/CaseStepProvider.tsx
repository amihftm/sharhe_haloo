// app/cases/[caseId]/_components/CaseStepProvider.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCaseProgress, getOrCreateCaseAttempt } from '@/lib/actions/case.actions';
import { useParams } from 'next/navigation';

interface CaseStepContextType {
  highestCompletedStep: number;
  completeStep: (stepIndex: number) => void;
  isProgressLoading: boolean;
  emotionalState: number;
  setEmtionalState: (state: number) => void;
  history_taken: object;
  setTaken_history: (hr: object) => void;
  attemptId: string | null;
}

const CaseStepContext = createContext<CaseStepContextType | undefined>(undefined);

export function CaseStepProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const caseId = params.caseId as string;
  const [emotionalState, setEmtionalState] = useState(0)

  const [highestCompletedStep, setHighestCompletedStep] = useState(-1);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [taken_history, setTaken_history] = useState({})
  const [attemptId, setAttemptId] = useState<string | null>(null)

  // Fetch initial progress when the provider mounts
  useEffect(() => {
    if (!caseId) return;

    const fetchProgress = async () => {
      setIsProgressLoading(true);

      const caseAttempt = await getOrCreateCaseAttempt(caseId)
      if (caseAttempt.success) {
        caseAttempt.data?.attemptId && setAttemptId(caseAttempt.data?.attemptId)
        caseAttempt.data?.writtenHistory && setTaken_history(caseAttempt.data?.writtenHistory);
      }

      const result = await getCaseProgress(caseId);
      if (result.success && typeof result.data?.highestCompletedStep === 'number') {
        setHighestCompletedStep(result.data.highestCompletedStep);
      }
      setIsProgressLoading(false);
    };

    fetchProgress();
  }, [caseId]);

  const completeStep = (stepIndex: number) => {
    setHighestCompletedStep((prev) => Math.max(prev, stepIndex));
  };

  const value = {
    highestCompletedStep,
    completeStep,
    isProgressLoading,
    emotionalState,
    setEmtionalState,
    history_taken: taken_history,
    setTaken_history,
    attemptId,
  };

  return (
    <CaseStepContext.Provider value={value}>
      {children}
    </CaseStepContext.Provider>
  );
}

export function useCaseStep() {
  const context = useContext(CaseStepContext);
  if (context === undefined) {
    throw new Error('useCaseStep must be used within a CaseStepProvider');
  }
  return context;
}
