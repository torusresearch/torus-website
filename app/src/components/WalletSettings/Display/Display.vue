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
              @click="selectedTheme = theme"
              :style="themeOptionStyle(theme)"
              class="select-theme-item"
              v-for="theme in themes"
              :key="`${theme.name}`"
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
          <v-flex xs8 v-if="!$vuetify.breakpoint.xsOnly" class="pr-2">
            <notification
              :alert-show="selectThemeAlert"
              :alert-text="selectThemeAlertText"
              :alert-type="selectThemeAlertType"
              @closeAlert="closeAlert"
            />
          </v-flex>
          <v-flex xs12 sm4 :class="$vuetify.breakpoint.xsOnly ? '' : 'pl-2'">
            <v-btn color="primary" block depressed class="px-12 py-1" @click="saveTheme">{{ t('walletSettings.save') }}</v-btn>
          </v-flex>
          <v-flex xs12 v-if="$vuetify.breakpoint.xsOnly" class="mt-2">
            <notification
              :alert-show="selectThemeAlert"
              :alert-text="selectThemeAlertText"
              :alert-type="selectThemeAlertType"
              @closeAlert="closeAlert"
            />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Notification from '../../helpers/Notification'
import themes from '../../../plugins/themes'

export default {
  name: 'displaySettings',
  components: { Notification },
  data() {
    return {
      themes: themes,
      selectedTheme: '',
      selectThemeAlert: false,
      selectThemeAlertText: '',
      selectThemeAlertType: 'success'
    }
  },
  methods: {
    closeAlert() {
      this.selectThemeAlert = false
    },
    saveTheme() {
      this.$store
        .dispatch('setUserTheme', this.selectedTheme.name)
        .then(res => {
          this.selectedTheme = ''
          this.selectThemeAlert = true
          this.selectThemeAlertType = 'success'
          this.selectThemeAlertText = this.t('walletSettings.successSaveTheme')
        })
        .catch(err => {
          this.selectedTheme = ''
          this.selectThemeAlert = true
          this.selectThemeAlertType = 'error'
          this.selectThemeAlertText = err
        })
    },
    themeOptionStyle(theme) {
      if (theme)
        return {
          color: `${theme.theme.primary} !important`,
          backgroundColor: `${theme.theme.background_body_1} !important`,
          borderColor: theme.theme.primary,
          borderWidth: '1px',
          borderStyle: 'solid'
        }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
