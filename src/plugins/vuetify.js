import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'

import iconsValues from '../icons'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'
import themes from './themes'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: { ...themes[THEME_LIGHT_BLUE_NAME].theme, dark: false },
      dark: { ...themes[THEME_DARK_BLACK_NAME].theme, dark: true },
    },
  },
  icons: {
    sets: iconsValues,
  },
})
