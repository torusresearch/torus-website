<template>
  <div class="torus-widget">
    <v-card class="torus-widget__panel pa-4">
      <div class="d-flex torus-widget__user-details">
        <div class="avatar-container">
          <v-avatar size="32">
            <img src="https://avatars2.githubusercontent.com/u/4738957?s=460&v=4" alt="John" />
          </v-avatar>
        </div>
        <div class="details-container d-flex flex-column ml-2">
          <div class="d-flex align-center">
            <img class="details-container__icon" :src="require(`../../../../public/img/icons/login-google-grey.svg`)" />
            <div class="details-container__text ml-2">llenoil@gmail.com</div>
            <v-icon size="16" class="ml-auto text_2--text">$vuetify.icons.select</v-icon>
          </div>
          <div class="d-flex align-center">
            <img class="details-container__icon" :src="require(`../../../../public/img/icons/address-wallet.svg`)" />
            <div class="details-container__text ml-2">0x92232w34D4...c13ef33bE47</div>
            <v-icon size="8" class="ml-auto text_2--text">$vuetify.icons.copy</v-icon>
          </div>
        </div>
      </div>
      <div class="d-flex torus-widget__amount-details mt-5">
        <div>
          <div>
            <span class="caption text_2--text">TOTAL VALUE</span>
          </div>
          <div>
            <span class="amount">0.1443 USD</span>
          </div>
        </div>
        <div class="ml-auto">
          <v-btn fab depressed small>
            <v-icon>$vuetify.icons.send</v-icon>
          </v-btn>

          <v-btn fab depressed small class="ml-2">
            <v-icon>$vuetify.icons.add</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="torus-widget__transaction-details mt-8">
        <div class="d-flex">
          <span class="caption text_2--text">RECENT ACTIVITY</span>
          <span class="caption primary--text ml-auto">Open Wallet</span>
        </div>
        <v-divider class="my-1"></v-divider>
        <div class="d-flex mb-4 mt-2">
          <div class="avatar-container">
            <v-avatar size="40">
              <img src="https://avatars2.githubusercontent.com/u/4738957?s=460&v=4" alt="John" />
            </v-avatar>
          </div>
          <div class="ml-4">
            <div class="body-2 text_2--text">Send ETH</div>
            <div class="caption">To: 0x92D4...c1bE47</div>
          </div>
          <div class="ml-auto" :style="{ lineHeight: '0px' }">
            <span class="body-2 text_2--text">0.0001 ETH</span>
          </div>
        </div>
      </div>
    </v-card>
    <v-btn color="primary" fab @click="activeWidget = !activeWidget">
      <BeatLoader v-if="isLoading" size="10px" color="white" />
      <img v-else class="torus-widget__logo" :src="require(`../../../../public/img/icons/torus-icon-light.svg`)" />
    </v-btn>
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'

export default {
  name: 'PopupWidget',
  components: { BeatLoader },
  data() {
    return {
      isLoading: false,
      activeWidget: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupWidget.scss';
</style>
