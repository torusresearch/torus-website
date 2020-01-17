<template>
  <v-card class="card-shadow">
    <v-card-text class="pt-0 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2' : $vuetify.breakpoint.xsOnly ? 'pb-6' : 'pb-3'">
      <v-layout>
        <v-flex class="text_1--text pt-6" :class="$vuetify.breakpoint.xsOnly ? 'text-center xs12' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="body-1 font-weight-bold" :class="subtitle ? 'text-clamp-one' : 'text-clamp-two'">{{ title }}</div>
          <slot name="subtitle">
            <div class="text-clamp-one" :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">{{ subtitle }}</div>
            <div class="more-details-container">
              <v-btn
                color="primary"
                depressed
                class="py-1 mt-4 white--text"
                :class="$vuetify.breakpoint.smAndDown ? 'px-8' : 'px-12'"
                :href="detailsLink"
                target="_blank"
              >
                {{ detailsText }}
              </v-btn>
            </div>
          </slot>
        </v-flex>
        <slot name="image">
          <v-flex xs4 pt-4 class="text-right hidden-xs-only">
            <img :src="imagePath" :style="$vuetify.breakpoint.smAndDown ? 'width: 100%' : 'width: 100px'" :alt="`${title} Image`" />
          </v-flex>
        </slot>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['title', 'subtitle', 'imagePath', 'detailsLink', 'detailsText']
}
</script>

<style lang="scss" scoped>
@import 'PromotionCard.scss';
</style>
