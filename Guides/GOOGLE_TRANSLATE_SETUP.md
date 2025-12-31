# Google Translate API Setup Guide

## 🌟 Why Google Translate?

Google Translate provides superior translation quality compared to free alternatives:
- **Better accuracy** for Sinhala ↔ English translation
- **Context awareness** - translates phrases, not just words
- **Handles complex grammar** and idiomatic expressions
- **Reliable service** with 99.9% uptime

## 🔧 Setup Instructions

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select existing project
3. Name your project (e.g., "Marketing Strategy Translator")

### Step 2: Enable Translation API
1. Go to [Cloud Translation API](https://console.cloud.google.com/apis/library/translate.googleapis.com)
2. Click "Enable" button
3. Wait for API to be enabled (usually takes a few seconds)

### Step 3: Create API Credentials
1. Go to [APIs & Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Restrict the key to Translation API for security

### Step 4: Configure Your Project
1. Open your `.env.local` file
2. Replace `your_api_key_here` with your actual API key:
   ```env
   NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=AIzaSyC-your-actual-api-key-here
   ```
3. Save the file and restart your development server

## 💰 Cost Information

Google Translate API pricing (as of 2024):
- **Free tier**: 500,000 characters per month
- **After free tier**: $20 per million characters
- **Your usage**: Estimated ~1,000-5,000 characters per form = **FREE** for development

## 🧪 Testing

After setup, your translations will be much better:

**Before (Mock):**
```
අපි සාම්ප්‍රදායික ශ්‍රී ලාංකික ආහාර වර්ග සේවය කරමු
→ we traditional Sri Lankan food varieties service do
```

**After (Google Translate):**
```
අපි සාම්ප්‍රදායික ශ්‍රී ලාංකික ආහාර වර්ග සේවය කරමු
→ We serve traditional Sri Lankan food varieties
```

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** (already implemented)
3. **Restrict API key** to Translation API only
4. **Monitor usage** in Google Cloud Console

## 🚀 Alternative: Enhanced Mock Translator

If you prefer not to use Google Translate right now, I've enhanced the mock translator with better Sinhala translations. It's already working and gives decent results for testing.

## ⚡ Quick Start

1. Get your Google API key (5 minutes)
2. Update `.env.local` with your key
3. Restart server: `npm run dev`
4. Test at: http://localhost:3000/test
5. Enjoy professional-quality translations! 🎉

## 🆘 Troubleshooting

**Common Issues:**
- **"API not enabled"**: Make sure Translation API is enabled in Google Cloud
- **"Invalid key"**: Check your API key is correct and not restricted
- **"Quota exceeded"**: You've used your free tier, but unlikely during development

**Need Help?**
- Check the browser console for detailed error messages
- Verify your API key in Google Cloud Console
- Test with the direct translation feature on `/test` page