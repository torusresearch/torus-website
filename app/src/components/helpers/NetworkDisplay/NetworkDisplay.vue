<template>
  <v-chip v-if="selectedNetwork !== ''" small class="caption network-chip black--text text-capitalize" :class="`network-chip--${host}`">
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
