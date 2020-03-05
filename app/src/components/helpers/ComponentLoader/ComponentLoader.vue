<template>
  <BeatLoader :color="color" />
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'

export default {
  name: 'ComponentLoader',
  components: { BeatLoader },
  data() {
    return {
      color: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.primary.base : this.$vuetify.theme.themes.light.primary.base
    }
  }
}
</script>
