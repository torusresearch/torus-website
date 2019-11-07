<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="27.59" y="33" rx="5" ry="5" width="94.6" height="9.6" />
    <rect x="1.06" y="0.61" rx="0" ry="0" width="399.77" height="21.2" />
    <rect x="28.15" y="50.81" rx="0" ry="0" width="174.76" height="12.41" />
    <rect x="28.15" y="70.81" rx="0" ry="0" width="174.76" height="12.41" />
    <rect x="28.15" y="90.81" rx="0" ry="0" width="174.76" height="12.41" />
    <rect x="28.15" y="110.81" rx="0" ry="0" width="86.05" height="12.41" />
    <rect x="117.15" y="110.81" rx="0" ry="0" width="86.05" height="12.41" />
    <rect x="28.15" y="130.81" rx="0" ry="0" width="174.76" height="12.41" />
    <rect x="133.63" y="150.81" rx="0" ry="0" width="70.12" height="12.41" />
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
