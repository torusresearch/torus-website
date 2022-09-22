<template>
  <v-col class="topup-providers mb-4 px-4" :cols="$vuetify.display.width > 800 ? '5' : '12'">
    <v-card
      v-for="targetProvider in activeProviders"
      :key="targetProvider.name"
      class="mb-4 topup-provider elevation-1"
      :class="{ active: innerProvider === targetProvider.name }"
      :data-provider="targetProvider.name"
      @click="innerProvider = targetProvider.name"
    >
      <router-link :to="targetProvider.link">
        <v-list-item :id="`${targetProvider.name}-link`" three-line class="py-3" @click="scrollToPosition">
          <template #prepend>
            <div :style="{ width: $vuetify.display.xs ? '100px' : '160px', height: '100%' }" class="align-center d-flex mr-2">
              <v-icon v-if="innerProvider === targetProvider.name" color="torusBrand1">$radioOn</v-icon>
              <v-icon v-else>$radioOff</v-icon>
              <v-img class="ml-3" contain :src="require(`../../../assets/images/${targetProvider.logo}`)" :alt="targetProvider.name"></v-img>
            </div>
          </template>
          <div class="align-self-center text-right text-text_1 caption">
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
          </div>
        </v-list-item>
      </router-link>
    </v-card>

    <v-tooltip v-for="targetProvider in inactiveProviders" :key="targetProvider.name" location="right">
      <template #activator="{ props }">
        <v-card class="topup-provider mb-4 coming-soon" :data-provider="targetProvider.name" v-bind="props">
          <v-list-item three-line prepend-icon="$radioOff">
            <template #prepend>
              <div :style="{ width: $vuetify.display.xs ? '100px' : '130px', height: '100%' }" class="align-self-center mr-2">
                <img :src="require(`../../../assets/images/${targetProvider.logo}`)" :alt="targetProvider.name" />
              </div>
            </template>
            <div class="align-self-center text-right text-text_1 caption">
              <div>{{ targetProvider.line1 }}</div>
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
            </div>
          </v-list-item>
        </v-card>
      </template>
      <span>Coming Soon</span>
    </v-tooltip>

    <div id="write-to-us">
      <WriteToUs />
    </div>
  </v-col>
</template>

<script>
import { mapState } from 'vuex'

import { ACTIVE, INACTIVE } from '../../../utils/enums'
import WriteToUs from '../WriteToUs'

export default {
  components: { WriteToUs },
  props: {
    selectedProvider: {
      type: String,
      default: '',
    },
    providers: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      innerProvider: '',
    }
  },
  computed: {
    ...mapState(['networkType']),
    activeProviders() {
      return this.providers.filter((provider) => provider.status === ACTIVE)
    },
    inactiveProviders() {
      return this.providers.filter((provider) => provider.status === INACTIVE)
    },
    providersFiltered() {
      return this.providers.filter((provider) => this.innerProvider === '' || (this.innerProvider && this.innerProvider === provider.name))
    },
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
  },
  watch: {
    innerProvider(newValue, oldValue) {
      if (oldValue !== newValue) this.$emit('onSelectProvider', this.innerProvider)
    },
    selectedProvider(newValue, oldValue) {
      if (oldValue !== newValue) this.innerProvider = newValue
    },
  },
  mounted() {
    this.innerProvider = this.selectedProvider
  },
  methods: {
    scrollToPosition() {
      if (this.$vuetify.display.width > 800) return
      const element = document.querySelector('#write-to-us')
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }, 0)
    },
    supportedNetworkCryptosForProvider(targetProvider) {
      const network = this.networkType.host
      return targetProvider.validCryptoCurrenciesByChain[network]?.map((currency) => currency.display) || []
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TopupProviders.scss';
</style>
