<template> </template>

<script>
export default {
  data() {
    return {
      privateKey: '',
      keyStoreFileContents: ''
    }
  },
  computed: {
    importErrors() {
      return this.$store.state.importErrors
    }
  },
  methods: {
    importViaPrivateKey() {
      this.$store.dispatch('importAccount', { keyData: this.privateKey, strategy: 'Private Key' })
    },
    importViaKeyStoreFile() {
      this.$store.dispatch('importAccount', { keyData: this.keyStoreFileContents, strategy: 'JSON File' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
