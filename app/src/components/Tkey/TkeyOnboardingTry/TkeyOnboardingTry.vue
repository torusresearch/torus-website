<template>
  <div class="add-wallet-container" :class="[{ 'is-dark': $vuetify.theme.dark, mobile: $vuetify.breakpoint.xsOnly }]">
    <div class="mb-6">
      <div class="mb-1" :class="[$vuetify.breakpoint.xsOnly ? 'headline' : 'display-1', $vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text']">
        {{ t('tkeyCreateAdd.tryTkey') }}
      </div>
      <div class="text_2--text font-weight-regular" :class="$vuetify.breakpoint.xsOnly ? 'body-1' : 'headline'">
        {{ t('tkeyCreateAdd.tryTkeyDesc') }}
      </div>
    </div>
    <div class="add-wallet-info">
      <div class="mb-4 body-2 text_2--text">
        {{ t('tkeyCreateAdd.tkeyIs1') }}
        <span class="font-weight-bold">{{ t('tkeyCreateAdd.tkeyIs2') }}</span>
        {{ t('tkeyCreateAdd.tkeyIs3') }}
      </div>
      <div class="mb-4 body-2 text_2--text">
        {{ t('tkeyCreateAdd.tkeyUseful') }}
      </div>
      <div>
        <a class="body-2 font-weight-bold torusBrand1--text text-decoration-none" href="https://hackmd.io/keVuRfrwSxygfyCfzsrQfw" target="_blank">
          {{ t('tkeyCreateAdd.learnMore') }}
          <v-icon class="torusBrand1--text" small>$vuetify.icons.page_next</v-icon>
        </a>
      </div>
    </div>
    <v-layout wrap class="mx-n2 mb-12 mt-9 align-end">
      <v-flex class="xs12 sm5 px-2" :class="{ 'text-center mb-4': $vuetify.breakpoint.xsOnly }">
        <img src="../../../assets/images/ob-tkey.svg" alt="tKey" :style="{ width: $vuetify.breakpoint.xsOnly ? '70%' : '100%' }" />
      </v-flex>
      <v-flex class="xs12 sm7 px-2">
        <v-layout class="mx-n2">
          <v-flex class="xs6 sm5 px-2">
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
          <v-flex class="xs6 sm7 px-2">
            <v-btn block large color="torusBrand1" class="white--text caption font-weight-bold" :title="t('tkeyCreateAdd.sureLetsAdd')" @click="next">
              {{ t('tkeyCreateAdd.letsTry') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <div class="text-center caption text_3--text">1 {{ t('tkeyCreateAdd.of') }} 2</div>
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
@import 'TkeyOnboardingTry.scss';
</style>
