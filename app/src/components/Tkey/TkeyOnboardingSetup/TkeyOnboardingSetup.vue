<template>
  <div class="add-wallet-container" :class="[{ 'is-dark': $vuetify.theme.dark, mobile: $vuetify.breakpoint.xsOnly }]">
    <div class="mb-7">
      <div class="mb-1" :class="[$vuetify.breakpoint.xsOnly ? 'headline' : 'display-1', $vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text']">
        {{ t('tkeyCreateAdd.settingUp') }}
      </div>
      <div class="text_2--text font-weight-regular" :class="$vuetify.breakpoint.xsOnly ? 'body-1' : 'headline'">
        {{ t('tkeyCreateAdd.multipleFactors') }}
      </div>
    </div>
    <v-layout wrap class="mb-8 mx-n2 add-wallet-images">
      <v-flex class="px-2 xs4">
        <img src="../../../assets/images/ob-social.svg" :alt="t('tkeyCreateAdd.socialLogin')" />
        <div class="text_1--text caption font-weight-bold mb-1">{{ t('tkeyCreateAdd.socialLogin') }}</div>
        <div class="text_2--text caption-3">{{ t('tkeyCreateAdd.socialLoginDesc') }}</div>
      </v-flex>
      <v-flex class="px-2 xs4">
        <img src="../../../assets/images/ob-browser.svg" :alt="t('tkeyCreateAdd.browser')" />
        <div class="text_1--text caption font-weight-bold mb-1">{{ t('tkeyCreateAdd.browser') }}</div>
        <div class="text_2--text caption-3">{{ t('tkeyCreateAdd.browserDesc') }}</div>
      </v-flex>
      <v-flex class="px-2 xs4">
        <img src="../../../assets/images/ob-password.svg" :alt="t('tkeyCreateAdd.password')" />
        <div class="text_1--text caption font-weight-bold mb-1">{{ t('tkeyCreateAdd.password') }}</div>
        <div class="text_2--text caption-3">{{ t('tkeyCreateAdd.passwordDesc') }}</div>
      </v-flex>
    </v-layout>
    <div class="add-wallet-info mb-12" :class="$vuetify.breakpoint.xsOnly ? 'is-mobile' : ''">
      <div class="body-2 text_2--text">
        {{ t('tkeyCreateAdd.tkeyManaged') }}
      </div>
    </div>
    <v-layout wrap class="mx-n2 mb-12 mt-9 align-end">
      <v-flex class="xs12 sm5 px-2" :class="{ 'text-center mb-4': $vuetify.breakpoint.xsOnly }"></v-flex>
      <v-flex class="xs12 sm7 px-2">
        <v-layout class="mx-n2">
          <v-flex class="xs6 px-2">
            <v-btn
              block
              text
              large
              :color="$vuetify.theme.dark ? 'white' : ''"
              :class="$vuetify.theme.dark ? '' : 'text_2--text'"
              class="caption font-weight-bold"
              @click="tKeyOnboardingCancel"
            >
              {{ t('tkeyCreateAdd.skip') }}
            </v-btn>
          </v-flex>
          <v-flex class="xs6 px-2">
            <v-btn block large color="torusBrand1" class="white--text caption font-weight-bold" :title="t('tkeyCreateAdd.sureLetsAdd')" @click="next">
              {{ t('tkeyCreateAdd.continue') }}
            </v-btn>
            <div class="caption-3 text_2--text text-center mt-1">{{ t('tkeyCreateAdd.noWorry') }}</div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <div class="text-center caption text_3--text">2 {{ t('tkeyCreateAdd.of') }} 2</div>
  </div>
</template>

<script>
export default {
  methods: {
    tKeyOnboardingCancel() {
      this.$emit('tKeyOnboardingCancel')
    },
    next() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyOnboardingSetup.scss';
</style>
