import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { ceruleanBlue, lightBlue } from './themes'
import {
  SelectIcon,
  SendIcon,
  AddIcon,
  SearchIcon,
  RefreshIcon,
  EthIcon,
  QuestionIcon,
  RadioCheckedIcon,
  RadioUncheckedIcon,
  VisibilityOnIcon,
  VisibilityOffIcon
} from '../icons'

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
    values: {
      select: {
        component: SelectIcon
      },
      send: {
        component: SendIcon
      },
      add: {
        component: AddIcon
      },
      search: {
        component: SearchIcon
      },
      refresh: {
        component: RefreshIcon
      },
      eth: {
        component: EthIcon
      },
      question: {
        component: QuestionIcon
      },
      radio_checked: {
        component: RadioCheckedIcon
      },
      radio_unchecked: {
        component: RadioUncheckedIcon
      },
      visibility_on: {
        component: VisibilityOnIcon
      },
      visibility_off: {
        component: VisibilityOffIcon
      }
    }
  }
})
