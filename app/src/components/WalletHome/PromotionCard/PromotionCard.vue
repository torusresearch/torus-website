<template>
  <v-card color="dark card-shadow" white>
    <v-card-text class="pt-1 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-4' : 'pb-5'">
      <v-layout align-center>
        <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
          <div class="body-1 font-weight-bold">{{ title }}</div>
          <div :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">{{ subtitle }}</div>
          <slot name="link">
            <div>
              <v-btn color="primary" depressed class="px-12 py-1 mt-4 white--text" :href="linkTarget" target="_blank">{{ linkText }}</v-btn>
            </div>
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
  props: ['title', 'subtitle', 'imagePath', 'linkTarget', 'linkText']
}
</script>
