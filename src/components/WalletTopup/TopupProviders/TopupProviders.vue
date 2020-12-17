<template>
  <v-flex mb-4 px-4 class="topup-providers" :class="$vuetify.breakpoint.width > 800 ? 'xs5' : 'xs12'">
    <v-card
      v-for="targetProvider in activeProviders"
      :key="targetProvider.name"
      class="mb-4 topup-provider elevation-1"
      :class="{ active: innerProvider === targetProvider.name }"
      :data-provider="targetProvider.name"
      @click="innerProvider = targetProvider.name"
    >
      <router-link :to="targetProvider.link">
        <v-list-item :id="`${targetProvider.name}-link`" three-line @click="scrollToPosition">
          <v-list-item-icon class="mr-2 align-self-center">
            <v-icon v-if="innerProvider === targetProvider.name" :class="$vuetify.theme.isDark ? 'torusLight--text' : 'torusBrand1--text'">
              $vuetify.icons.radioOn
            </v-icon>
            <v-icon v-else :class="$vuetify.theme.isDark ? 'torusLight--text' : 'torusBlack--text'">$vuetify.icons.radioOff</v-icon>
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
              : {{ targetProvider.line4 }}
            </div>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-card>

    <v-tooltip v-for="targetProvider in inactiveProviders" :key="targetProvider.name" right>
      <template #activator="{ on }">
        <v-card class="topup-provider mb-4 coming-soon" :data-provider="targetProvider.name" v-on="on">
          <v-list-item three-line>
            <v-list-item-icon class="mr-2 align-self-center">
              <v-icon color="grey">$vuetify.icons.radioOff</v-icon>
            </v-list-item-icon>
            <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 105 : 138" height="100%" tile class="align-self-center mr-2">
              <img :src="require(`../../../assets/images/${targetProvider.logo}`)" :alt="targetProvider.name" />
            </v-list-item-avatar>
            <v-list-item-content class="align-self-center text-right text_1--text caption">
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

    <div id="write-to-us" class="mt-4 py-4 px-1 text-gray caption">
      <div>
        {{ t('walletTopUp.otherMode') }}
        <a href="mailto:hello@tor.us?Subject=Add%20Payment%20Method" target="_blank" rel="noreferrer noopener" :style="{ textDecoration: 'none' }">
          {{ t('walletTopUp.writeToUs') }}
        </a>
      </div>
    </div>
  </v-flex>
</template>

<script>
import { ACTIVE, INACTIVE } from '../../../utils/enums'

export default {
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
    activeProviders() {
      return this.providers.filter((provider) => provider.status === ACTIVE)
    },
    inactiveProviders() {
      return this.providers.filter((provider) => provider.status === INACTIVE)
    },
    providersFiltered() {
      return this.providers.filter((provider) => this.innerProvider === '' || (this.innerProvider && this.innerProvider === provider.name))
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
      if (this.$vuetify.breakpoint.width > 800) return
      const element = document.querySelector('#write-to-us')
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TopupProviders.scss';
</style>
