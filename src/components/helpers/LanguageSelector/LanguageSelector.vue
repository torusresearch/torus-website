<template>
  <v-menu offset-y :bottom="!$vuetify.breakpoint.smAndDown" :top="$vuetify.breakpoint.smAndDown" left z-index="20">
    <template #activator="{ on }">
      <v-btn v-if="!$vuetify.breakpoint.smAndDown" id="locale-dropdown-btn" class="locale-selector" small text aria-label="Select Language" v-on="on">
        <img src="../../../assets/img/icons/globe.svg" width="15" height="30" alt="Language Icon" />
        <span class="ml-1" :class="$vuetify.breakpoint.smAndDown">{{ selectedLabel }}</span>
        <v-icon class="ml-2" small>$vuetify.icons.select</v-icon>
      </v-btn>

      <v-list-item v-else v-on="on">
        <v-list-item-action class="ml-1 mr-1" :class="{ isMobile: $vuetify.breakpoint.smAndDown }">
          <img src="../../../assets/img/icons/globe.svg" width="15" height="30" alt="Language Icon" />
        </v-list-item-action>
        <v-list-item-content>
          <span class="caption font-weight-bold">
            {{ selectedLabel }}
            <v-icon small>$vuetify.icons.select</v-icon>
          </span>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card class="pa-3">
      <v-list min-width="190" dense>
        <v-list-item-group color="torusBrand1">
          <v-list-item
            v-for="locale in LOCALES"
            :key="locale.value"
            :class="localeSelected === locale.value ? 'active' : ''"
            @click="changeLocale(locale.value)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ locale.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapActions } from 'vuex'

import { LOCALES } from '../../../utils/enums'

export default {
  data() {
    return {
      LOCALES,
    }
  },
  computed: {
    localeSelected() {
      return this.$vuetify.lang.current
    },
    selectedLabel() {
      return LOCALES.find((locale) => locale.value === this.localeSelected).name
    },
  },
  methods: {
    ...mapActions(['setUserLocale']),
    changeLocale(locale) {
      this.setUserLocale(locale)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LanguageSelector.scss';
</style>
