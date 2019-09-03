import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { darkTheme, lightBlue } from './themes'
import iconsValues from '../icons'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: { ...lightBlue },
      dark: { ...darkTheme }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    values: iconsValues
  }
})
