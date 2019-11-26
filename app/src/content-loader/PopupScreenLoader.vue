<template>
  <content-loader
    :height="160"
    :width="400"
    :speed="2"
    :primaryColor="this.$vuetify.theme.dark ? '#2E3135' : '#f3f3f3'"
    :secondaryColor="this.$vuetify.theme.dark ? '#2E3135' : '#ecebeb'"
  >
    <rect x="7" y="26" rx="4" ry="4" width="140.4" height="13.12" />
    <rect x="8" y="71.08" rx="3" ry="3" width="276.5" height="9.09" />
    <rect x="8" y="43.61" rx="3" ry="3" width="126.63" height="8.64" />
    <rect x="9" y="87" rx="3" ry="3" width="374.5" height="111.73" />
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader
  }
}
</script>
