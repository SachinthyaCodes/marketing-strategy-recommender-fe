'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type MarketingBudgetResources } from '@/types';

interface BudgetResourcesStepProps {
  data: Partial<MarketingBudgetResources>;
  onDataUpdate: (data: MarketingBudgetResources) => void;
}

const BUDGET_RANGES = [
  'Under $500/month',
  '$500 - $1,000/month',
  '$1,000 - $2,500/month',
  '$2,500 - $5,000/month',
  '$5,000 - $10,000/month',
  'Over $10,000/month'
];

const CONTENT_CAPACITIES = [
  'Professional photography',
  'Video creation',
  'Graphic design',
  'Content writing',
  'Social media management',
  'No content creation capacity'
];

export function BudgetResourcesStep({ data, onDataUpdate }: BudgetResourcesStepProps) {
  const { register, watch, setValue, handleSubmit } = useForm<MarketingBudgetResources>({
    defaultValues: data
  });

  const watchedData = watch();
  const hasMarketingTeam = watch('hasMarketingTeam');

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.monthlyBudget) {
        onDataUpdate(value as MarketingBudgetResources);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="monthlyBudget" className="block text-sm font-medium text-secondary-700 mb-2">
          Monthly Marketing Budget *
        </label>
        <select
          {...register('monthlyBudget', { required: true })}
          className="form-select"
        >
          <option value="">Select budget range</option>
          {BUDGET_RANGES.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Do you have a marketing team? *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              {...register('hasMarketingTeam', { required: true })}
              value="true"
              className="form-radio"
            />
            <span className="ml-2">Yes, we have a marketing team</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('hasMarketingTeam', { required: true })}
              value="false"
              className="form-radio"
            />
            <span className="ml-2">No, I handle marketing myself</span>
          </label>
        </div>
      </div>

      {hasMarketingTeam === 'true' && (
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-secondary-700 mb-2">
            Team Size
          </label>
          <input
            type="number"
            {...register('teamSize', { min: 1, max: 100 })}
            placeholder="Number of people in marketing team"
            className="form-input"
            min="1"
            max="100"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Content Creation Capacity *
        </label>
        <div className="space-y-3">
          {CONTENT_CAPACITIES.map(capacity => (
            <label key={capacity} className="flex items-center">
              <input
                type="checkbox"
                {...register('contentCreationCapacity')}
                value={capacity}
                className="form-checkbox"
              />
              <span className="ml-2">{capacity}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-secondary-500 mt-2">
          Select all that apply to your business
        </p>
      </div>
    </div>
  );
}