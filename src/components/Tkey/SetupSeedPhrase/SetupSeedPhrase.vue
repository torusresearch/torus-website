<template>
  <div class="setup-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center mb-6">
      <div class="headline mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text'">
        {{ t('tkeySettings.tkeySeedPhrase.add.required.title') }}
      </div>
      <div class="body-2 text_2--text mb-4">
        {{ t('tkeySettings.tkeySeedPhrase.add.required.description1') }}
      </div>
      <div class="body-2 text_2--text">
        {{ t('tkeySettings.tkeySeedPhrase.add.required.description2') }}
      </div>
    </div>
    <div>SeedPhrase</div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          class="body-2 font-weight-bold"
          outlined
          :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'"
          @click="cancelSeedPhrase"
        >
          {{ t('tkeyNew.cancel') }}
        </v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          color="torusBrand1"
          class="white--text body-2 font-weight-bold"
          :loading="settingUpSeedPhrase"
          @click="createSeedPhrase"
        >
          {{ t('tkeyNew.confirm') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingUpSeedPhrase: false,
    }
  },
  methods: {
    createSeedPhrase() {
      this.settingUpSeedPhrase = true
      // eslint-disable-next-line no-console
      console.log('🚀 ~ createSeedPhrase ~ createSeedPhrase')
    },
    cancelSeedPhrase() {
      this.$emit('cancelSeedPhrase')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetupSeedPhrase.scss';
</style>
