<template>
  <div class="box-loader">
    <div
      v-for="n in 9"
      v-show="showLoader"
      :key="n"
      class="box-loader_beat"
      :class="[`box-loader_beat-${n % 2 ? 'odd' : 'even'}`, { 'box-loader_beat--hidden': hidden.includes(n) }]"
      :style="spinnerStyle(n)"
    ></div>
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
    margin: {
      type: String,
      default: '2px',
    },
    radius: {
      type: String,
      default: '50%',
    },
    hidden: {
      type: Array,
      default() {
        return [4, 6, 7, 9]
      },
    },
    square: {
      type: Array,
      default() {
        return [1, 2, 5, 8]
      },
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
  mounted() {
    setTimeout(() => {
      this.showLoader = true
    }, this.delay)
  },
  methods: {
    spinnerStyle(n) {
      const delay = Math.random()
      return {
        backgroundColor: this.color || this.$vuetify.theme.currentTheme.torusBrand1,
        height: this.size,
        width: this.size,
        margin: this.margin,
        borderRadius: this.square.includes(n) ? '25%' : '50%',
        animationDelay: `-${delay.toFixed(2)}s`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'BoxLoader.scss';
</style>
