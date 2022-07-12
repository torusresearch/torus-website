<template>
  <v-flex mb-4 px-4 class="topup-providers" :class="$vuetify.breakpoint.width > 800 ? 'xs5' : 'xs12'">
    <v-card
      v-for="targetProvider in providers"
      :key="targetProvider.name"
      class="mb-4 topup-provider elevation-1"
      :data-provider="targetProvider.name"
      style="opacity: 0.4"
    >
      <div>
        <v-list-item :id="`${targetProvider.name}-link`" three-line>
          <v-list-item-icon class="mr-2 align-self-center">
            <v-icon :class="$vuetify.theme.isDark ? 'torusLight--text' : 'torusBlack--text'">$vuetify.icons.radioOff</v-icon>
          </v-list-item-icon>
          <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 100 : 130" height="100%" tile class="align-self-center mr-2">
            <v-img contain :src="require(`../../../assets/images/${targetProvider.logo}`)" :alt="targetProvider.name"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="align-self-center text-right text_1--text caption">
            <div v-html="`${t('walletTopUp.paywith')} ${targetProvider.line1}`" />
            <div>
              <span class="font-weight-medium">{{ t('walletTopUp.fees') }}</span>
              : {{ targetProvider.line2 }}
            </div>
            <div>
              <span class="font-weight-medium">{{ t('walletTopUp.limits') }}</span>
              : {{ targetProvider.line3 }}
            </div>
            <div>
              <span class="font-weight-medium">{{ t('walletTopUp.currencies') }}</span>
              : {{ supportedNetworkCryptosForProvider(targetProvider).join(', ') }}
            </div>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-card>

    <WriteToUs />
  </v-flex>
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
