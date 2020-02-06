<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <div class="body-2 text_1--text mb-1 px-1">{{ t('walletSettings.selectTheme') }}</div>
    <v-layout wrap>
      <v-flex xs12 md6 px-1 mb-1>
        <v-select
          id="select-theme"
          class="select-theme-container"
          outlined
          :items="themes"
          item-text="label"
          item-value="name"
          v-model="selectedTheme"
          append-icon="$vuetify.icons.select"
          aria-label="Select Theme"
          return-object
        ></v-select>
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
          this.selectThemeAlert = true
          this.selectThemeAlertType = 'success'
          this.selectThemeAlertText = this.t('walletSettings.successSaveTheme')
        })
        .catch(err => {
          this.selectThemeAlert = true
          this.selectThemeAlertType = 'error'
          this.selectThemeAlertText = err
        })
    }
  },
  computed: {
    themes() {
      const finalThemes = JSON.parse(JSON.stringify(Object.values(themes)))
      return finalThemes.map(finalTheme => {
        finalTheme.label = this.t(finalTheme.label)
        return finalTheme
      })
      return finalThemes
    }
  },
  mounted() {
    this.selectedTheme = themes[this.$store.state.theme]
  }
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
