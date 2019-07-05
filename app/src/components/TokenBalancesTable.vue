<template>
  <v-layout row wrap align-center :class="isFreshAccount ? 'mt-4' : 'mt-0'">
    <v-flex :class="tokenCardLayout" v-for="balance in tokenBalances" :key="balance.name">
      <v-card color="dark" white>
        <v-card-title class="font-weight-bold pt-4 pb-0 px-4">
          COINS / TOKENS
        </v-card-title>
        <v-card-text class="headline font-weight-bold pt-1 pb-4 px-4">
          <v-flex xs12>
            <v-text-field hide-details readonly type="text" :value="balance.name">
              <template v-slot:prepend>
                <img
                  :src="require(`../../public/images/logos/${balance.logo}`)"
                  class="inline-small"
                  onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                />
              </template>
              <template v-slot:append>
                {{ balance.formattedBalance }}
              </template>
            </v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message pl-4 pt-1">
                    <span class="left ml-3">{{ balance.currencyRateText }}</span>
                    <span class="right mr-2">{{ balance.currencyBalance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex v-if="isFreshAccount" xs12 pa-3 class="text-xs-right">
      <span class="caption">Last update 24/06/19, 16:24</span>
    </v-flex>
  </v-layout>
  <!-- <v-layout row wrap v-if="false">
    <v-flex d-flex offset-xs8 xs4 sm4 offset-sm7 align-self-end v-if="showFooter">
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1>
      <v-data-table
        :headers="headers"
        :items="tokenBalances"
        item-key="id"
        :pagination.sync="pagination"
        :hide-actions="!showFooter"
        :search="search"
        v-model="selected"
      >
        <template v-slot:headers="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="[
                'column sortable',
                'background-grey',
                pagination.descending ? 'desc' : 'asc',
                header.value === pagination.sortBy ? 'active' : '',
                header.align !== '' ? `text-xs-${header.align}` : ''
              ]"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:items="props">
          <tr @click="selectEmit(props.item)" :active="props.selected" :class="{ activeRow: props.selected }">
            <td class="pr-0">
              <v-flex class="set-min-width">
                <img
                  :src="require(`../../public/images/logos/${props.item.logo}`)"
                  class="inline-small mr-2"
                  onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                />
                {{ props.item.name }}
              </v-flex>
            </td>
            <td class="text-xs-center no-wrap text-bluish">{{ props.item.formattedBalance }}</td>
            <td class="text-xs-right no-wrap">
              <span>{{ props.item.currencyBalance }}</span>
              <span class="ml-2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon :color="$vuetify.theme.torus_icon" size="15" v-on="on">help</v-icon>
                  </template>
                  <span>{{ props.item.currencyRateText }}</span>
                </v-tooltip>
              </span>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card text>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs6 class="text-xs-center">
                  <v-btn class="btnStyle" outlined large @click="initiateTransfer">Transfer</v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                  <v-btn class="btnStyle" outlined large @click="initiateTransfer">Topup</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning"> Your search for "{{ search }}" found no results. </v-alert>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout> -->
</template>

<script>
export default {
  props: ['headers', 'tokenBalances', 'selected', 'isFreshAccount'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      search: ''
    }
  },
  computed: {
    showFooter() {
      return this.tokenBalances.length > 5
    },
    tokenCardLayout() {
      return this.isFreshAccount ? 'xs12' : 'xs6 px-3 my-3'
    }
  },
  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    selectEmit(item) {
      this.$emit('update:select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 598px) {
  .bcg-logo {
    display: none;
  }
}
.background-grey {
  background: var(--v-torus_bcg-base);
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.inline-small {
  width: 20px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}
</style>
