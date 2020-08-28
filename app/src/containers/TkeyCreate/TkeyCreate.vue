<template>
  <div>
    <div class="header-container" :class="{ 'is-dark': $vuetify.theme.dark }">
      <v-container v-if="tab === 0" class="pt-6 pb-5">
        <div class="text-center headline mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
          {{ t('tkeyCreate.yourSignedIn') }}
        </div>
        <div class="d-flex">
          <div class="account-details d-flex pa-3 px-4">
            <v-avatar size="34" class="mr-2">
              <img
                :src="userInfo.profileImage"
                class="align-start"
                :alt="userInfo.userName"
                onerror="if (!this.src.includes('/images/person.jpeg')) this.src = '/images/person.jpeg';"
              />
            </v-avatar>
            <div>
              <div class="body-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">{{ userInfo.verifierId }}</div>
              <div class="body-2 text_3--text">
                <span>{{ t('tkeyCreate.walletAddress') }}: {{ slicedAddress }}</span>
                <v-icon size="14" class="ml-1 text_3--text" :style="{ marginTop: '-2px' }">$vuetify.icons.question_filled</v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-container>
      <v-container v-else class="pt-6 pb-5">
        <div class="text-center display-1 mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
          {{ tab === 1 ? t('tkeyCreate.setUpWallet') : t('tkeyCreate.greatCreated') }}
        </div>
      </v-container>
    </div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : tab === 1 ? 'xs7' : 'xs6']">
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <AddWallet @tKeyOnboardingCancel="tKeyOnboardingCancel" @next="tab = 1" />
            </v-tab-item>
            <v-tab-item>
              <SetupWallet :user-info="userInfo" @tKeyOnboardingCancel="tKeyOnboardingCancel" @next="tab = 2" />
            </v-tab-item>
            <v-tab-item>
              <CreatedWallet :wallets="computedWallets" @setDefaultPublicAddress="setDefaultPublicAddress" />
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import AddWallet from '../../components/Tkey/AddWallet'
import CreatedWallet from '../../components/Tkey/CreatedWallet'
import SetupWallet from '../../components/Tkey/SetupWallet'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { addressSlicer } from '../../utils/utils'

export default {
  name: 'TkeyCreate',
  components: { AddWallet, SetupWallet, CreatedWallet },
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      selectedAddress: 'selectedAddress',
      defaultPublicAddress: 'defaultPublicAddress',
    }),
    ...mapActions(['setTKeyOnboardingStatus', 'setDefaultPublicAddress']),
    slicedAddress() {
      return this.$vuetify.breakpoint.xsOnly
        ? `${this.selectedAddress.slice(0, 4)}...${this.selectedAddress.slice(-3)}`
        : `${this.selectedAddress.slice(0, 5)}...${this.selectedAddress.slice(-5)}`
    },
    computedWallets() {
      return Object.keys(this.wallets).reduce((acc, key) => {
        const { accountType } = this.wallets[key]
        if (accountType !== ACCOUNT_TYPE.IMPORTED)
          acc.push({
            key,
            keySliced: addressSlicer(key),
            accountType,
            isDefault: this.defaultPublicAddress ? key === this.defaultPublicAddress : accountType === ACCOUNT_TYPE.NORMAL,
            icon: accountType === ACCOUNT_TYPE.THRESHOLD ? 'wallet_fill' : this.userInfo.typeOfLogin.toLowerCase(),
            title: accountType === ACCOUNT_TYPE.THRESHOLD ? this.t('tkeyCreateDone.yourWallet') : this.userInfo.verifierId,
          })
        return acc
      }, [])
    },
  },
  methods: {
    async tKeyOnboardingCancel() {
      try {
        await this.setTKeyOnboardingStatus(true)
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet'
        this.$router.push(redirectPath).catch((_) => {})
      } catch (error) {
        log.error(error)
        this.$router.push('/wallet').catch((_) => {})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyCreate.scss';
</style>
