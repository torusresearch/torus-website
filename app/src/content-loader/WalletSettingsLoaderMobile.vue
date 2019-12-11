<template>
  <content-loader :height="600" :width="450" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="15.5" y="17.61" rx="0" ry="0" width="46.13" height="28.18" />
    <rect x="15.5" y="62.61" rx="0" ry="0" width="139.18" height="22.12" />
    <circle cx="31.46" cy="125.44" r="19.83" />
    <circle cx="31.46" cy="181.44" r="19.83" />
    <circle cx="31.46" cy="236.44" r="19.83" />
    <circle cx="31.46" cy="296.44" r="19.83" />
    <rect x="63.63" y="106.61" rx="0" ry="0" width="368.59" height="39.38" />
    <rect x="63.63" y="161.61" rx="0" ry="0" width="368.59" height="39.38" />
    <rect x="63.63" y="219.61" rx="0" ry="0" width="368.59" height="39.38" />
    <rect x="63.63" y="277.61" rx="0" ry="0" width="368.59" height="39.38" />
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
