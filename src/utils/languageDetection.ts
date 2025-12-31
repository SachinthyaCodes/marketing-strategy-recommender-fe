/**
 * Language detection utility for Sinhala and English text
 */

// Sinhala Unicode range: U+0D80–U+0DFF
const SINHALA_REGEX = /[\u0D80-\u0DFF]/;

/**
 * Detects if text contains Sinhala characters
 * @param text - Input text to analyze
 * @returns true if Sinhala characters are detected, false otherwise
 */
export function containsSinhala(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return SINHALA_REGEX.test(text);
}

/**
 * Analyzes text and determines the dominant language
 * @param text - Input text to analyze
 * @returns 'si' for Sinhala, 'en' for English
 */
export function detectLanguage(text: string): 'si' | 'en' {
  if (!text || typeof text !== 'string') {
    return 'en';
  }

  const totalChars = text.length;
  const sinhalaChars = (text.match(/[\u0D80-\u0DFF]/g) || []).length;
  
  // If more than 10% of characters are Sinhala, consider it Sinhala text
  const sinhalaRatio = sinhalaChars / totalChars;
  
  return sinhalaRatio > 0.1 ? 'si' : 'en';
}

/**
 * Detects languages in form data object recursively
 * @param data - Form data object to analyze
 * @returns Object mapping field paths to detected languages
 */
export function detectLanguagesInFormData(data: any): Record<string, 'si' | 'en'> {
  const languageMap: Record<string, 'si' | 'en'> = {};
  
  function analyzeObject(obj: any, path = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.trim()) {
        languageMap[currentPath] = detectLanguage(value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && item.trim()) {
            languageMap[`${currentPath}[${index}]`] = detectLanguage(item);
          } else if (typeof item === 'object' && item !== null) {
            analyzeObject(item, `${currentPath}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        analyzeObject(value, currentPath);
      }
    }
  }
  
  analyzeObject(data);
  return languageMap;
}

/**
 * Gets all text fields that need translation from form data
 * @param data - Form data object
 * @returns Array of objects with path, original text, and detected language
 */
export function getTextFieldsForTranslation(data: any): Array<{
  path: string;
  text: string;
  language: 'si' | 'en';
}> {
  const textFields: Array<{ path: string; text: string; language: 'si' | 'en' }> = [];
  
  function extractText(obj: any, path = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.trim()) {
        const language = detectLanguage(value);
        textFields.push({
          path: currentPath,
          text: value,
          language
        });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && item.trim()) {
            const language = detectLanguage(item);
            textFields.push({
              path: `${currentPath}[${index}]`,
              text: item,
              language
            });
          } else if (typeof item === 'object' && item !== null) {
            extractText(item, `${currentPath}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        extractText(value, currentPath);
      }
    }
  }
  
  extractText(data);
  return textFields;
}