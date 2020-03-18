<template>
  <v-card class="elevation-1 promotion-card">
    <v-card-text class="pt-0 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-0' : $vuetify.breakpoint.xsOnly ? 'pb-6' : 'pb-0'">
      <v-layout>
        <v-flex class="pt-6" :class="$vuetify.breakpoint.xsOnly ? 'text-center xs12' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="title torus_black--text" :class="subtitle ? 'text-clamp-one' : 'text-clamp-two'">{{ title }}</div>
          <slot name="subtitle">
            <div class="text-clamp-one torus_black--text caption mt-2">{{ subtitle }}</div>
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
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    detailsLink: { type: String, default: '' },
    detailsText: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@import 'PromotionCard.scss';
</style>
