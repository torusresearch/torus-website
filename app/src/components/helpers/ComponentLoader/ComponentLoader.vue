<template>
  <beat-loader :color="color" />
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'

export default {
  name: 'componentLoader',
  data() {
    return {
      color: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.primary : this.$vuetify.theme.themes.light.primary
    }
  },
  components: { BeatLoader }
}
</script>
