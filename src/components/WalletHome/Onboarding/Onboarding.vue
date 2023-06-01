<template>
  <v-card class="onboarding">
    <v-carousel v-model="carouselCount" :show-arrows="false" hide-delimiters height="500" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-0">
            <div class="display-2 text_1--text">{{ t('walletHome.gettingStarted') }}</div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obSetupTitle') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obSetupSubtitle') }}
            </div>
          </v-flex>
          <v-flex class="flex-grow-1">
            <v-layout fill-height pt-6 pb-2 mx-n4>
              <v-flex xs6 px-4>
                <v-card class="elevation-1 fill-height px-3" :dark="$vuetify.theme.isDark" :light="!$vuetify.theme.isDark" @click="carouselCount = 1">
                  <div class="d-flex flex-column text-center fill-height justify-center">
                    <img src="../../../assets/images/onboarding-1-1.svg" :alt="t('walletHome.obSetupYes')" />
                    <div class="text_2--text body-2 font-weight-bold mt-6">
                      <span>{{ t('walletHome.obSetupYes') }}</span>
                    </div>
                    <div class="text_2--text caption mt-3">({{ t('walletHome.obSetupEg') }})</div>
                  </div>
                </v-card>
              </v-flex>
              <v-flex xs6 px-4>
                <v-card class="elevation-1 fill-height px-3" :dark="$vuetify.theme.isDark" :light="!$vuetify.theme.isDark" @click="carouselCount = 2">
                  <div class="d-flex flex-column text-center fill-height justify-center">
                    <img src="../../../assets/images/onboarding-1-2.svg" :alt="t('walletHome.obSetupNo')" />
                    <div class="text_2--text body-2 font-weight-bold mt-6">
                      <span>{{ t('walletHome.obSetupNo') }}</span>
                    </div>
                    <div class="text_2--text caption mt-3">({{ t('walletHome.obSetupEg') }})</div>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-carousel-item>
      <!-- YES FLOW -->
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-1">
            <div class="display-2 text_1--text">{{ t('walletHome.gettingStarted') }}</div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obYesTitle1') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obYesSubtitle1') }}
            </div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obYesTitle2') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obYesSubtitle2') }}
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout wrap mx-n1>
              <v-flex xs6 px-1>
                <img class="onboarding-image" src="../../../assets/images/onboarding-2.svg" alt="Onboarding Features" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout mx-n1>
                  <v-flex xs12 px-1 class="text-right">
                    <v-btn large color="torusBrand1" class="return-btn torus-btn1" @click="closeDialog">
                      {{ t('walletHome.obYesOk') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-carousel-item>
      <!-- NO FLOW -->
      <v-carousel-item>
        <v-layout class="d-flex flex-column fill-height py-10 px-8">
          <v-flex class="flex-grow-1">
            <div class="display-2 text_1--text">{{ t('walletHome.gettingStarted') }}</div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obNoTitle1') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obNoSubtitle1') }}
              <span class="font-weight-bold">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</span>
            </div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obNoTitle2') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obNoSubtitle2') }}
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout mx-n1>
              <v-flex xs6 px-1>
                <img class="onboarding-image" src="../../../assets/images/onboarding-2.svg" alt="Onboarding Getting Started" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout wrap mx-n1>
                  <v-flex xs12 sm6 px-1>
                    <v-btn block text large class="text_3--text" @click="closeDialog">{{ t('walletHome.obNoSkip') }}</v-btn>
                  </v-flex>
                  <v-flex xs12 sm6 px-1>
                    <v-btn
                      block
                      large
                      :class="{ isLight: !$vuetify.theme.dark }"
                      class="torus-btn1 next-btn torusBrand1--text"
                      @click="carouselCount += 1"
                    >
                      {{ t('walletHome.obNoNext') }}
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
            <div class="display-2 text_1--text">{{ t('walletHome.privacySecurity') }}</div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obNo2Title1') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obNo2Subtitle1') }}
            </div>
            <div class="title text_1--text mt-6">{{ t('walletHome.obNo2Title2') }}</div>
            <div class="body-2 text_2--text mt-2">
              {{ t('walletHome.obNo2Subtitle2') }}
            </div>
          </v-flex>
          <v-flex class="flex-grow-0" mt-auto>
            <v-layout mx-n1>
              <v-flex xs6 px-1>
                <img class="onboarding-image" src="../../../assets/images/onboarding-3.svg" alt="Onboaring Privacy and Security" />
              </v-flex>
              <v-flex xs6 px-1 class="align-self-end">
                <v-layout mx-n1>
                  <v-flex xs12 px-1 class="text-right">
                    <v-btn large color="torusBrand1" class="return-btn torus-btn1" @click="closeDialog">
                      {{ t('walletHome.obNoReturnHome') }}
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
