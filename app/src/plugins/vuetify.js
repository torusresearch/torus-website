import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    primary: '#3996ff',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
    torus_accept: '#56ab7f',
    torus_reject: '#959595',
    torus_reject_mild: '#959595',
    torus_active: '#7d7c7e',
    torus_svg_bcg: '#3996ff',
    torus_blue: '#3996ff',
    torus_bcg: '#f7f7f7',
    torus_icon: '#CCCACA'
  },
  options: {
    customProperties: true
  },
  // iconfont: 'md',
  icons: {
    iconfont: 'mdi'
  }
  // breakpoint: {
  //   thresholds: {
  //     xs: 576
  //   }
  // }
})
