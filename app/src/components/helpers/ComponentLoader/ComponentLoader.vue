<template>
  <div>
    <BeatLoader :color="color" />
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'

export default {
  name: 'ComponentLoader',
  components: { BeatLoader },
  computed: {
    color() {
      return this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.torusBrand1 : this.$vuetify.theme.themes.light.torusBrand1
    },
  },
}
</script>
