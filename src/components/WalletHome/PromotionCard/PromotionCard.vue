<template>
  <v-card class="elevation-1 promotion-card" :class="{ isMobile: $vuetify.display.xs }">
    <v-row class="d-flex flex-column fill-height py-4 px-6">
      <v-col class="flex-grow-1 d-flex">
        <div class="promotion-text pr-3">
          <div class="text-body-1 font-weight-bold text-text_1 text-clamp-two">{{ title }}</div>
          <div class="caption text-text_1" :title="subtitle">
            {{ subtitle }}
            <a class="text-decoration-none text-torusBrand1 font-weight-bold" :href="detailsLink" target="_blank" rel="noreferrer noopener">
              {{ detailsText }}
            </a>
          </div>
        </div>
        <slot name="image">
          <div class="ml-auto mt-1">
            <v-img
              :src="`${isDarkMode && imageDarkPath ? imageDarkPath : imagePath}`"
              class="mr-1"
              contain
              position="right center"
              max-width="170"
              :style="$vuetify.display.smAndDown ? 'height: 42px' : 'height: 50px'"
              :alt="`${title}`"
            />
          </div>
        </slot>
      </v-col>
      <!-- <v-col class="flex-grow-0">
        <v-row wrap class="mx-n3 more-details-container">
          <v-col v-if="!!detailsLinkTwo" xs12 sm6 px-3 :class="$vuetify.display.xs ? 'mb-2' : ''">
            <ShowToolTip :address="detailsLinkTwo">
              <div :class="{ 'theme--dark': $vuetify.theme.isDark }" class="d-flex align-center gmt-share-referral copy-link elevation-3 px-4 py-1">
                <div class="torusFont2--text flex-grow-1 text-clamp-one">{{ detailsLinkTwo }}</div>
                <v-icon class="ml-auto flex-grow-0 torusFont2--text" x-small :style="{ width: '20px' }">copy</v-icon>
              </div>
            </ShowToolTip>
          </v-col>
          <v-col xs12 sm6 px-3>
            <v-btn
              depressed
              large
              block
              class="torus-btn1 text-torusBrand1 gmt-billboard-cta"
              :class="$store.state.whiteLabel.isActive ? 'torus-btn1--whitelabel' : ''"
              :href="detailsLink"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ detailsText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col> -->
    </v-row>
  </v-card>
</template>

<script>
// import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  // components: { ShowToolTip },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    imageDarkPath: { type: String, default: '' },
    detailsLink: { type: String, default: '' },
    detailsLinkTwo: { type: String, default: '' },
    detailsText: { type: String, default: '' },
  },
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PromotionCard.scss';
</style>
