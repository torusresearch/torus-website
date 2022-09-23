<template>
  <div>
    <BeatLoader :color="$vuetify.theme.current.colors.torusBrand1" />
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

export default {
  name: 'ComponentLoader',
  components: { BeatLoader },
}
</script>
