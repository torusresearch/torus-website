<template>
  <content-loader :height="600" :width="450" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="15.5" y="17.61" rx="0" ry="0" width="46.13" height="28.18" />
    <rect x="15.5" y="63.61" rx="0" ry="0" width="139.18" height="22.12" />
    <rect x="15.5" y="92.61" rx="0" ry="0" width="418.85" height="51.14" />
    <rect x="15.5" y="330.61" rx="0" ry="0" width="412.23" height="9.83" />
    <rect x="15.5" y="148.61" rx="0" ry="0" width="418.85" height="51.14" />
    <rect x="15.5" y="205.61" rx="0" ry="0" width="418.85" height="51.14" />
    <rect x="15.5" y="263.61" rx="0" ry="0" width="418.85" height="51.14" />
    <rect x="15.5" y="345.61" rx="0" ry="0" width="255.58" height="8.74" />
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
