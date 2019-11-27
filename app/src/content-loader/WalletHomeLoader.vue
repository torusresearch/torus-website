<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="27.59" y="33" rx="5" ry="5" width="94.6" height="9.6" />
    <rect x="1.06" y="0.61" rx="0" ry="0" width="399.77" height="21.2" />
    <rect x="318.15" y="32.81" rx="0" ry="0" width="53.12" height="8.8" />
    <rect x="259.15" y="32.81" rx="0" ry="0" width="53.12" height="8.8" />
    <rect x="27.63" y="45.81" rx="0" ry="0" width="343.86" height="38.4" />
    <rect x="27.59" y="97" rx="5" ry="5" width="94.6" height="9.6" />
    <rect x="276.59" y="97" rx="5" ry="5" width="94.6" height="9.6" />
    <rect x="26.63" y="113.81" rx="0" ry="0" width="167.74" height="38.4" />
    <rect x="202.63" y="113.81" rx="0" ry="0" width="167.74" height="38.4" />
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
