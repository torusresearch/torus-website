<template>
  <v-stepper v-model="e1" class="learn-more">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-img :src="require(`../../public/images/learn-more-intro.svg`)">
          <v-layout>
            <v-flex xs12 class="mt-12 ml-12">
              <div class="display-1 primary--text text--darken-4 font-weight-bold mb-2">Welcome to</div>
              <img width="150" :src="require(`../../public/images/torus-logo-blue.svg`)" />
            </v-flex>
          </v-layout>
        </v-img>
        <v-btn @click="e1 = 2" depressed large color="white" class="primary--text px-12 next-btn">Next</v-btn>
      </v-stepper-content>
      <v-stepper-content v-for="content in contents" :step="content.step" :key="content.title">
        <v-layout align-center>
          <v-flex xs8 class="mt-12 ml-12">
            <div class="display-1 font-weight-bold">{{ content.title }}</div>
            <div class="caption torus_text--text text--lighten-3">{{ content.subtitle }}</div>
          </v-flex>
          <v-flex xs4 class="mt-12 mr-12 text-right">
            <img width="110" :src="require(`../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
        </v-layout>
        <v-list class="mx-12 mt-4">
          <v-list-item v-for="contentItem in content.list" :key="contentItem.name">
            <v-list-item-icon>
              <img :src="require(`../../public/img/icons/${contentItem.icon}`)" width="35" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class=".subtitle-1 font-weight-bold">{{ contentItem.name }}</v-list-item-title>
              <div class="caption torus_text--text text--lighten-3">{{ contentItem.content }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn @click="nextStep(content.step)" depressed large class="primary px-12 next-btn">{{ content.step > 2 ? 'Done' : 'Next' }}</v-btn>
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
          title: 'Getting Started',
          subtitle: 'Here are some key terms to guide you along',
          step: 2,
          list: [
            {
              icon: 't.svg',
              name: 'What is Torus?',
              content: 'Torus is a key management solution that aims to provide an easy access to services running on Blockchain.'
            },
            {
              icon: 'wallet.svg',
              name: 'Know your Wallet Address',
              content: `A wallet address is similar to a bank account number. 
                It's a unique combination of letters and numbers that looks like this: 0x09438E46Ea66647EA65E4b104C125c82076FDcE5`
            },
            {
              icon: 'money.svg',
              name: 'Get Digital Currency and Tokens',
              content: 'You can share your wallet address with others to receive digital currency and tokens.'
            }
          ]
        },
        {
          title: 'Privacy and Security',
          subtitle: 'Your Privacy are our top priority',
          step: 3,
          list: [
            {
              icon: 'key_large.svg',
              name: 'Private Key',
              content: `This is your password to verify account ownership. Only you are able to access it.
                If you lose this, you potentially lose ownership of your account and ALL your money.`
            },
            {
              icon: 'password.svg',
              name: 'Account Recovery',
              content: 'Torus uses Google/Facebook 2 Factor-Authentication for account recovery.'
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
.learn-more {
  background-image: url('/images/footer_waves.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100%;
  border-radius: 15px;

  .v-stepper__content {
    padding: 0;
    height: 550px;
    transition: none;
  }

  .next-btn {
    position: absolute;
    bottom: 48px;
    right: 48px;
  }
}
</style>
