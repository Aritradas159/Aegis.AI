import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்', nativeLabel: 'தமிழ்', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', nativeLabel: 'हिन्दी', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', nativeLabel: 'বাংলা', dir: 'ltr' },
  { code: 'mr', label: 'मराठी', nativeLabel: 'मराठी', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు', nativeLabel: 'తెలుగు', dir: 'ltr' },
  { code: 'ur', label: 'اردو', nativeLabel: 'اردو', dir: 'rtl' },
  { code: 'fr', label: 'Français', nativeLabel: 'Français', dir: 'ltr' },
];

const STORAGE_KEY = 'risk_copilot_lang';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  isRtl: false,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // localStorage not accessible (e.g. incognito)
    }
    return 'en';
  });

  const setLanguage = (langCode) => {
    if (LANGUAGES.some(l => l.code === langCode)) {
      setLanguageState(langCode);
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
      } catch {
        // ignore storage errors
      }
    }
  };

  const isRtl = language === 'ur';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRtl]);

  const t = (key, params = {}) => {
    let str = translations[language]?.[key] ?? translations['en']?.[key] ?? key;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(p => {
        str = str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
