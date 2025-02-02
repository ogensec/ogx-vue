import type { I18n, I18nOptions, LocaleMessages } from 'vue-i18n'
import { createI18n } from 'vue-i18n';
import axios from 'axios';

type LanguageMessage = Record<string, any>; // Vous pouvez remplacer `any` par une structure plus précise si possible.
interface RAMType {
  CURRENT: string | null;
  LANGS: string[];
}

const defaultLanguage = localStorage.getItem('lang') || import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'

const RAM: RAMType = {
  CURRENT: null,
  LANGS: [],
};

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: defaultLanguage,
  globalInjection: true,
  // allowComposition: true,
  fallbackWarn: false,
  missingWarn: false
};

export const i18n = createI18n(i18nOptions) as I18n

const loadedLanguages: string[] = []; // List of loaded languages

function setI18nLanguage(lang: string): string {
  i18n.global.locale.value = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
  return lang;
}

export async function loadLanguageAsync(lang: string): Promise<string | boolean> {
  if (!loadedLanguages.includes(lang)) {
    return import(`../../../../../../src/langs/${lang}.ts`).then(messages => {
      if (messages.default) {
        i18n.global.mergeLocaleMessage(lang, messages.default as LocaleMessages<any>);
        loadedLanguages.push(lang);
        return setI18nLanguage(lang);
      }
      return false;
    });
  }

  else if (i18n.global.locale.value === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  else if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  else return false;

}

export function injectLocalesMessages(data: Record<string, LanguageMessage>): void {
  for (let lang in data) {
    i18n.global.mergeLocaleMessage(lang, data[lang]);
  }
}

// Default Load Language
loadLanguageAsync(defaultLanguage).finally();