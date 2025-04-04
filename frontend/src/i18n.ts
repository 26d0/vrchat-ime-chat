import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ja from './locales/ja.json';
import kip from './locales/kip.json';
import { useSettingsStore } from './stores/useSettingsStore';
import type { Language } from './stores/useSettingsStore';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      kip: { translation: kip }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Function to update i18next language when store changes
export const updateI18nLanguage = () => {
  const language = useSettingsStore.getState().language;
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }
};

// Subscribe to language changes
useSettingsStore.subscribe((state) => {
  const language = state.language;
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;