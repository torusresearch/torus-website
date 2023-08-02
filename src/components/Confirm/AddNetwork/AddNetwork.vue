<template>
  <div>
    <v-layout pa-6 class="provider-change-header" :class="{ 'theme--dark': $vuetify.theme.dark }">
      <v-flex text-left xs12>
        <img class="home-link mr-1" alt="Exchangaweb3 Logo" :height="getLogo.isExternal ? 50 : 20" :src="getLogo.logo" />
        <div class="headline text_2--text">{{ t('dappInfo.permission') }}</div>
      </v-flex>
    </v-layout>
    <v-layout wrap align-center mx-6 mb-3 mt-5>
      <v-flex class="text-center">
        <span class="headline text_2--text">
          {{ headline }}
        </span>
        <!-- <br />
          <v-btn small text class="caption torusBrand1--text" @click="editPermissions">
            Edit permissions
          </v-btn> -->
      </v-flex>
    </v-layout>
    <v-divider class="mx-6"></v-divider>
    <v-layout wrap align-center pa-6>
      <v-flex xs12 mb-2>
        <div class="caption mb-2 text_2--text">{{ t('dappProvider.requestFrom') }}</div>

        <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
          <v-card-text v-if="origin">
            <div class="d-flex request-from align-center">
              <a :href="requestHostDetails.href" target="_blank" rel="noreferrer noopener" class="caption font-weight-medium torusBrand1--text">
                {{ requestHostDetails.hostname }}
              </a>
              <v-btn
                x-small
                :color="$vuetify.theme.isDark ? 'torusBlack2' : 'white'"
                class="link-icon ml-auto"
                :href="requestHostDetails.href"
                target="_blank"
                rel="noreferrer noopener"
                :aria-label="`Open ${requestHostDetails.hostname} Link`"
              >
                <img src="../../../assets/img/icons/open-in-new-grey.svg" class="card-upper-icon" alt="Open Link Icon" />
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 mb-2>
        <div class="caption mb-2 text_2--text">{{ t('dappProvider.networkHost') }}</div>

        <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
          <v-card-text v-if="origin">
            <div class="d-flex request-from align-center">
              {{ networkHost }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 mb-2>
        <div class="caption mb-2 text_2--text">{{ t('dappProvider.chainId') }}</div>
        <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
          <v-card-text v-if="origin">
            <div class="d-flex request-from align-center">
              {{ chainId }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 mb-2>
        <div class="caption mb-2 text_2--text">{{ t('dappPermission.symbol') }}</div>
        <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
          <v-card-text v-if="origin">
            <div class="d-flex request-from align-center">
              {{ symbol }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 mt-8>
        <v-layout mx-n2>
          <v-flex xs6 px-2>
            <v-btn block text large class="text_2--text" @click="rejectAddNetwork">{{ t('dappProvider.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6 px-2>
            <v-btn block depressed large class="torus-btn1 white--text" color="torusBrand1" @click="approveAddNetwork">
              {{ t('dappProvider.confirm') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  name: 'AddNetwork',
  props: {
    origin: {
      type: String,
      required: true,
    },
    networkName: {
      type: String,
      required: true,
    },
    networkHost: {
      type: String,
      required: true,
    },
    chainId: {
      type: Number,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getLogo']),
    headline() {
      return this.t('dappPermission.allowAddNetwork')
        .replace(/{host}/gi, this.requestHostDetails.hostname)
        .replace(
          /{network}/gi,
          (SUPPORTED_NETWORK_TYPES[this.networkHost] && SUPPORTED_NETWORK_TYPES[this.networkHost].networkName) || this.networkName || this.networkHost
        )
    },
    requestHostDetails() {
      if (this.origin) {
        const url = new URL(this.origin)
        return {
          origin: this.origin,
          href: url.href,
          hostname: url.hostname,
        }
      }
      return {
        origin: '',
        href: '',
        hostname: '',
      }
    },
  },
  mounted() {},
  methods: {
    approveAddNetwork() {
      this.$emit('triggerApproveAddNetwork')
    },
    rejectAddNetwork() {
      this.$emit('triggerRejectAddNetwork')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddNetwork.scss';
</style>
