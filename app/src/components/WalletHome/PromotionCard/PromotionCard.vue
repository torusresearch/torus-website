<template>
  <v-card class="elevation-1 promotion-card" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
    <v-layout class="d-flex flex-column fill-height py-4 px-6">
      <v-flex class="flex-grow-1 d-flex">
        <div class="promotion-text pr-3">
          <div class="text-body-1 font-weight-bold text_1--text" :class="subtitle ? 'text-clamp-one' : 'text-clamp-two'">{{ title }}</div>
          <div class="caption text_1--text" :title="subtitle">
            {{ subtitle }}
          </div>
        </div>
        <slot name="image">
          <div class="ml-auto mt-1">
            <img
              :src="$vuetify.theme.isDark && imageDarkPath ? imageDarkPath : imagePath"
              :style="$vuetify.breakpoint.smAndDown ? 'height: 42px' : 'height: 50px'"
              :alt="`${title} Image`"
            />
          </div>
        </slot>
      </v-flex>
      <v-flex class="flex-grow-0">
        <v-layout wrap class="mx-n3 more-details-container">
          <v-flex v-if="!!detailsLinkTwo" xs12 sm6 px-3 :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : ''">
            <ShowToolTip :address="detailsLinkTwo">
              <div :class="{ 'theme--dark': $vuetify.theme.isDark }" class="d-flex align-center gmt-share-referral copy-link elevation-3 px-4 py-1">
                <div class="torusFont2--text flex-grow-1 text-clamp-one">{{ detailsLinkTwo }}</div>
                <v-icon class="ml-auto flex-grow-0 torusFont2--text" x-small :style="{ width: '20px' }">$vuetify.icons.copy</v-icon>
              </div>
            </ShowToolTip>
          </v-flex>
          <v-flex xs12 sm6 px-3>
            <v-btn
              depressed
              large
              block
              class="torus-btn1 torusBrand1--text gmt-billboard-cta"
              :class="$store.state.whiteLabel.isActive ? 'torus-btn1--whitelabel' : ''"
              :href="detailsLink"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ detailsText }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { ShowToolTip },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    imageDarkPath: { type: String, default: '' },
    detailsLink: { type: String, default: '' },
    detailsLinkTwo: { type: String, default: '' },
    detailsText: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import 'PromotionCard.scss';
</style>
