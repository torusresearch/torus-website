<template>
  <div v-if="torusWallets.length > 0" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <v-list dense outlined class="pa-0 account-list mb-2">
      <v-list-item v-for="wallet in torusWallets" :key="wallet.key" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.${wallet.icon}` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">{{ wallet.title }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <v-btn :disabled="settingKey" :loading="settingKey" text small color="torusBrand1" class="caption" @click="selectWallet(wallet.key)">
            {{ !settingKey ? t('walletSettings.customKey.setCustomKey') : t('walletSettings.customKey.settingKey') }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-dialog v-model="torusKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly" @click:outside="dialogClose">
      <TorusKeyDialog :prev-key="selectedTorusWallet" @dialogClose="dialogClose" @setKey="setKey" @resetKey="resetKey" />
    </v-dialog>
  </div>
</template>

<script>
import { BN } from 'ethereumjs-util'
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import torus from '../../../torus'
import { ACCOUNT_TYPE } from '../../../utils/enums'
import TorusKeyDialog from '../TorusKeyDialog'

const { ec } = torus

export default {
  name: 'SetTorusKey',
  components: { TorusKeyDialog },
  data() {
    return {
      selectedTorusWallet: '',
      torusKeyDialog: false,
      settingKey: false,
    }
  },
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    torusWallets() {
      return Object.keys(this.wallets).reduce((acc, key) => {
        const { accountType } = this.wallets[key]
        if (accountType === ACCOUNT_TYPE.NORMAL)
          acc.push({
            key,
            accountType,
            icon: this.userInfo.typeOfLogin.toLowerCase(),
            title: this.userInfo.verifierId,
          })
        return acc
      }, [])
    },
  },
  methods: {
    ...mapActions(['setTorusKey', 'logOut']),
    dialogClose() {
      this.selectedTorusWallet = ''
      this.torusKeyDialog = false
    },
    selectWallet(address) {
      this.selectedTorusWallet = address
      this.torusKeyDialog = true
    },
    async resetKey(prevAddress) {
      this.settingKey = true
      try {
        const wallet = this.wallets[`0x${prevAddress}`]
        if (wallet) {
          const defaultKey = new BN(wallet.privateKey, 16).sub(new BN(wallet.metadataNonceHex, 16)).umod(ec.curve.n)
          await this.setTorusKey({ prevAddress, newKey: defaultKey.toString(16) })
        }
      } catch (error) {
        log.error(error)
      } finally {
        this.settingKey = false
        this.logOut()
      }
    },
    async setKey(prevAddress, newKey) {
      this.settingKey = true
      try {
        const wallet = this.wallets[`0x${prevAddress}`]
        if (wallet) {
          await this.setTorusKey({ prevAddress, newKey })
        }
      } catch (error) {
        log.error(error)
      } finally {
        this.settingKey = false
        this.logOut()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetTorusKey.scss';
</style>
