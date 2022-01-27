<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">{{ t('walletSettings.explainCrashReport') }}</div>
    <v-layout wrap>
      <v-switch
        :input-value="enabled"
        :label="t(enabled ? 'walletSettings.crashReportIsEnabled' : 'walletSettings.crashReportIsDisabled')"
        @change="setCrashReport"
      ></v-switch>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CrashReportSettings',
  computed: mapState({
    enabled: 'crashReport',
  }),
  methods: mapActions(['setCrashReport']),
}
</script>
