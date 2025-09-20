'use client';

import { useCaseStep } from '@/app/dashboard/student/cases/[caseId]/_components/CaseStepProvider';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export enum CharacterExpression {
  CALM = 0,
  HAPPY = 1,
  SAD = 2,
  IRRITATED = 3,
  CONFUSED = 4,
  GRATEFUL = 5,
  // CALM = 0,
  // HAPPY = 1,
  // SAD = 2,
  // FEARFUL = 3,
  // ANGRY = 4,
  // SURPRISED = 5,
  // DISGURSTED = 6,
  // CONFUSED = 7,
  // CRY = 8,
}

// Defines the props the component will accept
interface CharacterProps {
  className?: string; // Optional className for custom styling
}

export default function Character({ className }: CharacterProps) {
  const {emotionalState} = useCaseStep()
  // 1. Hook to load your Rive file and get the component to render
  const { rive, RiveComponent } = useRive({
    src: '/rives/main.riv',
    stateMachines: 'ExpressionController',
    autoplay: true,
  });

  // 2. Hook to get a reference to the "expressionState" input from the State Machine
  const expressionStateInput = useStateMachineInput(
    rive,
    'ExpressionController',
    'expressionState'
  );

  // 3. This effect runs whenever the `expression` prop changes
  useEffect(() => {
    // Make sure the input from Rive is ready before trying to change its value
    if (expressionStateInput) {
      expressionStateInput.value = emotionalState;
    }
  }, [emotionalState, expressionStateInput]);

  return (
    <div className={className}>
      <RiveComponent
        style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
      />
    </div>
  );
}