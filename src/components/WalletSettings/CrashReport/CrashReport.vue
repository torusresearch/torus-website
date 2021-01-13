<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">{{ t('walletSettings.explainCrashReport') }}</div>
    <v-layout wrap mx-n3>
      <v-switch v-model="enabled" :label="t(enabled ? 'walletSettings.crashReportIsEnabled' : 'walletSettings.crashReportIsDisabled')"></v-switch>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'CrashReportSettings',
  computed: {
    enabled: {
      get() {
        return this.$store.state.crashReport
      },
      set(value) {
        this.$store.dispatch('setCrashReport', Boolean(value))
      },
    },
  },
}
</script>
