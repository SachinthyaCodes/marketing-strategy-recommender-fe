'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type BusinessGoals } from '@/types';

interface BusinessGoalsStepProps {
  data: Partial<BusinessGoals>;
  onDataUpdate: (data: BusinessGoals) => void;
}

const PRIMARY_GOALS = [
  { value: 'brand-awareness', label: 'Brand Awareness', description: 'Get more people to know about your business' },
  { value: 'leads', label: 'Generate Leads', description: 'Get potential customers to contact you' },
  { value: 'sales', label: 'Increase Sales', description: 'Drive direct sales and revenue' },
  { value: 'customer-retention', label: 'Customer Retention', description: 'Keep existing customers engaged' },
  { value: 'local-visits', label: 'Local Store Visits', description: 'Drive foot traffic to physical location' },
  { value: 'online-traffic', label: 'Website Traffic', description: 'Increase visitors to your website' }
];

const SECONDARY_GOALS = [
  'Build community engagement',
  'Educate customers about products',
  'Showcase customer testimonials',
  'Promote special offers/discounts',
  'Launch new products/services',
  'Compete with industry leaders',
  'Establish thought leadership',
  'Improve customer service reputation'
];

export function BusinessGoalsStep({ data, onDataUpdate }: BusinessGoalsStepProps) {
  const { register, watch, setValue } = useForm<BusinessGoals>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.primaryGoal) {
        onDataUpdate(value as BusinessGoals);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Primary Marketing Goal *
        </label>
        <div className="space-y-3">
          {PRIMARY_GOALS.map(goal => (
            <label key={goal.value} className="flex items-start p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="radio"
                {...register('primaryGoal', { required: true })}
                value={goal.value}
                className="form-radio mt-1"
              />
              <div className="ml-3">
                <span className="font-medium text-secondary-900">{goal.label}</span>
                <p className="text-sm text-secondary-600 mt-1">{goal.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Secondary Goals (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECONDARY_GOALS.map(goal => (
            <label key={goal} className="flex items-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                {...register('secondaryGoals')}
                value={goal}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm">{goal}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-secondary-500 mt-2">
          Select any additional goals that are important to your business
        </p>
      </div>
    </div>
  );
}