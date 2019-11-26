<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="56.09" y="-55" rx="5" ry="5" width="94.6" height="9.6" />
    <rect x="4.33" y="3.61" rx="0" ry="0" width="394.2" height="23.1" />
    <rect x="280.33" y="9.61" rx="0" ry="0" width="0" height="0" />
    <rect x="42.41" y="42.61" rx="0" ry="0" width="126.14" height="8.1" />
    <rect x="41.41" y="56.61" rx="0" ry="0" width="204.98" height="6" />
    <rect x="41.41" y="68.81" rx="0" ry="0" width="27.59" height="27.9" />
    <rect x="74.41" y="68.81" rx="0" ry="0" width="27.59" height="27.9" />
    <rect x="108.41" y="68.81" rx="0" ry="0" width="27.59" height="27.9" />
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
