<template>
  <v-chip
    v-if="selectedNetwork !== ''"
    small
    class="caption network-chip black--text"
    :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''"
  >
    <v-icon size="12" class="black--text" v-text="'$vuetify.icons.network'"></v-icon>
    {{ selectedNetwork }}
  </v-chip>
</template>

<script>
export default {
  props: ['network'],
  computed: {
    selectedNetwork() {
      let finalNetwork = ''
      finalNetwork =
        !this.$store.state.networkType.networkName || this.$store.state.networkType.networkName === ''
          ? this.$store.state.networkType.host
          : this.$store.state.networkType.networkName
      return finalNetwork
    },
    host() {
      return this.$store.state.networkType.host
    },
    isUrlNetwork() {
      try {
        new URL(this.selectedNetwork)
        return true
      } catch (err) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
