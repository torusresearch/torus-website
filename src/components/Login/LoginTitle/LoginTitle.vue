<template>
  <v-flex v-if="!isDapp" class="mb-2 mb-sm-0" :class="isDapp ? '' : 'ml-auto mr-auto xs10 sm8'">
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ t('login.your') }} USFL
    </div>
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ t('login.titleNew') }}
    </div>
  </v-flex>
  <div v-else class="mb-2 mb-sm-0">
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ t('login.title') }}
    </div>
  </div>
</template>

<script>
import { AVAILABLE_WEBSITES } from '../../../utils/enums'

export default {
  props: {
    isDapp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      availableOn: AVAILABLE_WEBSITES,
      selectedWallet: Object.keys(AVAILABLE_WEBSITES).find((x) => AVAILABLE_WEBSITES[x] === window.location.origin) || 'Ethereum',
    }
  },
  computed: {
    tickerNames() {
      return Object.keys(this.availableOn)
    },
  },
  methods: {
    openWallet(wallet) {
      this.selectedWallet = wallet
      window.location.href = this.availableOn[this.selectedWallet]
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginTitle.scss';
</style>
