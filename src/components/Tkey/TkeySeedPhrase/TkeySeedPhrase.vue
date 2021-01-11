<template>
  <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
    <v-layout class="justify-center">
      <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
        <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
          <v-flex text-center xs12 pt-7 pb-2 px-6>
            <v-avatar class="avatar" size="64">
              <v-icon size="20" dark>$vuetify.icons.tkey_seed_phrase</v-icon>
            </v-avatar>
          </v-flex>
          <SetupSeedPhrase :is-required="true" :adding-seed-phrase="addingSeedPhrase" @addSeedPhrase="createSeedPhrase" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SetupSeedPhrase from '../SetupSeedPhrase'

export default {
  name: 'TKeySeedPhrase',
  components: { SetupSeedPhrase },
  props: {
    addingSeedPhrase: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    createSeedPhrase(seedPhrase) {
      this.$emit('addSeedPhrase', seedPhrase)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeySeedPhrase.scss';
</style>
