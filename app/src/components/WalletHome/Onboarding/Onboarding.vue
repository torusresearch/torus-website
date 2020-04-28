<template>
  <v-card class="onboarding">
    <v-carousel v-model="carouselCount" :show-arrows="false" hide-delimiters height="500" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-1">
            <div class="display-2 text_1--text">Welcome to Torus</div>
            <div class="title text_1--text mt-6">The easiest way to access digital currencies</div>
            <div class="body-2 text_2--text mt-2">
              Torus
              <span class="font-weight-bold">provides mainstream users a seamless gateway to the decentralized ecosystem.</span>
              It is a user-friendly, secure, and non-custodial key management system for decentralized applications (DApps) on blockchain.
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout mx-n1>
              <v-flex xs6 px-1>
                <v-img :src="require(`../../../../public/images/onboarding-1.svg`)" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout mx-n1>
                  <v-flex xs6 px-1>
                    <v-btn block text large class="text_3--text" @click="closeDialog">Skip</v-btn>
                  </v-flex>
                  <v-flex xs6 px-1>
                    <v-btn
                      block
                      large
                      :class="{ isLight: !$vuetify.theme.dark }"
                      class="torus-btn1 next-btn torusBrand1--text"
                      @click="carouselCount += 1"
                    >
                      Next
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-carousel-item>
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-1">
            <div class="display-2 text_1--text">Getting Started</div>
            <div class="title text_1--text mt-6">Know your Wallet Address</div>
            <div class="body-2 text_2--text mt-2">
              A wallet address is similar to a bank account number. It’s a unique combination of letters and numbers that looks like this:
              <span class="font-weight-bold">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</span>
            </div>
            <div class="title text_1--text mt-6">Get Digital Currency and Tokens</div>
            <div class="body-2 text_2--text mt-2">
              You can share your wallet address with others to receive digital currency and tokens.
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout mx-n1>
              <v-flex xs6 px-1>
                <v-img :src="require(`../../../../public/images/onboarding-2.svg`)" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout mx-n1>
                  <v-flex xs6 px-1>
                    <v-btn block text large class="text_3--text" @click="closeDialog">Skip</v-btn>
                  </v-flex>
                  <v-flex xs6 px-1>
                    <v-btn
                      block
                      large
                      :class="{ isLight: !$vuetify.theme.dark }"
                      class="torus-btn1 next-btn torusBrand1--text"
                      @click="carouselCount += 1"
                    >
                      Next
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-carousel-item>
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-1">
            <div class="display-2 text_1--text">Privacy and Security</div>
            <div class="title text_1--text mt-6">Private Key</div>
            <div class="body-2 text_2--text mt-2">
              This is your password to verify account ownership. Only you are able to access it. If you lose this, you potentially lose ownership of
              your account and ALL your money.
            </div>
            <div class="title text_1--text mt-6">Account Recovery</div>
            <div class="body-2 text_2--text mt-2">
              Torus uses Google/Facebook 2 Factor-Authentication for account recovery.
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout mx-n1>
              <v-flex xs6 px-1>
                <v-img :src="require(`../../../../public/images/onboarding-3.svg`)" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout mx-n1>
                  <v-flex v-if="!$vuetify.breakpoint.xsOnly" px-1 xs6></v-flex>
                  <v-flex xs12 sm6 px-1 class="text-right">
                    <v-btn :block="!$vuetify.breakpoint.xsOnly" large color="torusBrand1" class="return-btn torus-btn1" @click="closeDialog">
                      Return Home
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      carouselCount: 0,
    }
  },
  methods: {
    closeDialog() {
      this.carouselCount = 0
      this.$emit('onClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Onboarding.scss';
</style>
