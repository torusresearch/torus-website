<template>
  <v-card class="badges-alert-container">
    <v-btn class="close-btn" icon @click="onCancel">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="elevation-1 text-center" mb-6 py-3 xs12>
        <img :src="require(`../../../assets/images/${badge.image}-done.svg`)" width="152" />
      </v-flex>

      <v-flex xs12 mx-10 class="text-center">
        <div class="mb-2 font-weight-bold text_2--text display-1">{{ badge.header }}</div>
        <div class="mb-5 text_2--text details">
          <div>{{ badge.details1 }}</div>
          <div>{{ badge.details2 }}</div>
        </div>

        <v-btn :color="$vuetify.theme.isDark ? '' : 'torusBrand4'" large class="torusBrand1--text mb-10 px-12" @click="onReturnHome">
          {{ t('walletHome.returnHome') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    badge: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    onCancel() {
      this.$emit('closeBadge', {
        type: this.badge.type,
        returnHome: false,
      })
    },
    onReturnHome() {
      this.$emit('closeBadge', {
        type: this.badge.type,
        returnHome: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'BadgesAlert.scss';
</style>
