import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { ceruleanBlue, lightBlue } from './themes'
import SelectIcon from '../components/SelectIcon'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: lightBlue,
      dark: ceruleanBlue
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    values: {
      select: {
        component: SelectIcon,
        props: {
          name: 'select'
        }
      }
    }
  }
})
