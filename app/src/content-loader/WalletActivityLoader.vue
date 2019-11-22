<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="27.59" y="33.61" rx="5" ry="5" width="87.98" height="9.02" />
    <rect x="1.06" y="0.61" rx="0" ry="0" width="399.77" height="21.2" />
    <rect x="28.15" y="64.81" rx="0" ry="0" width="341.03" height="16.02" />
    <rect x="27.59" y="47.61" rx="5" ry="5" width="344.34" height="9.98" />
    <rect x="283.59" y="32.61" rx="5" ry="5" width="87.98" height="9.02" />
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
