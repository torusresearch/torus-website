<template>
  <div>
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
          <v-btn text small color="torusBrand1" class="caption" @click="setKey(wallet.key)">
            {{ 'Set key' }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-dialog v-model="torusKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <TorusKeyDialog key-data="selectedTorusKey" @onClose="torusKeyDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { ACCOUNT_TYPE } from '../../../utils/enums'
import TorusKeyDialog from '../TorusKeyDialog'

export default {
  name: 'SetTorusKey',
  components: { TorusKeyDialog },
  data() {
    return {
      selectedTorusKey: '',
      torusKeyDialog: false,
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
    setKey(key) {
      this.selectedTorusKey = key
      this.torusKeyDialog = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetTorusKey.scss';
</style>
