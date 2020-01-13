<template>
  <v-menu offset-y :bottom="!$vuetify.breakpoint.xsOnly" :top="$vuetify.breakpoint.xsOnly" left z-index="20" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$vuetify.breakpoint.xsOnly" id="locale-dropdown-btn" class="locale-selector" small text v-on="on">
        <img :src="require('../../../../public/img/icons/globe.svg')" width="15" height="30" alt="Torus language globe" />
        <span class="subtitle-2 ml-1">{{ selectedLabel }}</span>
        <v-icon class="ml-2" small>$vuetify.icons.select</v-icon>
      </v-btn>

      <v-list-item v-on="on" v-else>
        <v-list-item-action class="ml-1 mr-1">
          <img :src="require('../../../../public/img/icons/globe.svg')" width="15" height="30" alt="Torus language globe" />
        </v-list-item-action>
        <v-list-item-content class="text_1--text">
          <span class="subtitle-2">
            {{ selectedLabel }}
            <v-icon class="mb-1" small>$vuetify.icons.select</v-icon>
          </span>
        </v-list-item-content>
      </v-list-item>
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
