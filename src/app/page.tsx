'use client';

import { useState } from 'react';
import { StepIndicator } from '@/components/StepIndicator';
import { BusinessProfileStep } from '@/components/steps/BusinessProfileStep';
import { BudgetResourcesStep } from '@/components/steps/BudgetResourcesStep';
import { BusinessGoalsStep } from '@/components/steps/BusinessGoalsStep';
import { TargetAudienceStep } from '@/components/steps/TargetAudienceStep';
import { PlatformsPreferencesStep } from '@/components/steps/PlatformsPreferencesStep';
import { CurrentChallengesStep } from '@/components/steps/CurrentChallengesStep';
import { StrengthsOpportunitiesStep } from '@/components/steps/StrengthsOpportunitiesStep';
import { MarketSituationStep } from '@/components/steps/MarketSituationStep';
import { ReviewStep } from '@/components/steps/ReviewStep';
import { type FormStep, type MarketingStrategyFormData, type StepConfig } from '@/types';

const STEPS: StepConfig[] = [
  {
    id: 'business-profile',
    title: 'Business Profile',
    description: ''
  },
  {
    id: 'budget-resources',
    title: 'Budget & Resources',
    description: ''
  },
  {
    id: 'business-goals',
    title: 'Business Goals',
    description: ''
  },
  {
    id: 'target-audience',
    title: 'Target Audience',
    description: ''
  },
  {
    id: 'platforms-preferences',
    title: 'Platforms & Assets',
    description: ''
  },
  {
    id: 'current-challenges',
    title: 'Current Challenges',
    description: ''
  },
  {
    id: 'strengths-opportunities',
    title: 'Strengths & Opportunities',
    description: ''
  },
  {
    id: 'market-situation',
    title: 'Market Situation',
    description: ''
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: ''
  }
];

export default function Home() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<MarketingStrategyFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepDataUpdate = (stepData: any) => {
    setFormData(prev => ({
      ...prev,
      [currentStep.id.replace('-', '')]: stepData
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Submit to FastAPI backend
      const response = await fetch('/api/strategy-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Strategy recommendations:', result);
        // Handle success - maybe navigate to results page
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: formData[currentStep.id.replace('-', '') as keyof MarketingStrategyFormData] || {},
      onDataUpdate: handleStepDataUpdate,
    };

    switch (currentStep.id) {
      case 'business-profile':
        return <BusinessProfileStep {...stepProps} />;
      case 'budget-resources':
        return <BudgetResourcesStep {...stepProps} />;
      case 'business-goals':
        return <BusinessGoalsStep {...stepProps} />;
      case 'target-audience':
        return <TargetAudienceStep {...stepProps} />;
      case 'platforms-preferences':
        return <PlatformsPreferencesStep {...stepProps} />;
      case 'current-challenges':
        return <CurrentChallengesStep {...stepProps} />;
      case 'strengths-opportunities':
        return <StrengthsOpportunitiesStep {...stepProps} />;
      case 'market-situation':
        return <MarketSituationStep {...stepProps} />;
      case 'review':
        return <ReviewStep data={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-secondary-900">
            Marketing Strategy Recommender
          </h1>
          <p className="text-secondary-600 mt-1">
            Get personalized marketing strategies tailored to your business
          </p>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator 
          steps={STEPS} 
          currentStepIndex={currentStepIndex}
          onStepClick={setCurrentStepIndex}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              {currentStep.title}
            </h2>
            <p className="text-secondary-600 mt-1">
              {currentStep.description}
            </p>
          </div>

          {renderCurrentStep()}

          {/* Navigation Buttons */}
          {currentStep.id !== 'review' && (
            <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {currentStepIndex === STEPS.length - 2 ? 'Review' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}