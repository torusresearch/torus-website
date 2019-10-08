<template>
  <v-card class="card-shadow">
    <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
      <v-layout>
        <v-flex class="text_1--text pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="body-1 font-weight-bold">{{ title }}</div>
          <slot name="subtitle">
            <div :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">{{ subtitle }}</div>
          </slot>
          <div>
            <v-btn color="primary" depressed class="px-12 py-1 mt-2 white--text" :href="detailsLink" target="_blank">
              More Details
            </v-btn>
          </div>
        </v-flex>
        <slot name="image">
          <v-flex xs4 pt-4 class="text-right hidden-xs-only">
            <img :src="require(`../../../../public/images/${imagePath}`)" style="height: 90px" />
          </v-flex>
        </slot>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['title', 'subtitle', 'imagePath', 'detailsLink']
}
</script>
