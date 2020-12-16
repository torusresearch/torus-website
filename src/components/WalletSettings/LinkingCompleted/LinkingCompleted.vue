<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog :value="linkingDialog" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <v-layout wrap>
            <v-flex text-center class="login-header py-6" xs12 px-6>
              <img
                class="home-link mr-1"
                alt="Link Account"
                height="50"
                :src="require(`../../../assets/images/link-account${isSuccessfull ? '-success' : ''}.svg`)"
              />
              <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="closeDialog">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout wrap pa-6>
            <v-flex v-if="isSuccessfull" xs12 class="mb-8">
              <div class="display-1 text_2--text text-center mb-4">{{ t('tkeySettings.accountSuccessfully') }}</div>
              <div class="body-2 text_2--text text-center">{{ t('tkeySettings.yourGoogleAnd').replace(/{provider}/gi, provider) }}</div>
            </v-flex>
            <v-flex v-else xs12 class="mb-8">
              <div class="display-1 text_2--text text-center mb-4">{{ t('tkeySettings.walletDetected') }}</div>
              <div class="body-2 text_2--text text-center">
                {{ t('tkeySettings.youHaveExisting').replace(/{provider}/gi, provider) }}
              </div>
            </v-flex>
            <v-flex xs12>
              <div v-if="isSuccessfull" class="d-flex info-box py-3 px-4 mb-6 align-center">
                <div class="grow font-weight-bold body-2">
                  <v-icon size="16" class="torusGray1--text mr-2">
                    {{ `$vuetify.icons.reddit` }}
                  </v-icon>
                  {{ provider }} {{ t('tkeySettings.account') }}
                </div>
                <div class="ml-auto text-right">
                  <v-icon small class="d-inline-flex ml-auto success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
                </div>
              </div>
              <div class="text-center mb-6">
                <v-btn large color="torusBrand1" class="white--text" :style="{ width: '254px' }" @click="closeDialog">
                  {{ isSuccessfull ? 'Return Home' : 'Return to Settings' }}
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'LinkingCompleted',
  props: {
    isSuccessfull: {
      type: Boolean,
      dafault: false,
    },
    linkingDialog: {
      type: Boolean,
      dafault: false,
    },
    provider: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LinkingCompleted.scss';
</style>
