<template>
  <v-card class="verify-login-container">
    <v-btn class="close-btn" icon @click="onCancel">
      <v-icon small>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="text-center header-container" mb-4 py-5 xs12>
        <v-avatar class="header-image-holder">
          <v-icon size="24">$vuetify.icons.click</v-icon>
        </v-avatar>
      </v-flex>

      <v-flex xs12 mx-4 class="text-center">
        <div class="mb-2 font-weight-bold text_2--text headline">{{ t('walletHome.verifyLogin') }}</div>
        <div>
          <div class="mb-4 text_2--text caption">{{ t('walletHome.verifyLoginDesc1') }}</div>
          <div class="mb-4 text_2--text caption">{{ t('walletHome.verifyLoginDesc2') }}</div>
        </div>

        <v-btn
          class="torus-btn1 mb-6"
          :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
          :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
          @click="onGoToSettings"
        >
          {{ t('walletHome.goSettings') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  methods: {
    onCancel() {
      this.$emit('onClose')
    },
    onGoToSettings() {
      this.$emit('onClose')
      this.$router.push({ name: 'walletSettings' }).catch((_) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'VerfyLoginDialog.scss';
</style>
