<template>
  <v-card class="card-shadow">
    <v-card-text class="pt-0 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2' : 'pb-3'">
      <v-layout>
        <v-flex class="text_1--text pt-6" :class="$vuetify.breakpoint.xsOnly ? 'xs12' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="body-1 font-weight-bold">{{ title }}</div>
          <slot name="subtitle">
            <div :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">{{ subtitle }}</div>
          </slot>
        </v-flex>
        <slot name="image">
          <v-flex xs4 pt-4 class="text-right hidden-xs-only">
            <img :src="require(`../../../../public/images/${imagePath}`)" style="height: 100px" />
          </v-flex>
        </slot>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['title', 'subtitle', 'imagePath']
}
</script>
