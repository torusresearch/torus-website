<template>
  <content-loader :height="600" :width="450" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="15.5" y="17.61" rx="0" ry="0" width="46.13" height="28.18" />
    <rect x="15.5" y="72.61" rx="0" ry="0" width="189.28" height="11.5" />
    <rect x="15.5" y="99.61" rx="0" ry="0" width="414.66" height="23.52" />
    <circle cx="47.75" cy="170.73" r="32.12" />
    <rect x="94.63" y="140.61" rx="0" ry="0" width="331.73" height="59.46" />
    <circle cx="47.75" cy="251.73" r="32.12" />
    <rect x="94.63" y="221.61" rx="0" ry="0" width="331.73" height="59.46" />
    <circle cx="47.75" cy="330.73" r="32.12" />
    <rect x="94.63" y="298.61" rx="0" ry="0" width="331.73" height="59.46" />
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
