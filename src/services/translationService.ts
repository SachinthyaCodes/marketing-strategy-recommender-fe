/**
 * Translation service for converting Sinhala text to English
 * Supports multiple translation providers (Google Translate, LibreTranslate, etc.)
 */

export interface TranslationProvider {
  name: string;
  translate: (text: string, from: string, to: string) => Promise<string>;
}

export interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  provider: string;
  confidence?: number;
}

/**
 * Google Translate API provider
 */
export class GoogleTranslateProvider implements TranslationProvider {
  name = 'Google Translate';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, from: string = 'si', to: string = 'en'): Promise<string> {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
}

/**
 * LibreTranslate provider (open-source alternative)
 */
export class LibreTranslateProvider implements TranslationProvider {
  name = 'LibreTranslate';
  private baseUrl: string;

  constructor(baseUrl: string = 'https://libretranslate.pussthecat.org') {
    this.baseUrl = baseUrl;
  }

  async translate(text: string, from: string = 'si', to: string = 'en'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: from === 'si' ? 'auto' : from, // Use 'auto' for Sinhala as fallback
          target: to,
          format: 'text'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LibreTranslate API error: ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText;
      
      if (!translatedText || translatedText === text) {
        throw new Error('No translation returned or same as original');
      }
      
      return translatedText;
    } catch (error) {
      throw error; // Let the service handle fallback
    }
  }
}

/**
 * Mock translation provider for development/testing
 */
export class MockTranslationProvider implements TranslationProvider {
  name = 'Mock Translator';
  
  // Comprehensive Sinhala to English dictionary for realistic mock translations
  private dictionary: Record<string, string> = {
    // Basic words
    'අපි': 'we',
    'ආහාර': 'food',
    'සේවය': 'service', 
    'කරමු': 'do',
    'කොළඹ': 'Colombo',
    'නගර': 'city',
    'නගරය': 'city',
    'ප්‍රදේශය': 'area',
    'සාම්ප්‍රදායික': 'traditional',
    'ශ්‍රී': 'Sri',
    'ලාංකික': 'Lankan',
    'ශ්‍රී ලාංකික': 'Sri Lankan',
    'අව්‍යාජ': 'authentic',
    'රස': 'taste',
    'සහිත': 'with',
    'නවීන': 'modern',
    'ප්‍රදර්ශනය': 'presentation',
    'අත්දැකීම්': 'experiences',
    'සමග': 'with',
    'ප්‍රතිෂ්ඨිත': 'established',
    'ආහාරශාලා': 'restaurants',
    'තරගකාරිත්වය': 'competition',
    'උනන්දුව': 'interest',
    'වැඩිවන': 'growing',
    'අලුත්': 'new',
    'අවුරුද්ද': 'year',
    'නත්තල්': 'Christmas',
    'අවස්ථා': 'occasions',
    'වලදී': 'during',
    'වැඩි': 'more',
    'වේ': 'become',
    // Common phrases
    'අපි සාම්ප්‍රදායික ශ්‍රී ලාංකික ආහාර වර්ග සේවය කරමු': 'We serve traditional Sri Lankan food varieties',
    'අව්‍යාජ රස සහිත නවීන ප්‍රදර්ශනය': 'Authentic flavors with modern presentation',
    'කොළඹ නගර ප්‍රදේශය': 'Colombo metropolitan area',
    'ප්‍රතිෂ්ඨිත ආහාරශාලා වලින් තරගකාරිත්වය': 'Competition from established restaurants',
    'අව්‍යාජ ශ්‍රී ලාංකික ආහාර කෙරෙහි වැඩිවන උනන්දුව': 'Growing interest in authentic Sri Lankan cuisine',
    'සිංහල හා දමිළ අලුත් අවුරුද්ද (අප්‍රේල්)': 'Sinhala and Tamil New Year (April)',
    'නත්තල් (දෙසැම්බර්)': 'Christmas (December)',
    'අපේ ව්‍යාපාරය කාලයාකුल රටාවන් හේතුවෙන් බලපෑමට ලක්වේ': 'Our business is affected by seasonal patterns',
    'සමාජ මාධ්‍ය හරහා වැඩි ක්‍රියාකාරකම් සහ බෙදාහැරීමේ විකල්ප': 'Increased social media activities and delivery options',
    // Mixed language patterns (common in real user input)
    'we සාම්ප්‍රදායික ශ්‍රී ලාංකික ආහාර වර්ග සේවය කරමු': 'We serve traditional Sri Lankan food varieties',
    'authentic රස සහිත නවීන ප්‍රදර්ශනය': 'Authentic flavors with modern presentation',
    'Colombo නගර ප්‍රදේශය': 'Colombo metropolitan area',
    'ප්‍රතිෂ්ඨිත foodශාලා වලින් තරගකාරිත්වය': 'Competition from established restaurants',
    'අව්‍යාජ ශ්‍රී ලාංකික food කෙරෙහි වැඩිවන උනන්දුව': 'Growing interest in authentic Sri Lankan cuisine',
    'සිංහල හා දමිළ new අවුරුද්ද (අප්‍රේල්)': 'Sinhala and Tamil New Year (April)',
    'Christmas (දෙසැම්බර්)': 'Christmas (December)',
    'අපේ ව්‍යාපාරය කාලයාකුල රටාවන් හේතුවෙන් බලපෑමට ලක්become': 'Our business is affected by seasonal patterns',
    'සමාජ මාධ්‍ය හරහා more ක්‍රියාකාරකම් සහ බෙදාහැරීමේ විකල්ප': 'Social media activities and delivery options',
    // Individual words for better coverage
    'භෝජන': 'dining',
    'සංස්කෘතිය': 'culture',
    'වර්ග': 'varieties',
    'හේතුවෙන්': 'due to',
    'බලපෑමට': 'to impact',
    'ලක්වේ': 'is subjected',
    'මාධ්‍ය': 'media',
    'හරහා': 'through',
    'ක්‍රියාකාරකම්': 'activities',
    'බෙදාහැරීමේ': 'delivery',
    'විකල්ප': 'options',
    'කාලයාකුල': 'seasonal',
    'රටාවන්': 'patterns',
    'දමිළ': 'Tamil',
    'අප්‍රේල්': 'April',
    'දෙසැම්බර්': 'December'
  };

