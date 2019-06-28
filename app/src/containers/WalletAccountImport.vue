<template>
  <v-flex xs12 sm8 mb-3>
    <div class="d-flex has-border">
      <v-layout align-center>
        <v-flex xs12 sm6 align-self-center>
          Select Import Type
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            single-line
            solo
            flat
            :items="options"
            item-text="name"
            item-value="value"
            v-model="selectedType"
            label="Select Import Type"
          ></v-select>
        </v-flex>
      </v-layout>
    </div>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          name: 'Private Key',
          value: 'private'
        },
        {
          name: 'Keystore',
          value: 'keystore'
        }
      ],
      privateKey: '',
      keyStoreFileContents: '',
      selectedType: 'private',
      error: {}
    }
  },
  methods: {
    importViaPrivateKey() {
      this.$store
        .dispatch('importAccount', { keyData: this.privateKey, strategy: 'Private Key' })
        .then(() => {
          this.$router.push({ name: 'walletDefault' })
        })
        .catch(err => {
          this.error = err
        })
    },
    importViaKeyStoreFile() {
      const password = document.getElementById('passwordField').value // use refs preferably
      this.$store
        .dispatch('importAccount', { keyData: [this.keyStoreFileContents, password], strategy: 'JSON File' })
        .then(() => {
          this.$router.push({ name: 'walletDefault' })
        })
        .catch(err => {
          this.error = err
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.has-border {
  border-radius: 5px;
  padding: 0 15px;
  margin: 15px;
}

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}
</style>
