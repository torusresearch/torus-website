<template>
  <div v-show="showLoader">
    <div v-if="forceSpinner || (whiteLabel.isActive && !whiteLabelLogo)" class="spinner" :class="spinnerClass" :style="spinnerStyle">
      <div class="head" :style="headStyle" />
      <div class="mask" :style="maskStyle" />
    </div>
    <div v-else class="ping-container">
      <div class="ping-animate" :style="{ backgroundColor: primaryColor }"></div>
      <div class="ping-content">
        <img v-if="whiteLabelLogo" class="custom-logo" :src="whiteLabelLogo" alt="Dapp Logo" />
        <img v-else :src="require(`@/assets/images/web3auth-logo.svg`)" alt="Web3Auth" />
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
      return this.whiteLabel.logoDark || this.whiteLabel.logoLight || ''
    },
    primaryColor() {
      if (!this.whiteLabel.isActive) return 'var(--v-torusBrand1-base)'
      return this.whiteLabel?.theme?.colors.torusBrand1 || 'var(--v-torusBrand1-base)'
    },
    spinnerClass() {
      if (this.whiteLabel.isActive) {
        return { 'theme--dark': this.whiteLabel.theme?.isDark || false }
      }
      return {}
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
