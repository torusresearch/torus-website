import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { darkBlack, lightBlue } from './themes'
import iconsValues from '../icons'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: { ...lightBlue },
      dark: { ...darkBlack }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    values: iconsValues
  }
})
