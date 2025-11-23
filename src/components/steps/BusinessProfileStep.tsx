'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type BusinessProfile } from '@/types';

interface BusinessProfileStepProps {
  data: Partial<BusinessProfile>;
  onDataUpdate: (data: BusinessProfile) => void;
}

const BUSINESS_TYPES = [
  'Restaurant/Food',
  'Retail/E-commerce',
  'Healthcare',
  'Education',
  'Technology',
  'Construction',
  'Beauty/Wellness',
  'Professional Services',
  'Entertainment',
  'Real Estate',
  'Manufacturing',
  'Other'
];

const BUSINESS_SIZES = [
  { value: 'solo', label: 'Solo (Just me)' },
  { value: 'small-team', label: 'Small Team (2-10 people)' },
  { value: 'medium', label: 'Medium (11-50 people)' },
  { value: 'large', label: 'Large (50+ people)' }
];

const BUSINESS_STAGES = [
  { value: 'new', label: 'New (0-1 years)' },
  { value: 'growing', label: 'Growing (1-3 years)' },
  { value: 'established', label: 'Established (3+ years)' }
];

export function BusinessProfileStep({ data, onDataUpdate }: BusinessProfileStepProps) {
  const { register, watch, handleSubmit, setValue } = useForm<BusinessProfile>({
    defaultValues: data
  });

  const watchedData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.businessType && value.businessSize && value.businessStage) {
        onDataUpdate(value as BusinessProfile);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-secondary-700 mb-2">
            Business Type / Industry *
          </label>
          <select
            {...register('businessType', { required: true })}
            className="form-select"
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-secondary-700 mb-2">
            Specific Industry (Optional)
          </label>
          <input
            type="text"
            {...register('industry')}
            placeholder="e.g., Italian Restaurant, Fashion Retail"
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="businessSize" className="block text-sm font-medium text-secondary-700 mb-2">
            Business Size *
          </label>
          <select
            {...register('businessSize', { required: true })}
            className="form-select"
          >
            <option value="">Select business size</option>
            {BUSINESS_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="businessStage" className="block text-sm font-medium text-secondary-700 mb-2">
            Business Stage *
          </label>
          <select
            {...register('businessStage', { required: true })}
            className="form-select"
          >
            <option value="">Select business stage</option>
            {BUSINESS_STAGES.map(stage => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-2">
            City *
          </label>
          <input
            type="text"
            {...register('location.city', { required: true })}
            placeholder="Your city"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-secondary-700 mb-2">
            District/Area
          </label>
          <input
            type="text"
            {...register('location.district')}
            placeholder="District or area"
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="productsServices" className="block text-sm font-medium text-secondary-700 mb-2">
          Products / Services Description *
        </label>
        <textarea
          {...register('productsServices', { required: true })}
          rows={3}
          placeholder="Briefly describe what you sell or offer"
          className="form-textarea"
        />
      </div>

      <div>
        <label htmlFor="uniqueSellingProposition" className="block text-sm font-medium text-secondary-700 mb-2">
          Unique Selling Proposition (USP) *
        </label>
        <textarea
          {...register('uniqueSellingProposition', { required: true })}
          rows={3}
          placeholder="What makes your business different from competitors?"
          className="form-textarea"
        />
      </div>
    </div>
  );
}