<template>
  <v-container fill-height>
    <template v-if="type === 'none'">
      <page-loader />
    </template>
    <template v-else>
      <v-card flat :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-card-text>
          <v-layout wrap align-start justify-center>
            <v-flex xs12 mt-4 sm7>
              <div class="headline mb-12">Confirm Provider Change</div>
              <p class="mb-4 subheading">
                From:
                <span class="text-bluish">{{ origin }}</span>
              </p>
              <div v-if="type && type === 'rpc'">
                <p>{{ origin }} wants to change provider to the following</p>
                <br />
                <div v-show="rpcNetwork.networkName !== ''">Name: {{ rpcNetwork.networkName }}</div>
                <br />
                <div>URL: {{ rpcNetwork.networkUrl }}</div>
                <br />
                <div v-show="rpcNetwork.chainId !== ''">ChainId: {{ rpcNetwork.chainId }}</div>
              </div>
              <div v-else>{{ origin }} wants to change provider to {{ network }}</div>
            </v-flex>
            <v-flex xs12 sm5 class="bcg">
              <img src="images/signature.png" />
            </v-flex>
          </v-layout>
          <div class="hide-xs mt-12">
            <v-layout wrap align-center justify-center>
              <v-flex xs12 sm4 class="text-center">
                <v-btn class="btnStyle" :color="$vuetify.theme.torus_reject" large light flat @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs12 sm4 class="text-center">
                <v-btn large light :color="$vuetify.theme.torus_accept" class="btnStyle white--text rounded-btn" @click="triggerSign">Approve</v-btn>
              </v-flex>
              <v-flex sm4 class="text-center" pt-1>
                <img src="images/torus_logo.png" class="bcg-logo" />
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="higherZ hidden-sm-and-up" flat :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout wrap align-center>
            <v-flex xs6 sm4>
              <v-btn class="btnStyle" large light :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
            </v-flex>
            <v-flex xs6 sm4>
              <v-btn large light :color="$vuetify.theme.torus_accept" class="white--text btnStyle rounded-btn" @click="triggerSign">Approve</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import BroadcastChannel from 'broadcast-channel'
import PageLoader from '../components/PageLoader.vue'

export default {
  name: 'confirm',
  components: {
    PageLoader
  },
  data() {
    return {
      origin: '',
      type: 'none',
      network: '',
      rpcNetwork: {},
      payload: {}
    }
  },
  computed: {},
  methods: {
    triggerSign(event) {
      var bc = new BroadcastChannel('torus_provider_change_channel')
      bc.postMessage({
        data: { type: 'confirm-provider-change', payload: this.payload, approve: true }
      })
      bc.close()
      window.close()
    },
    triggerDeny(event) {
      var bc = new BroadcastChannel('torus_provider_change_channel')
      bc.postMessage({ data: { type: 'deny-provider-change', approve: false } })
      bc.close()
      window.close()
    }
  },
  mounted() {
    var bc = new BroadcastChannel('torus_provider_change_channel')
    bc.onmessage = async ev => {
      const {
        payload: { network, type },
        origin
      } = ev.data || {}
      this.payload = { network, type }
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        console.log(err)
      }
      this.origin = url.hostname // origin of tx: website url
      if (type && type === 'rpc') {
        this.rpcNetwork = network
        this.type = type
      } else {
        this.network = network
        this.type = 'non-rpc'
      }
      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
/* Portrait phones and smaller */
@media (max-width: 598px) {
  .bcg-logo {
    display: none;
  }

  .bcg {
    display: none;
  }

  .hide-xs {
    display: none;
  }
}

.higherZ {
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.bcg {
  position: relative;
}

.bcg-logo {
  height: 32px;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 0% 35% 0% 15px;
  padding: 0;
}

.application--wrap {
  min-height: 0px !important;
}

.btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  border-radius: 45px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}
</style>
