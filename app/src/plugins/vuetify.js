import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import themes from './themes'
import iconsValues from '../icons'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'

Vue.use(Vuetify)

import { languages } from './i18n'

let userLanguage = window.navigator.userLanguage || window.navigator.language
userLanguage = userLanguage.split('-')
userLanguage = userLanguage[0]

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: { ...themes[THEME_LIGHT_BLUE_NAME].theme },
      dark: { ...themes[THEME_DARK_BLACK_NAME].theme }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    values: iconsValues
  },
  lang: {
    locales: languages,
    current: userLanguage
  }
})
