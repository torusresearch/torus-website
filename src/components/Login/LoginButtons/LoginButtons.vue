<template>
  <v-flex xs10 sm12 ml-auto mr-auto>
    <div :style="{ maxWidth: '372px' }">
      <LoginButton
        v-for="verifier in mainButtonsLong"
        :key="verifier.verifier"
        :verifier="verifier"
        :active="verifier.verifier === active"
        :block="true"
        :is-long="true"
        @mouseover="setActiveBtn(verifier.verifier)"
        @click="triggerLogin(verifier.verifier)"
      />
    </div>
    <v-layout wrap :style="{ maxWidth: '380px' }" mx-n1>
      <v-flex
        v-for="verifier in mainButtons"
        :key="verifier.verifier"
        px-1
        :class="!viewMoreOptions || isPopup || $vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'"
      >
        <LoginButton
          :verifier="verifier"
          :active="verifier.verifier === active"
          :block="true"
          @mouseover="setActiveBtn(verifier.verifier)"
          @click="triggerLogin(verifier.verifier)"
        />
      </v-flex>
    </v-layout>
    <div v-if="loginButtonsLong.length > 0" :style="{ maxWidth: '372px' }">
      <div class="d-flex align-center my-4">
        <v-divider />
        <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
          <div class="body-2 text_2--text">{{ t('login.or') }}</div>
        </div>
        <v-divider />
      </div>
      <div v-for="verifier in loginButtonsLong" :key="verifier.verifier" class="mb-2">
        <LoginButton
          :verifier="verifier"
          :active="verifier.verifier === active"
          :block="true"
          :is-long="true"
          @mouseover="setActiveBtn(verifier.verifier)"
          @click="triggerLogin(verifier.verifier)"
        />
      </div>
    </div>
    <div class="d-flex align-center" :style="{ maxWidth: '372px' }">
      <v-spacer></v-spacer>
      <v-btn x-small :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
        <span class="body-2">{{ viewMoreOptions ? t('dappLogin.viewLess') : t('dappLogin.viewMore') }}</span>
        <v-icon>$vuetify.icons.select</v-icon>
      </v-btn>
    </div>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'

import LoginButton from '../LoginButton'

export default {
  components: { LoginButton },
  props: {
    active: {
      type: String,
      default: '',
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      viewMoreOptions: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray']),
    mainButtonsLong() {
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          button.mainOption &&
          button.description !== ''
      )
    },
    mainButtons() {
      return this.loginButtonsArray.filter((button) => {
        if (this.viewMoreOptions) {
          return (
            ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
            button.description === ''
          )
        }
        return (!this.$vuetify.breakpoint.xsOnly || button.showOnMobile) && button.mainOption && button.description === ''
      })
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          !button.mainOption &&
          button.description !== ''
      )
    },
  },
  methods: {
    setActiveBtn(verifier) {
      this.$emit('setActiveBtn', verifier)
    },
    triggerLogin(verifier) {
      this.$emit('triggerLogin', verifier)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginButtons.scss';
</style>
