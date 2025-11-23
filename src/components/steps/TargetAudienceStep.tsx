'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type TargetAudience } from '@/types';

interface TargetAudienceStepProps {
  data: Partial<TargetAudience>;
  onDataUpdate: (data: TargetAudience) => void;
}

const AGE_RANGES = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+'
];

const GENDERS = [
  'Male',
  'Female',
  'Non-binary',
  'All genders'
];

const INCOME_LEVELS = [
  'Low income (Under $30k)',
  'Middle income ($30k-$75k)',
  'Upper middle ($75k-$150k)',
  'High income ($150k+)',
  'Mixed income levels'
];

const COMMON_INTERESTS = [
  'Food & Dining',
  'Fashion & Beauty',
  'Health & Fitness',
  'Technology',
  'Travel',
  'Entertainment',
  'Sports',
  'Home & Garden',
  'Business & Finance',
  'Education',
  'Family & Parenting',
  'Art & Culture'
];

const BUYING_FREQUENCIES = [
  { value: 'rare', label: 'Rare (Few times per year)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' }
];

export function TargetAudienceStep({ data, onDataUpdate }: TargetAudienceStepProps) {
  const { register, watch, setValue } = useForm<TargetAudience>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.demographics?.ageRange && value.buyingFrequency) {
        onDataUpdate(value as TargetAudience);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-secondary-700 mb-2">
            Primary Age Range *
          </label>
          <select
            {...register('demographics.ageRange', { required: true })}
            className="form-select"
          >
            <option value="">Select age range</option>
            {AGE_RANGES.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="incomeLevel" className="block text-sm font-medium text-secondary-700 mb-2">
            Income Level *
          </label>
          <select
            {...register('demographics.incomeLevel', { required: true })}
            className="form-select"
          >
            <option value="">Select income level</option>
            {INCOME_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Gender *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {GENDERS.map(gender => (
            <label key={gender} className="flex items-center">
              <input
                type="checkbox"
                {...register('demographics.gender')}
                value={gender}
                className="form-checkbox"
              />
              <span className="ml-2">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
          Customer Location *
        </label>
        <input
          type="text"
          {...register('location', { required: true })}
          placeholder="e.g., Local area, nationwide, specific cities"
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Customer Interests *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMMON_INTERESTS.map(interest => (
            <label key={interest} className="flex items-center">
              <input
                type="checkbox"
                {...register('interests')}
                value={interest}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm">{interest}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-secondary-500 mt-2">
          Select interests that align with your target customers
        </p>
      </div>

      <div>
        <label htmlFor="buyingFrequency" className="block text-sm font-medium text-secondary-700 mb-2">
          How often do they typically buy your type of product/service? *
        </label>
        <select
          {...register('buyingFrequency', { required: true })}
          className="form-select"
        >
          <option value="">Select buying frequency</option>
          {BUYING_FREQUENCIES.map(freq => (
            <option key={freq.value} value={freq.value}>{freq.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}