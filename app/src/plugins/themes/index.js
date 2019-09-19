import lightBlue from './lightBlue'
import darkBlack from './darkBlack'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../../utils/enums'

export default {
  [THEME_LIGHT_BLUE_NAME]: {
    label: 'Light',
    name: 'light-blue',
    theme: lightBlue,
    isDark: false
  },
  [THEME_DARK_BLACK_NAME]: {
    label: 'Dark',
    name: 'dark-black',
    theme: darkBlack,
    isDark: true
  }
}
