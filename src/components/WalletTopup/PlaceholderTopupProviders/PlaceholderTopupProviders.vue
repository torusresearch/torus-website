<template>
  <v-col class="topup-providers mb-4 px-4" :cols="$vuetify.display.width > 800 ? '5' : '12'">
    <v-card
      v-for="targetProvider in providers"
      :key="targetProvider.name"
      class="mb-4 topup-provider elevation-1"
      :data-provider="targetProvider.name"
      style="opacity: 0.4"
    >
      <div>
        <v-list-item :id="`${targetProvider.name}-link`" three-line>
          <template #prepend>
            <div class="mr-2 align-self-center">
              <v-icon :class="isDarkMode ? 'text-torusLight' : 'text-torusBlack'">$radioOff</v-icon>
            </div>
            <div style="{ width: $vuetify.display.xs ? '100px' : '130px', height: '100%' }" class="align-self-center mr-2">
              <v-img contain :src="require(`../../../assets/images/${targetProvider.logo}`)" :alt="targetProvider.name"></v-img>
            </div>
          </template>
          <div v-html="`${$t('walletTopUp.paywith')} ${targetProvider.line1}`" />
          <div>
            <span class="font-weight-medium">{{ $t('walletTopUp.fees') }}</span>
            : {{ targetProvider.line2 }}
          </div>
          <div>
            <span class="font-weight-medium">{{ $t('walletTopUp.limits') }}</span>
            : {{ targetProvider.line3 }}
          </div>
          <div>
            <span class="font-weight-medium">{{ $t('walletTopUp.currencies') }}</span>
            : {{ supportedNetworkCryptosForProvider(targetProvider).join(', ') }}
          </div>
        </v-list-item>
      </div>
    </v-card>

    <WriteToUs />
  </v-col>
</template>

<script>
import { MAINNET, MAINNET_CODE } from '../../../utils/enums'
import { getPaymentProviders } from '../../../utils/utils'
import WriteToUs from '../WriteToUs'

export default {
  components: { WriteToUs },
  data() {
    return {
      providers: getPaymentProviders(MAINNET_CODE),
    }
  },
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
  methods: {
    supportedNetworkCryptosForProvider(targetProvider) {
      return targetProvider.validCryptoCurrenciesByChain[MAINNET].map((currency) => currency.display)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PlaceholderTopupProviders.scss';
</style>
