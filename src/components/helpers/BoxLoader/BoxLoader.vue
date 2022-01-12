<template>
  <div v-show="showLoader" class="box-loader">
    <div :style="spinnerStyle"></div>
    <div :style="spinnerStyle"></div>
    <div :style="spinnerStyle"></div>
    <div :style="spinnerStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'BoxLoader',
  props: {
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '24px',
    },
    delay: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      showLoader: false,
    }
  },
  computed: {
    spinnerStyle() {
      return {
        borderColor: `${this.color || this.$vuetify.theme.currentTheme.torusBrand1} transparent transparent transparent`,
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.showLoader = true
    }, this.delay)
  },
}
</script>

<style lang="scss" scoped>
@import 'BoxLoader.scss';
</style>
