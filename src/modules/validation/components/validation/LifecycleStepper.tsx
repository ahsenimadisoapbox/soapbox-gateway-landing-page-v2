import React from 'react';
import { Check, Lock, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { LifecycleStep } from '../../context/AppContext';

interface LifecycleStepperProps {
  currentStep: LifecycleStep;
  completedSteps: LifecycleStep[];
  compact?: boolean;
}

interface StepConfig {
  key: LifecycleStep;
  label: string;
  shortLabel: string;
}

const steps: StepConfig[] = [
  { key: 'initiation', label: 'Initiation', shortLabel: 'Init' },
  { key: 'intended-use', label: 'Intended Use', shortLabel: 'Use' },
  { key: 'risk-assessment', label: 'Risk Assessment', shortLabel: 'Risk' },
  { key: 'strategy', label: 'Strategy', shortLabel: 'Strat' },
  { key: 'requirements', label: 'Requirements & RTM', shortLabel: 'Req' },
  { key: 'test-protocols', label: 'Test Protocols', shortLabel: 'Proto' },
  { key: 'test-execution', label: 'Test Execution', shortLabel: 'Exec' },
  { key: 'deviation-handling', label: 'Deviations', shortLabel: 'Dev' },
  { key: 'validation-summary', label: 'Summary Report', shortLabel: 'VSR' },
  { key: 'release', label: 'Release', shortLabel: 'Rel' },
  { key: 'validated', label: 'Validated', shortLabel: 'Valid' },
  { key: 'continuous', label: 'Continuous', shortLabel: 'Cont' },
];

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  currentStep,
  completedSteps,
  compact = false,
}) => {
  const getStepStatus = (step: LifecycleStep): 'complete' | 'current' | 'pending' => {
    if (completedSteps.includes(step)) return 'complete';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (status: 'complete' | 'current' | 'pending') => {
    switch (status) {
      case 'complete':
        return <Check size={compact ? 12 : 14} className="text-step-complete" />;
      case 'current':
        return <Circle size={compact ? 12 : 14} className="text-step-current fill-step-current" />;
      default:
        return <Circle size={compact ? 12 : 14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-1 overflow-x-auto pb-2',
      compact && 'gap-0.5'
    )}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.key);
        return (
          <React.Fragment key={step.key}>
            <div
              className={cn(
                'lifecycle-step flex-shrink-0',
                status === 'complete' && 'lifecycle-step-complete',
                status === 'current' && 'lifecycle-step-current',
                status === 'pending' && 'lifecycle-step-pending',
                compact && 'px-2 py-1'
              )}
              title={step.label}
            >
              <span className="flex-shrink-0">{getStepIcon(status)}</span>
              <span className={cn(
                compact ? 'text-xs' : 'text-sm',
                'whitespace-nowrap'
              )}>
                {compact ? step.shortLabel : step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-px flex-shrink-0',
                  compact ? 'w-2' : 'w-4',
                  status === 'complete' ? 'bg-step-complete' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
