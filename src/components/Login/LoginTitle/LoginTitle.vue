<template>
  <v-flex class="mb-2 mb-sm-0" :class="isDapp ? '' : 'ml-auto mr-auto xs10 sm8'">
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ t('login.your') }}
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" class="btn-select justify-space-between m-0 p-0" v-on="on">
            <div>
              <img :src="require(`../../../assets/img/icons/icon-${selectedWallet.toLowerCase()}.svg`)" />
              <span class="chain-name">{{ selectedWallet }}</span>
            </div>
            <v-icon class="ma-0 float-right justify-end">$vuetify.icons.select</v-icon>
          </v-btn>
        </template>
        <v-list class="chain-list">
          <v-list-item v-for="(item, index) in availableOn" :key="item" @click="openWallet(item)">
            <v-list-item-title>{{ item }}</v-list-item-title>
            <v-divider v-if="index < availableOn.length - 1" :key="`${index}-divider`" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ t('login.titleNew') }}
    </div>
  </v-flex>
</template>

<script>
export default {
  props: {
    isDapp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      availableOn: ['Ethereum', 'Solana', 'Polygon', 'Binance'],
      selectedWallet: 'Ethereum',
    }
  },
  methods: {
    openWallet(wallet) {
      this.selectedWallet = wallet
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginTitle.scss';
</style>
