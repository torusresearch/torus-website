<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="27.59" y="33.61" rx="5" ry="5" width="174.06" height="9.02" />
    <rect x="1.06" y="0.61" rx="0" ry="0" width="399.77" height="21.2" />
    <rect x="28.15" y="50.81" rx="0" ry="0" width="174.76" height="86.94" />
    <rect x="212.15" y="74.81" rx="0" ry="0" width="138.64" height="12.41" />
    <rect x="324.63" y="146.81" rx="0" ry="0" width="56.31" height="17.78" />
    <rect x="210.59" y="50.61" rx="5" ry="5" width="171.23" height="8.93" />
    <rect x="212.15" y="101.81" rx="0" ry="0" width="138.64" height="12.41" />
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
