import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { ceruleanBlue, lightBlue } from './themes'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: lightBlue,
      dark: ceruleanBlue
    }
  },
  options: {
    customProperties: true
  }
  // iconfont: 'md',
  // icons: {
  //   iconfont: 'mdi'
  // }
  // breakpoint: {
  //   thresholds: {
  //     xs: 576
  //   }
  // }
})
