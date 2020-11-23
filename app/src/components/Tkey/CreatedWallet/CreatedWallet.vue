<template>
  <div class="created-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center" :class="$vuetify.breakpoint.xsOnly ? 'mb-6' : 'mb-12'">
      <div :style="{ height: $vuetify.breakpoint.xsOnly ? '85px' : '160px' }">
        <img
          :src="require(`../../../assets/images/ob-add-2fa-created${$vuetify.theme.dark ? '-dark' : ''}.svg`)"
          alt="tKey Created"
          :style="{ height: $vuetify.breakpoint.xsOnly ? '100px' : '190px' }"
        />
      </div>
      <div
        class="font-weight-bold"
        :class="[$vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text', $vuetify.breakpoint.xsOnly ? 'body-1' : 'headline']"
      >
        {{ t('tkeyCreateDone.success') }}
      </div>
    </div>

    <div class="text-center mb-6">
      <div class="created-headline mb-1" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text'">
        {{ t('tkeyCreateDone.selectDefault') }}
      </div>
      <div class="caption" :class="$vuetify.theme.dark ? 'text_2--text' : 'text_3--text'">{{ t('tkeyCreateDone.theDefaultAccount') }}</div>
    </div>

    <!-- Default Wallet -->
    <div
      v-for="wallet in wallets"
      :key="wallet.key"
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: wallet.key === selectedWallet }]"
      @click="setDefaultPublicAddress(wallet.key)"
    >
      <div class="mr-4">
        <v-icon class="radio-icon">
          {{ `$vuetify.icons.${wallet.key === selectedWallet ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-3">$vuetify.icons.{{ wallet.icon }}</v-icon>
        <div>
          <div class="caption wallet-item__id">{{ wallet.title }}</div>
          <div class="wallet-item__address caption d-flex align-center">
            <span class="mr-2">{{ t('tkeyCreateDone.walletAddress') }}: {{ wallet.keySliced }}</span>
            <ShowToolTip :address="wallet.key">
              <v-icon size="12" class="torusFont2--text" :style="{ marginTop: '-2px' }" v-text="'$vuetify.icons.copy'" />
            </ShowToolTip>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-9 text-center">
      <v-btn :x-large="!$vuetify.breakpoint.xsOnly" color="torusBrand1" class="body-2 font-weight-bold white--text px-16" @click="goToWallet">
        {{ t('tkeyCreateDone.letsExplore') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { ShowToolTip },
  props: {
    wallets: {
      type: Array,
      default() {
        return []
      },
    },
    defaultPublicAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedWallet: '',
    }
  },
  created() {
    this.selectedWallet = this.defaultPublicAddress
  },
  methods: {
    next() {
      this.$emit('next')
    },
    setDefaultPublicAddress(address) {
      this.selectedWallet = address
    },
    goToWallet() {
      this.$emit('setDefaultPublicAddress', this.selectedWallet)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CreatedWallet.scss';
</style>
