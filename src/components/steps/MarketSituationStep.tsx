'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';
import { type MarketSituation } from '@/types';

interface MarketSituationStepProps {
  data: Partial<MarketSituation>;
  onDataUpdate: (data: MarketSituation) => void;
}

const SEASONALITY_CATEGORIES = {
  'Religious & Cultural Festivals': [
    'Sinhala & Tamil New Year (April)',
    'Vesak (May)',
    'Poson (June)',
    'Christian Festivals',
    'Christmas (December)',
    'New Year (January 1st)',
    'Diwali / Deepavali (Oct–Nov)',
    'Nallur Festival (Aug–Sept)',
    'Ramadan & Eid-ul-Fitr (Dates vary)',
    'Eid-ul-Adha (Dates vary)',
    'Kandy Esala Perahera (July–Aug)',
    'Kataragama Festival (July)'
  ],
  'Education-Related Seasons': [
    'Back-to-School season (Dec–Jan)',
    'O/L Exam season (December)',
    'A/L Exam season (August)',
    'University admission periods (Feb–Mar & Oct–Nov)'
  ],
  'Weather & Climate Seasons': [
    'South-West Monsoon (May–Sept)',
    'North-East Monsoon (Dec–Feb)',
    'December – April (Tourist peak)',
    'July – August (Regional tourism for cultural festivals)',
    'Rainy season boosts food delivery, reduces physical shopping',
    'Dry season boosts outdoor events, travel, clothing'
  ],
  'Economic & Financial Cycles': [
    'Salary Cycle (25th–5th of every month)',
    'Mid-month low-spending period',
    'Government Budget Season (November)',
    'Inflation spikes / economic uncertainty months',
    'Harvest seasons impacting food prices'
  ],
  'Industry-Specific Seasons': [
    'Wedding Seasons (December–March)',
    'Wedding Seasons (August–September)',
    'Foreign tourist peak (Dec–April)',
    'Festival-driven tourism (July–August)'
  ],
  'Holiday & Lifestyle Seasons': [
    'School holidays (April, August, December)',
    'Summer/long vacation period (April–August)',
    'Special shopping seasons (Year-end December)',
    'Fitness/New Year resolution season (January)'
  ],
  'Sports Seasons': [
    'Major cricket series (varies)',
    'World Cup / Asia Cup seasons',
    'IPL season (March–May)'
  ],
  'Local Event Seasons': [
    'Jaffna festivals & cultural events',
    'Colombo International Book Fair (Sept)',
    'Trade exhibitions (BMICH season)',
    'Local fairs & seasonal pop-ups'
  ],
  'Low-Spending Periods': [
    'September (traditionally slow month)',
    'Post–New Year slump (May)',
    'Post-festival months (after April, after December)'
  ]
};

const STOCK_AVAILABILITY_OPTIONS = [
  { value: 'always-available', label: 'Always Available', description: 'Products/services are consistently available' },
  { value: 'seasonal', label: 'Seasonal', description: 'Availability depends on seasons or specific times' },
  { value: 'limited', label: 'Limited Stock', description: 'Limited quantity, first-come-first-served' },
  { value: 'pre-order', label: 'Pre-order/Made-to-order', description: 'Custom orders or advance booking required' }
];

