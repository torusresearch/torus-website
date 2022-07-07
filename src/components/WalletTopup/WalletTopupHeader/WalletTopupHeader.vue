<template>
  <!-- Placeholder topup header -->
  <div v-if="placeholder" class="d-flex flex-wrap align-center">
    <div
      class="font-weight-bold text-left text_2--text page-title mr-auto order-0 order-md-first"
      :class="{ 'display-1': $vuetify.breakpoint.width > 390 }"
    >
      <span style="opacity: 0.4">{{ t('walletTopUp.selectProvider') }}</span>
    </div>
    <div class="order-first order-md-0 d-md-inline-flex mx-md-2" :style="{ width: $vuetify.breakpoint.smAndDown ? '100%' : 'auto' }">
      <div class="d-inline-block">
        <NetworkDisplay :store-network-type="networkType" />
      </div>
    </div>
    <span class="order-last">
      <QuickAddress />
    </span>
  </div>

  <!-- Normal topup header -->
  <div v-else class="d-flex flex-wrap align-center">
    <div
      class="font-weight-bold text-left text_2--text page-title mr-auto order-0 order-md-first"
      :class="{ 'display-1': $vuetify.breakpoint.width > 390 }"
    >
      <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
        {{ t('walletTopUp.purchaseVia') }}
        <span class="text-capitalize">{{ selectedProvider }}</span>
      </span>
      <span v-else>{{ t('walletTopUp.selectProvider') }}</span>
    </div>
    <div class="order-first order-md-0 d-md-inline-flex mx-md-2" :style="{ width: $vuetify.breakpoint.smAndDown ? '100%' : 'auto' }">
      <div class="d-inline-block">
        <NetworkDisplay :store-network-type="networkType" />
      </div>
    </div>
    <span class="order-last">
      <QuickAddress />
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import NetworkDisplay from '../../helpers/NetworkDisplay'
import QuickAddress from '../../helpers/QuickAddress'

export default {
  components: { NetworkDisplay, QuickAddress },
  props: {
    placeholder: {
      type: Boolean,
      default: false,
    },
    selectedProvider: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['networkType']),
  },
}
</script>
