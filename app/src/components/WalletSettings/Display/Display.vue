<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <div class="body-2 text_1--text mb-1 px-1">Select Theme</div>
    <v-layout wrap>
      <v-flex xs12 sm4 px-1 mb-1 v-for="theme in themes" :key="`${theme.name}`">
        <v-btn @click="selectTheme(theme.name)" depressed block class="theme-btn" :class="`${theme.name}-color`" :style="themeBtnStyle(theme)">
          {{ theme.label }}
        </v-btn>
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
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },
  methods: {
    selectTheme(themeName) {
      this.$store.dispatch('setTheme', themeName)
    },
    saveTheme() {
      this.$store
        .dispatch('setUserTheme')
        .then(() => {
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarText = 'Successfully saved theme'
        })
        .catch(err => {
          this.snackbar = true
          this.snackbarColor = 'error'
          this.snackbarText = err
        })
    },
    themeBtnStyle(theme) {
      return {
        color: theme.theme.primary,
        backgroundColor: theme.theme.background_body_1,
        borderColor: theme.theme.primary,
        borderWidth: '1px',
        borderStyle: 'solid'
      }
    }
  }
}
</script>