export function MarketSituationStep({ data, onDataUpdate }: MarketSituationStepProps) {
  const { register, watch, setValue, getValues } = useForm<MarketSituation>({
    defaultValues: {
      ...data,
      seasonality: data.seasonality || []
    }
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedSeasonality, setSelectedSeasonality] = useState<{
    category: string;
    subcategories: string[];
  }[]>(data.seasonality || []);

  const recentPriceChanges = watch('recentPriceChanges');
  const seasonalityOther = watch('seasonalityOther');

  useEffect(() => {
    const subscription = watch((value) => {
      const updatedData = {
        ...value,
        seasonality: selectedSeasonality
      } as MarketSituation;
      onDataUpdate(updatedData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataUpdate, selectedSeasonality]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubcategoryChange = (category: string, subcategory: string, checked: boolean) => {
    setSelectedSeasonality(prev => {
      const existingCategoryIndex = prev.findIndex(item => item.category === category);
      
      if (checked) {
        if (existingCategoryIndex >= 0) {
          // Add to existing category
          const updated = [...prev];
          updated[existingCategoryIndex] = {
            ...updated[existingCategoryIndex],
            subcategories: [...updated[existingCategoryIndex].subcategories, subcategory]
          };
          return updated;
        } else {
          // Create new category
          return [...prev, { category, subcategories: [subcategory] }];
        }
      } else {
        if (existingCategoryIndex >= 0) {
          // Remove from existing category
          const updated = [...prev];
          const filteredSubcategories = updated[existingCategoryIndex].subcategories.filter(
            sub => sub !== subcategory
          );
          
          if (filteredSubcategories.length === 0) {
            // Remove category if no subcategories left
            return updated.filter((_, index) => index !== existingCategoryIndex);
          } else {
            updated[existingCategoryIndex] = {
              ...updated[existingCategoryIndex],
              subcategories: filteredSubcategories
            };
            return updated;
          }
        }
        return prev;
      }
    });
  };

  const isSubcategorySelected = (category: string, subcategory: string) => {
    const categoryData = selectedSeasonality.find(item => item.category === category);
    return categoryData ? categoryData.subcategories.includes(subcategory) : false;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Seasonality Factors *
        </label>
        <p className="text-sm text-secondary-600 mb-4">
          When does your business typically perform better or face challenges? Select relevant seasonal factors that affect your business.
        </p>
        
        <div className="space-y-4">
          {Object.entries(SEASONALITY_CATEGORIES).map(([category, subcategories]) => (
            <div key={category} className="border border-secondary-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
              >
                <span className="font-medium text-secondary-900">{category}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-secondary-500 transition-transform ${
                    expandedCategories[category] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedCategories[category] && (
                <div className="border-t border-secondary-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subcategories.map(subcategory => (
                      <label key={subcategory} className="flex items-start p-3 border border-secondary-100 rounded hover:bg-secondary-25 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isSubcategorySelected(category, subcategory)}
                          onChange={(e) => handleSubcategoryChange(category, subcategory, e.target.checked)}
                          className="form-checkbox mt-1"
                        />
                        <span className="ml-2 text-sm text-secondary-700">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Other category with input field */}
          <div className="border border-secondary-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleCategory('Other')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
            >
              <span className="font-medium text-secondary-900">Other</span>
              <ChevronDownIcon 
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  expandedCategories['Other'] ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedCategories['Other'] && (
              <div className="border-t border-secondary-200 p-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Please specify other seasonal factors:
                </label>
                <textarea
                  {...register('seasonalityOther')}
                  rows={3}
                  placeholder="Describe any other seasonal factors that affect your business..."
                  className="form-textarea"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="competitorBehavior" className="block text-sm font-medium text-secondary-700 mb-2">
          Current Competitor Behavior
        </label>
        <textarea
          {...register('competitorBehavior')}
          rows={4}
          placeholder="What are your competitors doing lately? Any new ads, promotions, or strategies you've noticed?"
          className="form-textarea"
        />
        <p className="text-xs text-secondary-500 mt-2">
          This helps us understand the competitive landscape and find opportunities
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Stock/Service Availability *
        </label>
        <div className="space-y-3">
          {STOCK_AVAILABILITY_OPTIONS.map(option => (
            <label key={option.value} className="flex items-start p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="radio"
                {...register('stockAvailability', { required: true })}
                value={option.value}
                className="form-radio mt-1"
              />
              <div className="ml-3">
                <span className="font-medium text-secondary-900">{option.label}</span>
                <p className="text-sm text-secondary-600 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Recent Price Changes *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              {...register('recentPriceChanges', { required: true })}
              value="true"
              className="form-radio"
            />
            <span className="ml-2">Yes, we've recently changed our prices</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('recentPriceChanges', { required: true })}
              value="false"
              className="form-radio"
            />
            <span className="ml-2">No recent price changes</span>
          </label>
        </div>
      </div>

      {recentPriceChanges === 'true' && (
        <div>
          <label htmlFor="priceChangeDetails" className="block text-sm font-medium text-secondary-700 mb-2">
            Price Change Details
          </label>
          <textarea
            {...register('priceChangeDetails')}
            rows={3}
            placeholder="Describe the price changes (increased/decreased, by how much, when, reasons)..."
            className="form-textarea"
          />
          <p className="text-xs text-secondary-500 mt-2">
            This helps us craft messaging around value proposition and positioning
          </p>
        </div>
      )}

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h4 className="font-medium text-primary-900 mb-2">
          Why This Information Matters
        </h4>
        <p className="text-sm text-primary-700">
          Understanding your market situation helps us recommend the right timing for campaigns, 
          messaging strategies, and competitive positioning to maximize your marketing effectiveness.
        </p>
      </div>
    </div>
  );
}