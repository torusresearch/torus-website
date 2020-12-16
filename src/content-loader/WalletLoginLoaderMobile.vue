<template>
  <ContentLoader :height="600" :width="450" :speed="2" torus_brand1-color="#E7EDF3" secondary-color="#ecebeb">
    <rect x="47.5" y="27.61" rx="0" ry="0" width="124.68" height="28.18" />
    <rect x="47.5" y="89.61" rx="0" ry="0" width="183.13" height="27.31" />
    <rect x="47.5" y="129.61" rx="0" ry="0" width="335.08" height="10.75" />
    <rect x="47.5" y="146.61" rx="0" ry="0" width="288.33" height="9.3" />
    <rect x="47.5" y="186.61" rx="0" ry="0" width="358.46" height="27.31" />
    <rect x="47.5" y="224.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="136.5" y="224.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="225.5" y="224.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="314.5" y="224.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="47.5" y="298.61" rx="0" ry="0" width="335.08" height="10.75" />
    <rect x="47.5" y="312.61" rx="0" ry="0" width="288.33" height="9.3" />
  </ContentLoader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader,
  },
}
</script>
