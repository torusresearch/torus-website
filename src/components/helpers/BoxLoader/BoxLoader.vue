<template>
  <div v-show="showLoader">
    <div v-if="useSpinner" class="spinner" :class="{ 'v-theme--dark': isDark }" :style="spinnerStyle">
      <div class="head" :style="headStyle" />
      <div class="mask" :style="maskStyle" />
    </div>
    <div v-else class="ping-container" :class="{ 'v-theme--dark': isDark }">
      <div class="ping-animate" :style="pingAnimateStyle"></div>
      <div class="ping-content" :style="pingContentStyle">
        <img :src="whiteLabelLogo" alt="Dapp Logo" :style="pingImageStyle" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoxLoader',
  props: {
    whiteLabel: {
      type: Object,
      default() {
        return {
          isActive: false,
        }
      },
    },
    isCustomVerifier: {
      type: Boolean,
      default: false,
    },
    spinnerBackground: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 60,
    },
    forceSpinner: {
      type: Boolean,
      default: false,
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
        backgroundColor: this.primaryColor,
        background: `conic-gradient(transparent, ${this.primaryColor})`,
        width: `${this.size}px`,
        height: `${this.size}px`,
      }
    },
    headStyle() {
      return {
        backgroundColor: this.primaryColor,
        left: `${Math.ceil(this.size / 2) - 4}px`,
      }
    },
    maskStyle() {
      return { backgroundColor: this.spinnerBackground, width: `${this.size - 10}px`, height: `${this.size - 10}px` }
    },
    whiteLabelLogo() {
      if (!this.whiteLabel.isActive) return ''
      return this.isDark ? this.whiteLabel.logoDark : this.whiteLabel.logoLight
    },
    primaryColor() {
      if (!this.whiteLabel.isActive) return 'rgb(var(--v-theme-torusBrand1))'
      return this.whiteLabel?.theme?.colors?.torusBrand1 || 'rgb(var(--v-theme-torusBrand1))'
    },
    isDark() {
      if (this.whiteLabel.isActive) {
        return this.whiteLabel.theme?.isDark
      }
      return this.$vuetify.theme.name === 'dark'
    },
    useSpinner() {
      return this.forceSpinner || !this.isCustomVerifier || (this.isCustomVerifier && !this.whiteLabelLogo)
    },
    pingContentStyle() {
      const backgroundColor = this.isDark ? '#fff' : this.primaryColor
      return { width: `${this.size}px`, height: `${this.size}px`, backgroundColor }
    },
    pingAnimateStyle() {
      const backgroundColor = this.isDark ? '#fff' : this.primaryColor
      return { backgroundColor }
    },
    pingImageStyle() {
      const computedSize = this.size * 0.56
      return { width: `${computedSize}px`, height: `${computedSize}px` }
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
