<template>
  <v-flex xs12 sm8 mb-3 mt-3>
    <div class="d-flex has-border">
      <v-layout align-center row wrap>
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

    <template v-if="selectedType === 'private'">
      <div class="d-flex has-border">
        <v-layout row wrap>
          <v-flex xs12 sm6 align-self-center>
            Private Key String
          </v-flex>
          <v-flex xs12 sm6>
            <v-textarea single-line solo flat name="private-key" label="Private Key" v-model="privateKey"></v-textarea>
          </v-flex>
        </v-layout>
      </div>

      <div class="has-border text-xs-right" mt-1>
        <v-btn class="btnStyle" @click="importViaPrivateKey">Import</v-btn>
      </div>
    </template>

    <template v-if="selectedType === 'keystore'">
      <div class="d-flex has-border">
        <v-layout row>
          <v-flex xs6 align-self-center>
            Keystore
          </v-flex>
          <v-flex xs6>
            <v-btn @click="$refs.keystoreUpload.click()" class="btnStyle"><v-icon left>cloud_upload</v-icon>Upload</v-btn>
            <input v-show="false" ref="keystoreUpload" type="file" @change="processFile" />
          </v-flex>
        </v-layout>
      </div>

      <div class="d-flex has-border">
        <v-layout row wrap>
          <v-flex xs12 sm6 align-self-center>
            Password
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field single-line solo flat id="passwordField" name="password" type="password"></v-text-field>
          </v-flex>
        </v-layout>
      </div>

      <div class="has-border text-xs-right" mt-1>
        <v-btn class="btnStyle" @click="importViaKeyStoreFile">Import</v-btn>
      </div>
    </template>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      selectedType: '',
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
  margin: 0 15px;
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

.btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 45px;
}
</style>
