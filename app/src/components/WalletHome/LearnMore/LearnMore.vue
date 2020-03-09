<template>
  <v-stepper v-model="e1" class="learn-more">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-img :src="require(`../../../../public/images/learn-more-intro.svg`)">
          <v-layout>
            <v-flex xs12 class="mt-12 ml-12">
              <div class="display-1 primary--text text--darken-4 font-weight-bold mb-2">{{ t('walletHome.welcome') }}</div>
              <img width="150" :src="require(`../../../../public/images/torus-logo-blue.svg`)" />
            </v-flex>
          </v-layout>
        </v-img>
        <v-btn id="get-started-btn" depressed large color="white" class="primary--text px-12 next-btn" @click="e1 = 2">Next</v-btn>
      </v-stepper-content>
      <v-stepper-content v-for="content in contents" :key="content.title" :step="content.step">
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
        <v-btn id="next-step-btn" depressed large class="primary px-12 next-btn" @click="nextStep(content.step)">
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
          title: this.t('walletHome.gettingStarted'),
          subtitle: this.t('walletHome.gettingStartedDesc'),
          step: 2,
          list: [
            {
              icon: 't.svg',
              name: `${this.t('walletHome.whatIs')} Torus?`,
              content: this.t('walletHome.whatIsDesc')
            },
            {
              icon: 'wallet.svg',
              name: this.t('walletHome.knowYourWallet'),
              content: this.t('walletHome.knowYourWalletDesc')
            },
            {
              icon: 'money.svg',
              name: this.t('walletHome.getDigital'),
              content: this.t('walletHome.getDigitalDesc')
            }
          ]
        },
        {
          title: this.t('walletHome.privacySecurity'),
          subtitle: this.t('walletHome.privacySecurityDesc'),
          step: 3,
          list: [
            {
              icon: 'key-large.svg',
              name: this.t('walletHome.privateKey'),
              content: this.t('walletHome.privateKeyDesc')
            },
            {
              icon: 'password.svg',
              name: this.t('walletHome.accountRecovery'),
              content: this.t('walletHome.accountRecoveryDesc')
            }
          ]
        }
      ]
    }
  },
  methods: {
    nextStep(step) {
      if (step < 3) {
        this.e1 += 1
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
