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
      const password = document.getElementById('passwordField').value
      this.$store.dispatch('importAccount', { keyData: [this.keyStoreFileContents, password], strategy: 'JSON File' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
