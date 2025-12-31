/**
 * Converts frontend form data to Strategy Generator SME profile format
 */

export function convertFormDataToSMEProfile(formData: any): any {
  const businessProfile = formData.business_profile || {};
  const budgetResources = formData.budget_resources || {};
  const businessGoals = formData.business_goals || {};
  const targetAudience = formData.target_audience || {};
  const platformsPreferences = formData.platforms_preferences || {};
  const currentChallenges = formData.current_challenges || {};
  const strengthsOpportunities = formData.strengths_opportunities || {};

  // Parse monthly budget (handle string format like "50000-100000")
  let monthlyBudget = 0;
  if (budgetResources.monthly_budget) {
    if (typeof budgetResources.monthly_budget === 'string') {
      // Extract first number from range
      const match = budgetResources.monthly_budget.match(/\d+/);
      if (match) {
        monthlyBudget = parseInt(match[0], 10);
      }
    } else {
      monthlyBudget = budgetResources.monthly_budget;
    }
  }

  // Map business size
  const sizeMap: Record<string, string> = {
    'solo': 'micro',
    'small-team': 'small',
    'medium': 'medium',
    'large': 'large',
  };

  return {
    business_name: businessProfile.business_name || 'Unknown Business',
    industry: businessProfile.industry || 'General',
    business_size: sizeMap[businessProfile.business_size] || 'small',
    location: businessProfile.location?.city || businessProfile.location || 'Sri Lanka',
    monthly_budget: monthlyBudget,
    goals: [
      businessGoals.primary_goal,
      ...(businessGoals.secondary_goals || []),
    ].filter(Boolean),
    target_audience: {
      age_range: targetAudience.demographics?.age_range || '25-45',
      gender: targetAudience.demographics?.gender || ['all'],
      interests: targetAudience.interests || [],
      income_level: targetAudience.demographics?.income_level || 'medium',
    },
    platform_preferences: platformsPreferences.preferred_platforms || [],
    current_challenges: [
      ...(currentChallenges.challenges || []),
      currentChallenges.additional_challenges,
    ].filter(Boolean),
    strengths: strengthsOpportunities.strengths || [],
    opportunities: strengthsOpportunities.opportunities || [],
    has_marketing_team: budgetResources.has_marketing_team || false,
    team_size: budgetResources.team_size || 0,
    content_creation_capacity: budgetResources.content_creation_capacity || [],
    business_stage: businessProfile.business_stage || 'growing',
    unique_selling_proposition: businessProfile.unique_selling_proposition || '',
  };
}

/**
 * Generate a simple mock trend data structure
 * In production, this would come from Trend Agent
 */
export function getMockTrendData(): any {
  return {
    signals: [
      {
        title: 'Social media video content trending',
        category: 'content_trend',
        relevance_score: 75,
        source: 'market_analysis',
      },
      {
        title: 'Local business partnerships gaining traction',
        category: 'strategy_trend',
        relevance_score: 68,
        source: 'industry_news',
      },
    ],
  };
}
