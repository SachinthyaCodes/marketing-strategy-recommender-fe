import { Check } from 'lucide-react';
import { type StepConfig } from '@/types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStepIndex: number;
  onStepClick: (stepIndex: number) => void;
}

export function StepIndicator({ steps, currentStepIndex, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-success-600 text-white shadow-md'
                        : isActive
                        ? 'bg-primary-600 text-white shadow-lg ring-4 ring-primary-100'
                        : 'bg-secondary-200 text-secondary-600'
                    }
                    ${
                      isClickable
                        ? 'hover:scale-105 cursor-pointer'
                        : 'cursor-not-allowed opacity-60'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                <p className={`mt-2 text-xs font-medium text-center max-w-20 leading-tight ${
                  isActive ? 'text-primary-700' : 
                  isCompleted ? 'text-success-700' : 'text-secondary-500'
                }`}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-px w-16 mx-2 mt-[-24px] ${
                  isCompleted ? 'bg-success-300' : 'bg-secondary-300'
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}