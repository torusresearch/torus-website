<template>
  <div class="select-theme-container" :class="$vuetify.display.xs ? 'pt-5' : 'py-5'">
    <div class="body-2 text-torusFont1 mb-2 px-1">{{ $t('walletSettings.explainCrashReport') }}</div>
    <div>
      <v-switch
        hide-details
        density="compact"
        :input-value="enabled"
        :label="$t(enabled ? 'walletSettings.crashReportIsEnabled' : 'walletSettings.crashReportIsDisabled')"
        @change="setCrashReport"
      ></v-switch>
    </div>
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
