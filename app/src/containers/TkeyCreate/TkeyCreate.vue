<template>
  <div>
    <div class="header-container" :class="{ 'is-dark': $vuetify.theme.dark, mobile: $vuetify.breakpoint.xsOnly }">
      <v-container v-if="tab <= 1" class="pt-6 pb-5">
        <div class="text-center headline mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
          {{ t('tkeyCreate.yourSignedIn') }}
        </div>
        <div class="d-flex">
          <div class="account-details d-flex pa-3 px-4">
            <v-avatar size="34" class="mr-2">
              <img
                :src="userInfo.profileImage"
                class="align-start"
                :alt="userInfo.name"
                onerror="if (!this.src.includes('/images/person.jpeg')) this.src = '/images/person.jpeg';"
              />
            </v-avatar>
            <div>
              <div
                class="body-2"
                :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'"
                :style="{ maxWidth: '200px', overflowWrap: 'break-word' }"
              >
                {{ userEmail }}
              </div>
              <div class="body-2 text_3--text">
                <span>{{ t('tkeyCreate.walletAddress') }}: {{ slicedAddress }}</span>

                <HelpTooltip title="Wallet Address">
                  <template v-slot:description>
                    <div class="caption text_3--text">{{ t('tkeyCreate.walletAddressDesc') }}</div>
                  </template>
                </HelpTooltip>
              </div>
            </div>
          </div>
        </div>
      </v-container>
      <v-container v-else class="pt-6 pb-5">
        <div class="text-center display-1 mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
          {{ tab === 2 ? t('tkeyCreate.setUpWallet') : t('tkeyCreate.greatCreated') }}
        </div>
      </v-container>
    </div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pb-0 px-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex class="xs12 sm10 md8 lg7">
          <v-tabs-items v-model="tab" touchless>
            <v-tab-item>
              <TkeyOnboardingTry @tKeyOnboardingCancel="tKeyOnboardingCancel" @next="tab = 1" />
            </v-tab-item>
            <v-tab-item>
              <TkeyOnboardingSetup @tKeyOnboardingCancel="tKeyOnboardingCancel" @next="tab = 2" />
            </v-tab-item>
            <v-tab-item>
              <SetupWallet
                :creating-tkey="creatingTkey"
                :verifier-name="verifierName"
                :type-of-login="userInfo.typeOfLogin"
                :user-email="userEmail"
                @tKeyOnboardingCancel="tKeyOnboardingCancel"
                @createNewTKey="createTKey"
              />
            </v-tab-item>
            <v-tab-item>
              <CreatedWallet
                :wallets="computedWallets"
                :default-public-address="selectedPublicAddress"
                @setDefaultPublicAddress="setDefaultAddress"
              />
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

import HelpTooltip from '../../components/helpers/HelpTooltip'
import CreatedWallet from '../../components/Tkey/CreatedWallet'
import SetupWallet from '../../components/Tkey/SetupWallet'
import TkeyOnboardingSetup from '../../components/Tkey/TkeyOnboardingSetup'
import TkeyOnboardingTry from '../../components/Tkey/TkeyOnboardingTry'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { addressSlicer, getUserEmail } from '../../utils/utils'

export default {
  name: 'TkeyCreate',
  components: { TkeyOnboardingSetup, TkeyOnboardingTry, SetupWallet, CreatedWallet, HelpTooltip },
  data() {
    return {
      tab: 0,
      creatingTkey: false,
    }
  },
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      selectedAddress: 'selectedAddress',
      defaultPublicAddress: 'defaultPublicAddress',
      tKeyExists: 'tKeyExists',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    userEmail() {
      return getUserEmail(this.userInfo, this.loginConfig, this.t('accountMenu.wallet'))
    },
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
            icon: accountType === ACCOUNT_TYPE.THRESHOLD ? 'wallet' : this.userInfo.typeOfLogin.toLowerCase(),
            title: accountType === ACCOUNT_TYPE.THRESHOLD ? this.t('tkeyCreateDone.yourWallet') : this.userInfo.verifierId,
          })
        return acc
      }, [])
    },
    selectedPublicAddress() {
      return this.defaultPublicAddress || Object.keys(this.wallets).find((x) => this.wallets[x].accountType === ACCOUNT_TYPE.THRESHOLD)
    },
    verifierName() {
      const verifierName = this.loginConfig[this.userInfo.verifier].name
      return verifierName.charAt(0).toUpperCase() + verifierName.slice(1)
    },
  },
  mounted() {
    if (this.tKeyExists) this.redirectHome()
  },
  methods: {
    ...mapActions(['setTKeyOnboardingStatus', 'setDefaultPublicAddress', 'createNewTKey']),
    redirectHome() {
      let redirectPath = this.$route.query.redirect
      if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet/home'
      this.$router.push(redirectPath).catch((_) => {})
    },
    async tKeyOnboardingCancel() {
      try {
        await this.setTKeyOnboardingStatus(true)
      } catch (error) {
        log.error(error)
      } finally {
        this.redirectHome()
      }
    },
    async setDefaultAddress(address) {
      await this.setTKeyOnboardingStatus(true)
      await this.setDefaultPublicAddress(address)
      this.redirectHome()
    },
    async createTKey(payload) {
      try {
        this.creatingTkey = true
        await this.createNewTKey(payload)
        this.tab = 3
      } catch (error) {
        log.error(error)
      } finally {
        this.creatingTkey = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyCreate.scss';
</style>
