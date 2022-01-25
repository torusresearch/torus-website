import Vue from 'vue'
import VueI18n from 'vue-i18n'

// import { getUserLanguage } from '../utils/utils'
import en from './i18n/english.json'
import de from './i18n/german.json'
import ja from './i18n/japanese.json'
import ko from './i18n/korean.json'
import zh from './i18n/mandarin.json'
import es from './i18n/spanish.json'

const languages = {
  en,
  de,
  ja,
  ko,
  zh,
  es,
}

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages: languages, // set locale messages
})

export default i18n
