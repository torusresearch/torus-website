<template>
  <v-menu :location="$vuetify.display.smAndDown ? 'top' : 'bottom'" :style="{ zIndex: 10000 }" offset-y>
    <template #activator="{ props }">
      <v-btn
        v-if="!$vuetify.display.smAndDown"
        id="locale-dropdown-btn"
        class="locale-selector"
        size="small"
        variant="text"
        aria-label="Select Language"
        v-bind="props"
      >
        <img :src="require('../../../assets/img/icons/globe.svg')" width="15" height="30" alt="Language Icon" />
        <span class="ml-1" :class="$vuetify.display.smAndDown">{{ selectedLabel }}</span>
        <v-icon class="ml-2" size="small">$select</v-icon>
      </v-btn>

      <v-list-item v-else v-bind="props">
        <template #prepend>
          <div class="ml-1 mr-1" :class="{ isMobile: $vuetify.display.smAndDown }">
            <img :src="require('../../../assets/img/icons/globe.svg')" width="15" height="30" alt="Language Icon" />
          </div>
        </template>
        <span class="caption font-weight-bold">
          {{ selectedLabel }}
          <v-icon size="small">$select</v-icon>
        </span>
      </v-list-item>
    </template>

    <v-card class="pa-3">
      <v-list min-width="190" density="compact">
        <v-item-group color="torusBrand1">
          <v-list-item
            v-for="locale in LOCALES"
            :key="locale.value"
            :class="localeSelected === locale.value ? 'active' : ''"
            @click="changeLocale(locale.value)"
          >
            <v-list-item-title>{{ locale.name }}</v-list-item-title>
          </v-list-item>
        </v-item-group>
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
      return this.$i18n.locale
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
