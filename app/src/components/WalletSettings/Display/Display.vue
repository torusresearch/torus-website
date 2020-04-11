<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <div class="body-2 text_1--text mb-1 px-1">{{ t('walletSettings.selectTheme') }}</div>
    <v-layout wrap>
      <v-flex xs12 md6 px-1 mb-1>
        <v-menu class="" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="select-theme" :style="themeOptionStyle(selectedTheme)" label outlined large v-on="on">
              <span>{{ selectedTheme ? t(selectedTheme.label) : t('walletSettings.selectTheme') }}</span>
              <div class="flex-grow-1 text-right pr-2">
                <v-icon right>$vuetify.icons.select</v-icon>
              </div>
            </v-chip>
          </template>
          <v-list class="select-theme-list pa-0">
            <v-list-item
              v-for="theme in themes"
              :key="`${theme.name}`"
              :style="themeOptionStyle(theme)"
              class="select-theme-item"
              @click="selectedTheme = theme"
            >
              {{ t(theme.label) }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout class="mt-4">
      <v-flex xs12 md6>
        <v-layout wrap>
          <v-flex xs12 sm4 :class="$vuetify.breakpoint.xsOnly ? '' : 'pl-2'">
            <v-btn color="primary" block depressed class="px-12 py-1" @click="saveTheme">{{ t('walletSettings.save') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import log from 'loglevel'

import themes from '../../../plugins/themes'

export default {
  name: 'DisplaySettings',
  data() {
    return {
      themes,
      selectedTheme: '',
    }
  },
  methods: {
    async saveTheme() {
      try {
        await this.$store.dispatch('setUserTheme', this.selectedTheme.name)
      } catch (error) {
        log.error(error)
      } finally {
        this.selectedTheme = ''
      }
    },
    themeOptionStyle(theme) {
      if (!theme) return {}
      return {
        color: `${theme.theme.primary.base} !important`,
        backgroundColor: `${theme.theme.background_body_1} !important`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
