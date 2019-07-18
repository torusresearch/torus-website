<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text py-4">
      <v-layout wrap row>
        <v-flex xs12 px-3>
          <div class="font-weight-bold headline">Private Key</div>
        </v-flex>
        <v-flex xs12 mt-3 px-3>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <img :src="require('../../public/img/icons/file-text-grey.svg')" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="subtitle-1 d-flex font-weight-bold">Download soft copy (JSON)</div>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn icon>
                  <img :src="require('../../public/img/icons/download-primary.svg')" />
                </v-btn>
              </v-list-item-icon>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <img :src="require(`../../public/img/icons/key.svg`)" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="subtitle-1 d-flex font-weight-bold">Show Private Key</div>
                <v-expand-transition>
                  <v-layout row align-center justify-space-between v-if="isShowPrivateKey" class="mt-2">
                    <v-flex>
                      <div style="word-break: break-all">601zbb5dde2e1c677b6c06a3d44bf22bdd6a2799712caf55957874c4336e1234</div>
                    </v-flex>
                    <v-flex>
                      <v-btn text class="primary--text">
                        <img :src="require('../../public/img/icons/copy-primary.svg')" class="mr-1" width="20" />
                        Click to copy
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-expand-transition>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn icon @click="isShowPrivateKey = !isShowPrivateKey">
                  <img :src="require(`../../public/img/icons/eye${isShowPrivateKey ? '-off' : ''}-primary.svg`)" />
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
      <v-layout mt-3 pr-3 row>
        <v-spacer></v-spacer>
        <v-btn large text @click="onClose">Close</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isShowPrivateKey: false
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>
