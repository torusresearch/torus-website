import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { ceruleanBlue, lightBlue } from './themes'
import iconsValues from '../icons'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: { ...lightBlue },
      dark: { ...ceruleanBlue }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    values: iconsValues
  }
})