  async translate(text: string, from: string = 'si', to: string = 'en'): Promise<string> {
    console.log(`🎭 Mock translator processing: "${text.substring(0, 50)}..."`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let translated = text;
    let hasTranslation = false;
    
    // Sort dictionary entries by length (longest first for better phrase matching)
    const sortedEntries = Object.entries(this.dictionary).sort(([a], [b]) => b.length - a.length);
    
    // Apply all possible translations
    for (const [sinhala, english] of sortedEntries) {
      if (translated.includes(sinhala)) {
        const beforeTranslation = translated;
        translated = translated.replace(new RegExp(sinhala, 'g'), english);
        if (translated !== beforeTranslation) {
          hasTranslation = true;
          console.log(`🔄 Translated "${sinhala}" → "${english}"`);
        }
      }
    }
    
    if (hasTranslation) {
      console.log(`✅ Mock translation success: "${translated}"`);
      return translated;
    }
    
    // If no translation occurred, provide a meaningful fallback
    const fallbackTranslation = `[Enhanced Mock Translation] ${text}`;
    console.log(`⚠️ Mock using fallback: "${fallbackTranslation}"`);
    return fallbackTranslation;
  }
}

/**
 * Main translation service class
 */
export class TranslationService {
  private provider: TranslationProvider;

  constructor(provider: TranslationProvider) {
    this.provider = provider;
  }

  /**
   * Translate a single text string
   */
  async translateText(text: string, from: string = 'si', to: string = 'en'): Promise<TranslationResponse> {
    try {
      const translatedText = await this.provider.translate(text, from, to);
      
      return {
        translatedText,
        originalText: text,
        provider: this.provider.name,
      };
    } catch (error) {
      console.warn(`Primary translation provider (${this.provider.name}) failed:`, error);
      
      // Use enhanced mock translator as fallback
      console.log('🔄 Falling back to enhanced mock translator...');
      const mockProvider = new MockTranslationProvider();
      const translatedText = await mockProvider.translate(text, from, to);
      
      return {
        translatedText,
        originalText: text,
        provider: `${this.provider.name} (Mock Fallback)`,
      };
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(
    texts: Array<{ text: string; from?: string; to?: string }>,
    defaultFrom: string = 'si',
    defaultTo: string = 'en'
  ): Promise<TranslationResponse[]> {
    const promises = texts.map(({ text, from = defaultFrom, to = defaultTo }) =>
      this.translateText(text, from, to)
    );

    return Promise.all(promises);
  }

  /**
   * Translate form data fields that contain Sinhala text
   */
  async translateFormData(
    formData: any,
    fieldsToTranslate: Array<{ path: string; text: string; language: 'si' | 'en' }>
  ): Promise<{ translatedData: any; translations: TranslationResponse[] }> {
    // Filter only Sinhala text fields
    const sinhalaFields = fieldsToTranslate.filter(field => field.language === 'si');
    
    if (sinhalaFields.length === 0) {
      return { translatedData: formData, translations: [] };
    }

    // Translate all Sinhala texts
    const translations = await this.translateBatch(
      sinhalaFields.map(field => ({ text: field.text }))
    );

    // Create a deep copy of form data
    const translatedData = JSON.parse(JSON.stringify(formData));

    // Apply translations to the copied data
    sinhalaFields.forEach((field, index) => {
      const translation = translations[index];
      if (translation) {
        this.setNestedValue(translatedData, field.path, translation.translatedText);
      }
    });

    return { translatedData, translations };
  }

  /**
   * Helper method to set nested object values using dot notation
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(/[.\[\]]+/).filter(key => key !== '');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!(key in current)) {
        // Check if next key is a number (array index)
        const nextKey = keys[i + 1];
        current[key] = /^\d+$/.test(nextKey) ? [] : {};
      }
      
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  }
}

/**
 * Factory function to create translation service with environment-based provider
 */
export function createTranslationService(): TranslationService {
  console.group('🌐 Translation Service Configuration');
  
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  const useLibreTranslate = process.env.NEXT_PUBLIC_USE_LIBRE_TRANSLATE === 'true';
  const libreTranslateUrl = process.env.NEXT_PUBLIC_LIBRE_TRANSLATE_URL;
  
  console.log('Environment variables:', {
    hasGoogleKey: !!googleApiKey,
    useLibreTranslate,
    libreTranslateUrl
  });
  
  if (googleApiKey && googleApiKey !== 'your_api_key_here') {
    console.log('✅ Using Google Translate API');
    console.groupEnd();
    return new TranslationService(new GoogleTranslateProvider(googleApiKey));
  }

  if (useLibreTranslate) {
    console.log('✅ Using LibreTranslate API:', libreTranslateUrl || 'default URL');
    console.groupEnd();
    return new TranslationService(new LibreTranslateProvider(libreTranslateUrl));
  }

  // Development fallback
  console.warn('⚠️ No translation API configured, using enhanced mock translator');
  console.log('To use real translation, set NEXT_PUBLIC_USE_LIBRE_TRANSLATE=true in .env.local');
  console.groupEnd();
  return new TranslationService(new MockTranslationProvider());
}