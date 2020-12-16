<template>
  <ContentLoader :height="500" :width="400" :speed="2" torus_brand1-color="#E7EDF3" secondary-color="#ecebeb">
    <rect x="30" y="64" rx="4" ry="4" width="117" height="6.4" />
    <rect x="30" y="48.61" rx="3" ry="3" width="85" height="11.07" />
    <rect x="31.91" y="119.61" rx="3" ry="3" width="142.71" height="5.89" />
    <rect x="31" y="75" rx="4" ry="4" width="117" height="6.4" />
    <rect x="31" y="85.61" rx="3" ry="3" width="85" height="11.07" />
    <rect x="32" y="100.61" rx="3" ry="3" width="26.35" height="13.01" />
    <rect x="60" y="100.61" rx="3" ry="3" width="26.35" height="12.85" />
    <rect x="88" y="100.61" rx="3" ry="3" width="26.35" height="12.8" />
    <rect x="116" y="100.61" rx="3" ry="3" width="26.35" height="12.8" />
    <rect x="217.63" y="18.61" rx="3" ry="3" width="166.6" height="163.28" />
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
