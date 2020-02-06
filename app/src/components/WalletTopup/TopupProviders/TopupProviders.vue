<template>
  <v-flex xs12 sm6 md5 mb-4 px-4 class="topup-providers">
    <v-card
      class="mb-4 topup-provider card-shadow"
      :class="{ active: innerProvider === targetProvider.name }"
      v-for="targetProvider in activeProviders"
      @click="innerProvider = targetProvider.name"
      :key="targetProvider.name"
      :data-provider="targetProvider.name"
    >
      <router-link :to="targetProvider.link">
        <v-list-item three-line :id="`${targetProvider.name}-link`" @click="$vuetify.goTo('#providerForm')">
          <v-list-item-icon class="mr-2 align-self-center">
            <v-icon class="primary--text" v-if="innerProvider === targetProvider.name">$vuetify.icons.radioOn</v-icon>
            <v-icon class="text_2--text" v-else>$vuetify.icons.radioOff</v-icon>
          </v-list-item-icon>
          <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 105 : 138" height="100%" tile class="align-self-center mr-2">
            <img :src="require(`../../../../public/images/${targetProvider.logo}`)" :alt="targetProvider.name" />
          </v-list-item-avatar>
          <v-list-item-content class="align-self-center text-right caption">
            <div>{{ t('walletTopUp.paywith') }} {{ targetProvider.line1 }}</div>
            <div>
              <span class="font-weight-medium">{{ t('walletTopUp.fees') }}</span>
              : {{ targetProvider.line2 }}
            </div>
            <div>{{ t('walletTopUp.limits') }}: {{ targetProvider.line3 }}</div>
            <div>{{ t('walletTopUp.currencies') }}: {{ targetProvider.line4 }}</div>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-card>

    <template>
      <v-tooltip right v-for="targetProvider in inactiveProviders" :key="targetProvider.name">
        <template v-slot:activator="{ on }">
          <v-card class="topup-provider mb-4 coming-soon" :data-provider="targetProvider.name" v-on="on">
            <v-list-item three-line>
              <v-list-item-icon class="mr-2 align-self-center">
                <v-icon color="grey">$vuetify.icons.radioOff</v-icon>
              </v-list-item-icon>
              <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 105 : 138" height="100%" tile class="align-self-center mr-2">
                <img :src="require(`../../../../public/images/${targetProvider.logo}`)" />
              </v-list-item-avatar>
              <v-list-item-content class="align-self-center text-right caption">
                <div>{{ targetProvider.line1 }}</div>
                <div v-html="targetProvider.line2"></div>
                <div>{{ targetProvider.line3 }}</div>
                <div>{{ targetProvider.line4 }}</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </template>
        <span>Coming Soon</span>
      </v-tooltip>

      <div class="mt-4 py-4 px-1 text-gray caption">
        <div>{{ t('walletTopUp.otherMode') }}</div>
        <div>
          <a href="mailto:hello@tor.us?Subject=Add%20Payment%20Method" target="_blank">{{ t('walletTopUp.writeToUs') }}</a>
          {{ t('walletTopUp.otherModeDesc') }}
        </div>
      </div>
    </template>
  </v-flex>
</template>

<script>
import { ACTIVE, INACTIVE } from '../../../utils/enums'

export default {
  props: ['selectedProvider', 'providers'],
  data() {
    return {
      innerProvider: ''
    }
  },
  computed: {
    activeProviders() {
      return this.providers.filter(provider => provider.status === ACTIVE)
    },
    inactiveProviders() {
      return this.providers.filter(provider => provider.status === INACTIVE)
    },
    providersFiltered() {
      return this.providers.filter(provider => {
        return this.innerProvider === '' || (this.innerProvider && this.innerProvider === provider.name)
      })
    }
  },
  watch: {
    innerProvider(newVal, oldVal) {
      if (oldVal !== newVal) this.$emit('onSelectProvider', this.innerProvider)
    },
    selectedProvider(newVal, oldVal) {
      if (oldVal !== newVal) this.innerProvider = newVal
    }
  },
  mounted() {
    this.innerProvider = this.selectedProvider
  }
}
</script>

<style lang="scss" scoped>
@import 'TopupProviders.scss';
</style>
