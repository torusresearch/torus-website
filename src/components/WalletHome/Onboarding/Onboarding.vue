<template>
  <v-card class="onboarding">
    <v-carousel v-model="carouselCount" :show-arrows="false" hide-delimiters height="500" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item>
        <v-row class="d-flex flex-column fill-height py-10 px-8">
          <v-col class="flex-grow-0">
            <div class="display-2 text-text_1">{{ $t('walletHome.gettingStarted') }}</div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obSetupTitle') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obSetupSubtitle') }}
            </div>
          </v-col>
          <v-col class="flex-grow-1">
            <v-row class="fill-height pt-6 pb-2 mx-n4">
              <v-col cols="6" class="px-4">
                <v-card class="elevation-1 fill-height px-3" :theme="isDarkMode ? 'dark' : 'light'" @click="carouselCount = 1">
                  <div class="d-flex flex-column text-center fill-height justify-center">
                    <img src="../../../assets/images/onboarding-1-1.svg" :alt="t('walletHome.obSetupYes')" />
                    <div class="text-text_2 body-2 font-weight-bold mt-6">
                      <span>{{ $t('walletHome.obSetupYes') }}</span>
                    </div>
                    <div class="text-text_2 caption mt-3">({{ $t('walletHome.obSetupEg') }})</div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" class="px-4">
                <v-card class="elevation-1 fill-height px-3" :theme="isDarkMode ? 'dark' : 'light'" @click="carouselCount = 2">
                  <div class="d-flex flex-column text-center fill-height justify-center">
                    <img src="../../../assets/images/onboarding-1-2.svg" :alt="t('walletHome.obSetupNo')" />
                    <div class="text-text_2 body-2 font-weight-bold mt-6">
                      <span>{{ $t('walletHome.obSetupNo') }}</span>
                    </div>
                    <div class="text-text_2 caption mt-3">({{ $t('walletHome.obSetupEg') }})</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-carousel-item>
      <!-- YES FLOW -->
      <v-carousel-item>
        <v-row class="d-flex flex-column fill-height py-10 px-8">
          <v-col class="flex-grow-1">
            <div class="display-2 text-text_1">{{ $t('walletHome.gettingStarted') }}</div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obYesTitle1') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obYesSubtitle1') }}
            </div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obYesTitle2') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obYesSubtitle2') }}
            </div>
          </v-col>
          <v-col class="flex-grow-0 mt-auto">
            <v-row wrap class="mx-n1">
              <v-col cols="6" class="px-1">
                <img class="onboarding-image" src="../../../assets/images/onboarding-2.svg" alt="Onboarding Features" />
              </v-col>
              <v-col cols="6" class="align-self-end px-1">
                <v-row mx-n1>
                  <v-col cols="12" class="text-right px-1">
                    <v-btn size="large" color="torusBrand1" class="return-btn torus-btn1" @click="closeDialog">
                      {{ $t('walletHome.obYesOk') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-carousel-item>
      <!-- NO FLOW -->
      <v-carousel-item>
        <v-row class="d-flex flex-column fill-height py-10 px-8">
          <v-col class="flex-grow-1">
            <div class="display-2 text-text_1">{{ $t('walletHome.gettingStarted') }}</div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obNoTitle1') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obNoSubtitle1') }}
              <span class="font-weight-bold">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</span>
            </div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obNoTitle2') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obNoSubtitle2') }}
            </div>
          </v-col>
          <v-col class="flex-grow-0 mt-auto">
            <v-row class="mx-n1">
              <v-col cols="6" class="px-1">
                <img class="onboarding-image" src="../../../assets/images/onboarding-2.svg" alt="Onboarding Getting Started" />
              </v-col>
              <v-col cols="6" px-1 class="align-self-end">
                <v-row wrap class="mx-n1">
                  <v-col cols="12" sm="6" class="px-1">
                    <v-btn block variant="text" size="large" class="text-text_3" @click="closeDialog">{{ $t('walletHome.obNoSkip') }}</v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" class="px-1">
                    <v-btn
                      block
                      size="large"
                      :class="{ isLight: !isDarkMode }"
                      class="torus-btn1 next-btn text-torusBrand1"
                      @click="carouselCount += 1"
                    >
                      {{ $t('walletHome.obNoNext') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-carousel-item>
      <v-carousel-item>
        <v-row class="d-flex flex-column fill-height py-10 px-8">
          <v-col class="flex-grow-1">
            <div class="display-2 text-text_1">{{ $t('walletHome.privacySecurity') }}</div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obNo2Title1') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obNo2Subtitle1') }}
            </div>
            <div class="title text-text_1 mt-6">{{ $t('walletHome.obNo2Title2') }}</div>
            <div class="body-2 text-text_2 mt-2">
              {{ $t('walletHome.obNo2Subtitle2') }}
            </div>
          </v-col>
          <v-col class="flex-grow-0 mt-auto">
            <v-row class="mx-n1">
              <v-col cols="6" class="px-1">
                <img class="onboarding-image" src="../../../assets/images/onboarding-3.svg" alt="Onboaring Privacy and Security" />
              </v-col>
              <v-col cols="6" class="align-self-end px-1">
                <v-row class="mx-n1">
                  <v-col cols="12" class="text-right px-1">
                    <v-btn size="large" color="torusBrand1" class="return-btn torus-btn1" @click="closeDialog">
                      {{ $t('walletHome.obNoReturnHome') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
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
