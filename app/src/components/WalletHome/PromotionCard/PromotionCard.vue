<template>
  <v-card class="card-shadow">
    <v-card-text class="pt-3 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2' : $vuetify.breakpoint.xsOnly ? 'pb-6' : 'pb-3'">
      <div class="d-flex" :class="{ 'align-center': !$vuetify.breakpoint.xsOnly }">
        <div class="promotion-text pr-3">
          <div class="body-1 font-weight-bold" :class="subtitle ? 'text-clamp-one' : 'text-clamp-two'">{{ title }}</div>
          <div :class="[$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption']" :title="subtitle">
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
      </div>
      <v-layout wrap class="mx-n3 mt-2">
        <v-flex v-if="!!detailsLinkTwo" xs12 sm6 px-3 :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : ''">
          <ShowToolTip :address="detailsLinkTwo">
            <div :class="{ 'theme--dark': $vuetify.theme.isDark }" class="d-flex align-center copy-link px-4 py-1">
              <span class="text_2--text flex-grow-1 text-clamp-one">{{ detailsLinkTwo }}</span>
              <v-icon class="text_2--text ml-auto" x-small right :style="{ width: '20px' }">$vuetify.icons.copy</v-icon>
            </div>
          </ShowToolTip>
        </v-flex>
        <v-flex xs12 sm6 px-3>
          <v-btn
            color="primary"
            depressed
            block
            class="py-1 white--text"
            :class="$vuetify.breakpoint.smAndDown ? 'px-8' : 'px-12'"
            :href="detailsLink"
            target="_blank"
          >
            {{ detailsText }}
          </v-btn>
        </v-flex>
      </v-layout>
      <!-- <v-layout>
        <v-flex class="text_1--text pt-6" :class="$vuetify.breakpoint.xsOnly ? 'text-center xs12' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="title font-weight-bold" :class="subtitle ? 'text-clamp-one' : 'text-clamp-two'">{{ title }}</div>
          <slot name="subtitle">
            <div class="text-clamp-one torus_font1--text caption mt-2">{{ subtitle }}</div>
            <div class="more-details-container">
              <v-btn
                block
                large
                class="elevation-3 torus_brand1--text"
                :class="[$vuetify.theme.isDark ? 'torus_black_2' : 'white', $vuetify.breakpoint.smAndDown ? 'px-8' : 'px-12']"
                :href="detailsLink"
                target="_blank"
              >
                {{ detailsText }}
              </v-btn>
            </div>
          </slot>
        </v-flex>
        <slot name="image">
          <v-flex xs4 pt-4 class="text-right hidden-xs-only align-self-center">
            <img :src="imagePath" :alt="`${title} Image`" />
          </v-flex>
        </slot>
      </v-layout> -->
    </v-card-text>
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
    detailsText: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@import 'PromotionCard.scss';
</style>
