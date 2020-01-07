<template>
  <v-menu offset-y bottom left z-index="20" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn id="locale-dropdown-btn" class="hidden-xs-only locale-selector" small text v-on="on">
        <!-- <v-icon left small>$vuetify.icons.globe</v-icon> -->
        <img :src="require('../../../../public/img/icons/globe.svg')" width="15" height="30" alt="Torus language globe" />
        <span class="subtitle-2 ml-1">{{ selectedLabel }}</span>
        <v-icon class="ml-2" small>$vuetify.icons.select</v-icon>
      </v-btn>
    </template>

    <v-card class="pa-4">
      <v-radio-group :value="localeSelected" @change="changeLocale" hide-details column class="ma-0">
        <v-radio v-for="locale in LOCALES" :label="locale.name" :value="locale.value" :key="locale.value"></v-radio>
      </v-radio-group>
    </v-card>
  </v-menu>
</template>

<script>
import { LOCALES, LOCALE_EN } from '../../../utils/enums'

export default {
  data() {
    return {
      LOCALES
    }
  },
  computed: {
    localeSelected() {
      return this.$vuetify.lang.current
    },
    selectedLabel() {
      return LOCALES.find(locale => locale.value === this.localeSelected).name
    }
  },
  methods: {
    changeLocale(locale) {
      this.$store.dispatch('setUserLocale', locale)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'LanguageSelector.scss';
</style>
