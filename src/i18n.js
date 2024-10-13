// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  .use(Backend) // Load translations from files
  .use(LanguageDetector) // Automatically detect user's language
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language if detected language is unavailable
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // You can set to true to use Suspense feature for lazy loading translations
    },
    backend: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
       // Path to your translation files
    },
  });

export default i18n;
