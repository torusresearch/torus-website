import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './i18n/english.json'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: { en }, // set locale messages
})

const loadedLanguages = new Set(['en']) // our default language that is preloaded
export const languageMap = {
  en: 'english',
  de: 'german',
  ja: 'japanese',
  ko: 'korean',
  zh: 'mandarin',
  es: 'spanish',
}

function setI18nLanguage(lang) {
  i18n.locale = lang
  return lang
}

export function loadLanguageAsync(lang) {
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language was already loaded
  if (loadedLanguages.has(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language hasn't been loaded yet
  return import(/* webpackChunkName: "lang-[request]" */ `./i18n/${languageMap[lang]}.json`).then((messages) => {
    i18n.setLocaleMessage(lang, messages.default)
    loadedLanguages.add(lang)
    return setI18nLanguage(lang)
  })
}

export default i18n
