'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type CurrentChallenges } from '@/types';

interface CurrentChallengesStepProps {
  data: Partial<CurrentChallenges>;
  onDataUpdate: (data: CurrentChallenges) => void;
}

const COMMON_CHALLENGES = [
  {
    id: 'low-reach',
    title: 'Low Reach',
    description: 'Not enough people seeing my content or ads'
  },
  {
    id: 'low-conversion',
    title: 'Low Conversion',
    description: 'People see my content but don\'t take action'
  },
  {
    id: 'content-creation',
    title: 'Cannot Create Content',
    description: 'Struggle with creating engaging posts, videos, or images'
  },
  {
    id: 'competitor-pressure',
    title: 'Competitor Pressure',
    description: 'Competitors are getting more attention than me'
  },
  {
    id: 'inconsistent-posting',
    title: 'Inconsistent Posting',
    description: 'Can\'t maintain regular posting schedule'
  },
  {
    id: 'limited-budget',
    title: 'Limited Budget',
    description: 'Not enough money to invest in effective marketing'
  },
  {
    id: 'no-strategy',
    title: 'No Clear Strategy',
    description: 'Don\'t know what marketing approach to take'
  },
  {
    id: 'measuring-roi',
    title: 'Measuring ROI',
    description: 'Can\'t tell if marketing efforts are working'
  },
  {
    id: 'target-audience',
    title: 'Finding Target Audience',
    description: 'Not sure who my ideal customers are'
  },
  {
    id: 'platform-confusion',
    title: 'Platform Confusion',
    description: 'Don\'t know which platforms to focus on'
  },
  {
    id: 'time-management',
    title: 'Time Management',
    description: 'Not enough time to manage marketing effectively'
  },
  {
    id: 'staying-updated',
    title: 'Staying Updated',
    description: 'Marketing trends and algorithms change too fast'
  }
];

export function CurrentChallengesStep({ data, onDataUpdate }: CurrentChallengesStepProps) {
  const { register, watch, setValue } = useForm<CurrentChallenges>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onDataUpdate(value as CurrentChallenges);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          What are your current marketing challenges? *
        </label>
        <p className="text-sm text-secondary-600 mb-4">
          Select all challenges that apply to your business. This helps us create a strategy that addresses your specific needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_CHALLENGES.map(challenge => (
            <label key={challenge.id} className="flex items-start p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                {...register('challenges')}
                value={challenge.id}
                className="form-checkbox mt-1 flex-shrink-0"
              />
              <div className="ml-3">
                <span className="font-medium text-secondary-900 block">
                  {challenge.title}
                </span>
                <p className="text-sm text-secondary-600 mt-1">
                  {challenge.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="additionalChallenges" className="block text-sm font-medium text-secondary-700 mb-2">
          Additional Challenges (Optional)
        </label>
        <textarea
          {...register('additionalChallenges')}
          rows={4}
          placeholder="Describe any other specific challenges you're facing with marketing that weren't listed above..."
          className="form-textarea"
        />
        <p className="text-xs text-secondary-500 mt-2">
          Be as specific as possible to help us create a more targeted strategy
        </p>
      </div>
    </div>
  );
}