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
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]'
                        : isActive
                        ? 'bg-[#22C55E] text-[#0B0F14]'
                        : 'bg-[#1F2933] text-[#CBD5E1] border border-[#1F2933]'
                    }
                    ${
                      isClickable
                        ? 'hover:scale-105 cursor-pointer'
                        : 'cursor-not-allowed opacity-40'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                <p className={`mt-3 text-xs font-medium text-center max-w-20 leading-tight ${
                  isActive ? 'text-[#F9FAFB]' : 
                  isCompleted ? 'text-[#22C55E]' : 'text-[#CBD5E1]/60'
                }`}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-px w-12 mx-3 mt-[-28px] ${
                  isCompleted ? 'bg-[#22C55E]/40' : 'bg-[#1F2933]'
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}