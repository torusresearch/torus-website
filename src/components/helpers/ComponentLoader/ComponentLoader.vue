<template>
  <div>
    <BeatLoader :color="$vuetify.theme.currentTheme.torusBrand1" />
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

export default {
  name: 'ComponentLoader',
  components: { BeatLoader },
}
</script>
