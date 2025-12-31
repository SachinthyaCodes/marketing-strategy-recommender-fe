/**
 * API service for communicating with the FastAPI backend
 */

export interface BackendSubmissionResponse {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

export interface BackendSubmissionListResponse {
  submissions: any[];
  total: number;
  page: number;
  limit: number;
}

export interface BackendHealthResponse {
  status: string;
  database: string;
}

export interface StrategyGenerationResponse {
  success: boolean;
  strategy?: any;
  error?: string;
  metadata?: {
    generation_time_ms: number;
    llm_provider: string;
    model: string;
  };
}

export class ApiService {
  private baseUrl: string;
  private strategyGeneratorUrl: string;

  constructor(
    baseUrl: string = 'http://localhost:8000',
    strategyGeneratorUrl: string = 'http://localhost:8002'
  ) {
    this.baseUrl = baseUrl;
    this.strategyGeneratorUrl = strategyGeneratorUrl;
  }

  /**
   * Test backend connection
   */
  async testConnection(): Promise<BackendHealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Backend connection test failed:', error);
      throw error;
    }
  }

  /**
   * Submit form data to backend
   */
  async submitForm(formData: any): Promise<BackendSubmissionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Form submission failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Form submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }

  /**
   * Get list of submissions
   */
  async getSubmissions(page: number = 1, limit: number = 50): Promise<BackendSubmissionListResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/submissions?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  /**
   * Get specific submission by ID
   */
  async getSubmission(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/submissions/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Submission not found');
        }
        throw new Error(`Failed to fetch submission: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching submission:', error);
      throw error;
    }
  }

  /**
   * Get submission statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/stats`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Update submission status
   */
  async updateSubmissionStatus(id: string, status: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update submission status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  /**
   * Delete submission
   */
  async deleteSubmission(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/forms/submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete submission: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  }

  /**
   * Generate marketing strategy from profile data
   */
  async generateStrategy(smeProfile: any, trendData: any): Promise<StrategyGenerationResponse> {
    try {
      const response = await fetch(`${this.strategyGeneratorUrl}/strategy/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sme_profile: smeProfile,
          trend_data: trendData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Strategy generation failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Strategy generated successfully:', result);
      return result;
    } catch (error) {
      console.error('Strategy generation error:', error);
      throw error;
    }
  }

  /**
   * Get trends from Trend Agent
   */
  async getTrends(): Promise<any> {
    try {
      const response = await fetch('http://localhost:8001/trends');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trends: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching trends:', error);
      // Return mock data if trend agent is not available
      return {
        signals: [],
        metadata: {
          note: 'Trend Agent not available, using empty signals'
        }
      };
    }
  }

  /**
   * Test Strategy Generator connection
   */
  async testStrategyGenerator(): Promise<any> {
    try {
      const response = await fetch(`${this.strategyGeneratorUrl}/health`);
      if (!response.ok) {
        throw new Error(`Strategy Generator health check failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Strategy Generator connection test failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();