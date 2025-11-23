// Types for the marketing strategy form data
export interface BusinessProfile {
  businessType: string;
  industry: string;
  businessSize: 'solo' | 'small-team' | 'medium' | 'large';
  location: {
    city: string;
    district: string;
  };
  businessStage: 'new' | 'growing' | 'established';
  productsServices: string;
  uniqueSellingProposition: string;
}

export interface MarketingBudgetResources {
  monthlyBudget: string;
  hasMarketingTeam: boolean;
  teamSize?: number;
  contentCreationCapacity: string[];
}

export interface BusinessGoals {
  primaryGoal: 'brand-awareness' | 'leads' | 'sales' | 'customer-retention' | 'local-visits' | 'online-traffic';
  secondaryGoals: string[];
}

export interface TargetAudience {
  demographics: {
    ageRange: string;
    gender: string[];
    incomeLevel: string;
  };
  location: string;
  interests: string[];
  buyingFrequency: 'rare' | 'monthly' | 'weekly' | 'daily';
}

export interface PlatformsPreferences {
  preferredPlatforms: string[];
  platformExperience: Record<string, 'none' | 'beginner' | 'intermediate' | 'advanced'>;
  brandAssets: {
    hasLogo: boolean;
    hasBrandStyle: boolean;
    brandColors: string[];
  };
}

export interface CurrentChallenges {
  challenges: string[];
  additionalChallenges?: string;
}

export interface StrengthsOpportunities {
  strengths: string[];
  opportunities: string[];
  additionalNotes?: string;
}

export interface MarketSituation {
  seasonality: {
    category: string;
    subcategories: string[];
  }[];
  seasonalityOther?: string;
  competitorBehavior: string;
  stockAvailability: 'always-available' | 'seasonal' | 'limited' | 'pre-order';
  recentPriceChanges: boolean;
  priceChangeDetails?: string;
}

export interface MarketingStrategyFormData {
  businessProfile: BusinessProfile;
  budgetResources: MarketingBudgetResources;
  businessGoals: BusinessGoals;
  targetAudience: TargetAudience;
  platformsPreferences: PlatformsPreferences;
  currentChallenges: CurrentChallenges;
  strengthsOpportunities: StrengthsOpportunities;
  marketSituation: MarketSituation;
}

export type FormStep = 
  | 'business-profile'
  | 'budget-resources' 
  | 'business-goals'
  | 'target-audience'
  | 'platforms-preferences'
  | 'current-challenges'
  | 'strengths-opportunities'
  | 'market-situation'
  | 'review';

export interface StepConfig {
  id: FormStep;
  title: string;
  description: string;
}