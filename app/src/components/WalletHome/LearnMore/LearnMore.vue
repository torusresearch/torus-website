<template>
  <v-stepper v-model="e1" class="learn-more">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-img :src="require(`../../../../public/images/learn-more-intro.svg`)">
          <v-layout>
            <v-flex xs12 class="mt-12 ml-12">
              <div class="display-1 primary--text text--darken-4 font-weight-bold mb-2">{{ $vuetify.lang.t('$vuetify.walletHome.welcome') }}</div>
              <img width="150" :src="require(`../../../../public/images/torus-logo-blue.svg`)" />
            </v-flex>
          </v-layout>
        </v-img>
        <v-btn id="get-started-btn" @click="e1 = 2" depressed large color="white" class="primary--text px-12 next-btn">Next</v-btn>
      </v-stepper-content>
      <v-stepper-content v-for="content in contents" :step="content.step" :key="content.title">
        <v-layout align-center>
          <v-flex xs8 class="mt-12 ml-12">
            <div class="learn-more-header display-1 font-weight-bold">{{ content.title }}</div>
            <div class="caption text_2--text">{{ content.subtitle }}</div>
          </v-flex>
          <v-flex xs4 class="mt-12 mr-12 text-right">
            <img width="110" :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
        </v-layout>
        <v-list class="mx-12 mt-4">
          <v-list-item v-for="contentItem in content.list" :key="contentItem.name">
            <v-list-item-icon>
              <img :src="require(`../../../../public/img/icons/${contentItem.icon}`)" width="35" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class=".subtitle-1 font-weight-bold">{{ contentItem.name }}</v-list-item-title>
              <div class="caption text_2--text">{{ contentItem.content }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn id="next-step-btn" @click="nextStep(content.step)" depressed large class="primary px-12 next-btn">
          {{ content.step > 2 ? 'Done' : 'Next' }}
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      e1: 1,
      contents: [
        {
          title: this.$vuetify.lang.t('$vuetify.walletHome.gettingStarted'),
          subtitle: this.$vuetify.lang.t('$vuetify.walletHome.gettingStartedDesc'),
          step: 2,
          list: [
            {
              icon: 't.svg',
              name: `${this.$vuetify.lang.t('$vuetify.walletHome.whatIs')} Torus?`,
              content: this.$vuetify.lang.t('$vuetify.walletHome.whatIsDesc')
            },
            {
              icon: 'wallet.svg',
              name: this.$vuetify.lang.t('$vuetify.walletHome.knowYourWallet'),
              content: this.$vuetify.lang.t('$vuetify.walletHome.knowYourWalletDesc')
            },
            {
              icon: 'money.svg',
              name: this.$vuetify.lang.t('$vuetify.walletHome.getDigital'),
              content: this.$vuetify.lang.t('$vuetify.walletHome.getDigitalDesc')
            }
          ]
        },
        {
          title: this.$vuetify.lang.t('$vuetify.walletHome.privacySecurity'),
          subtitle: this.$vuetify.lang.t('$vuetify.walletHome.privacySecurityDesc'),
          step: 3,
          list: [
            {
              icon: 'key-large.svg',
              name: this.$vuetify.lang.t('$vuetify.walletHome.privateKey'),
              content: this.$vuetify.lang.t('$vuetify.walletHome.privateKeyDesc')
            },
            {
              icon: 'password.svg',
              name: this.$vuetify.lang.t('$vuetify.walletHome.accountRecovery'),
              content: this.$vuetify.lang.t('$vuetify.walletHome.accountRecoveryDesc')
            }
          ]
        }
      ]
    }
  },
  methods: {
    nextStep(step) {
      if (step < 3) {
        this.e1++
      } else {
        this.$emit('onClose')
        this.e1 = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'LearnMore.scss';
</style>
