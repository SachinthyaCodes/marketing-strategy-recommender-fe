'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
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
import { formDataProcessor, ProcessingOptions } from '@/services/formDataProcessor';

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
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<MarketingStrategyFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [processingResult, setProcessingResult] = useState<any>(null);

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
    setProcessingStatus('Validating form data...');
    
    try {
      // Validate form data completeness
      const validation = formDataProcessor.validateFormData(formData as MarketingStrategyFormData);
      
      if (!validation.isValid) {
        throw new Error(`Form is incomplete. Missing fields: ${validation.missingFields.join(', ')}`);
      }

      // Set processing options
      const processingOptions: ProcessingOptions = {
        enableTranslation: true,
        includeMetadata: true,
        removeEmptyFields: true,
      };

      // Process form data with language detection and translation
      setProcessingStatus('Detecting languages and translating content...');
      const result = await formDataProcessor.processAndSubmit(
        formData as MarketingStrategyFormData,
        processingOptions
      );

      if (result.success) {
        setProcessingResult(result);
        setProcessingStatus('Processing completed successfully!');
        
        // Show processing summary
        console.log('📊 Processing Summary:', {
          detectedLanguage: result.processingMetadata.detectedLanguage,
          translationApplied: result.processingMetadata.translationApplied,
          translatedFields: result.processingMetadata.translatedFieldsCount,
          processingTime: `${result.processingMetadata.totalProcessingTime}ms`,
          completionRate: `${result.processingMetadata.completionRate}%`,
        });

        // Log AI prompt for debugging
        if (result.aiPrompt) {
          console.log('🤖 Generated AI Prompt:', result.aiPrompt);
        }

        // Handle backend response
        if ('backendResponse' in result && result.backendResponse) {
          console.log('✅ Backend response:', result.backendResponse);
          const backendResult = result.backendResponse as any;
          
          // Show success message with submission details
          setProcessingStatus(`✅ Form submitted successfully! Redirecting to results...`);
          
          // Navigate to results page
          setTimeout(() => {
            router.push(`/results/${backendResult.id}`);
          }, 2000);
          
        } else if ('backendError' in result && result.backendError) {
          console.warn('⚠️ Backend submission failed:', result.backendError);
          setProcessingStatus(`⚠️ Processing completed but backend submission failed: ${result.backendError}`);
          // Show warning but still display processing results
        }

        // Option to download JSON
        if (result.data) {
          const jsonExport = formDataProcessor.exportAsJSON(result.data);
          console.log('💾 JSON export available:', jsonExport.filename);
          
          // Optionally trigger download
          const blob = new Blob([jsonExport.json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = jsonExport.filename;
          // Uncomment to auto-download: document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }

      } else {
        throw new Error(`Processing failed: ${result.errors?.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Form submission failed:', error);
      setProcessingStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        return <ReviewStep 
          data={formData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          processingStatus={processingStatus}
          processingResult={processingResult}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0B0F14]">
        <div className="min-h-screen">
          {/* Header */}
          <header className="border-b border-[#1F2933] bg-[#0B0F14]">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-[#F9FAFB] mb-1">Serendib AI</h1>
                  <p className="text-[#CBD5E1] text-sm">
                    Get personalized marketing strategies tailored to your business
                  </p>
                </div>
                <a
                  href="/dashboard"
                  className="px-6 py-2.5 bg-[#22C55E] text-[#0B0F14] rounded-lg hover:bg-[#16A34A] transition-colors font-medium text-sm"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </header>

          {/* Step Indicator */}
          <div className="max-w-4xl mx-auto px-8 py-12">
            <StepIndicator 
              steps={STEPS} 
              currentStepIndex={currentStepIndex}
              onStepClick={setCurrentStepIndex}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-8 pb-20">
            <div className="bg-[#0B0F14] border border-[#1F2933] rounded-2xl p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-[#F9FAFB] mb-2">
                  {currentStep.title}
                </h2>
                {currentStep.description && (
                  <p className="text-[#CBD5E1]">
                    {currentStep.description}
                  </p>
                )}
              </div>

              {renderCurrentStep()}

              {/* Navigation Buttons */}
              {currentStep.id !== 'review' && (
                <div className="flex justify-between mt-12 pt-8 border-t border-[#1F2933]">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="px-6 py-3 bg-[#0B0F14] text-[#F9FAFB] rounded-lg border border-[#1F2933] hover:border-[#CBD5E1]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#22C55E] text-[#0B0F14] rounded-lg font-medium hover:bg-[#16A34A] transition-all"
                  >
                    {currentStepIndex === STEPS.length - 2 ? 'Review' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}