'use client'; // 👈 Required to make sure it runs on client side
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes
      },
      keySeparator: '.',  // Optional, based on your translation keys
      nsSeparator: ':',   // Optional, if using multiple namespaces
    });
}

export default i18n;
