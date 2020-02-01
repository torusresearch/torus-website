<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <input v-model="verifier_id_type" placeholder="'email' or 'phone'" />
      </v-flex>
      <v-flex text-center>
        <input v-model="verifier_id" placeholder="email/phone" />
      </v-flex>
      <v-flex text-center>
        <input v-model="password" placeholder="password" />
      </v-flex>
      <v-flex text-center>
        <button v-on:click="login">Login</button>
      </v-flex>
      <v-flex text-center>
        <button v-on:click="register">Register</button>
      </v-flex>
      <v-flex text-center>
        <input v-model="code" placeholder="code" />
      </v-flex>
      <v-flex text-center>
        <button v-on:click="verify">Verify</button>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Web3 from 'web3'
import { BroadcastChannel } from 'broadcast-channel'
import BeatLoader from 'vue-spinner/src/BeatLoader'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'
import { post } from '../../utils/httpHelpers'
import config from '../../config'

export default {
  name: 'redirect',
  data: function() {
    return {
      state: '',
      verifier_id: 'leonard@tor.us',
      password: 'password',
      extendedPassword: '',
      redirect_uri: '',
      verifier_id_type: 'email',
      code: ''
    }
  },
  methods: {
    verify: function() {
      post('https://verifier.dev.tor.us/verify', {
        verifier_id: this.verifier_id,
        code: this.code
      })
        .then(() => {
          alert('verification successful')
        })
        .catch(err => log.error(err))
    },
    register: function() {
      this.updateExtendedPassword()
      post('https://verifier.dev.tor.us/register', {
        verifier_id: this.verifier_id,
        verifier_id_type: this.verifier_id_type,
        hash: Web3.utils.sha3(this.extendedPassword).replace('0x', '')
      })
        .then(data => {
          alert('ok: ' + JSON.stringify(data))
        })
        .catch(err => log.error(err))
    },
    login: function() {
      this.updateExtendedPassword()
      post('https://verifier.dev.tor.us/authorize', {
        verifier_id: this.verifier_id,
        redirect_uri: this.redirect_uri,
        state: this.state,
        hash: Web3.utils.sha3(this.extendedPassword).replace('0x', '')
      })
        .then(data => {
          let completeRedirectURI = new URL(data.redirect_uri)
          completeRedirectURI.searchParams.set('state', data.state)
          completeRedirectURI.hash = `idtoken=${data.idtoken}&timestamp=${data.timestamp}\
          &verifier_id=${data.verifier_id}&extendedPassword=${this.extendedPassword}`
          window.location.href = completeRedirectURI.toString()
        })
        .catch(err => {
          log.error(err)
        })
    },
    updateExtendedPassword: function() {
      this.extendedPassword = Web3.utils.sha3(this.password).replace('0x', '')
    }
  },
  async mounted() {
    const queryParams = this.$router.currentRoute.query
    this.state = queryParams.state
    this.redirect_uri = queryParams.redirect_uri
    var self = this
    setInterval(function() {
      console.log(self.state)
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
@import 'TorusLogin.scss';
</style>
