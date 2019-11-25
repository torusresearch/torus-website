<template>
  <content-loader :height="160" :width="400" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="27.59" y="33.61" rx="5" ry="5" width="87.98" height="12.67" />
    <rect x="1.06" y="0.61" rx="0" ry="0" width="399.77" height="21.2" />
    <rect x="47.59" y="52.61" rx="5" ry="5" width="145.68" height="12.67" />
    <circle cx="34.43" cy="59.41" r="6.8" />
    <rect x="47.59" y="71.61" rx="5" ry="5" width="145.68" height="12.67" />
    <rect x="47.59" y="90.61" rx="5" ry="5" width="145.68" height="12.67" />
    <rect x="47.59" y="108.61" rx="5" ry="5" width="145.68" height="12.67" />
    <rect x="47.59" y="126.61" rx="5" ry="5" width="145.68" height="12.67" />
    <circle cx="34.43" cy="78.41" r="6.8" />
    <circle cx="34.43" cy="97.41" r="6.8" />
    <circle cx="34.43" cy="115.41" r="6.8" />
    <circle cx="34.43" cy="133.41" r="6.8" />
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
