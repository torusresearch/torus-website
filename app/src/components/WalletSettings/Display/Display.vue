<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <div class="body-2 text_1--text mb-1 px-1">Select Theme</div>
    <v-layout wrap>
      <v-flex xs12 px-1 mb-1>
        <v-menu class="" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-chip class="select-theme" :style="themeOptionStyle(selectedTheme)" label outlined large v-on="on">
              <span>{{ selectedTheme ? selectedTheme.label : 'Select a theme' }}</span>
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
              {{ theme.label }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-flex class="pt-4 text-right">
      <v-btn color="primary" depressed class="px-12 py-1 mt-4" @click="saveTheme()">Save</v-btn>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import themes from '../../../plugins/themes'

export default {
  name: 'displaySettings',
  data() {
    return {
      themes: themes,
      selectedTheme: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },
  methods: {
    saveTheme() {
      this.$store
        .dispatch('setUserTheme', this.selectedTheme.name)
        .then(() => {
          this.selectedTheme = ''
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarText = 'Successfully saved theme'
        })
        .catch(err => {
          this.selectedTheme = ''
          this.snackbar = true
          this.snackbarColor = 'error'
          this.snackbarText = err
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
