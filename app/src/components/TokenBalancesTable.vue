<template>
  <v-layout row wrap>
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
          <!-- "props.expanded = !props.expanded" -->
          <tr @click="select(props.item)" :active="props.selected" :class="{ activeRow: props.selected }">
            <td class="text-xs-left">
              <v-layout row wrap>
                <v-flex xs2>
                  <v-img
                    :src="`images/logos/${props.item.logo}`"
                    class="inline-small"
                    onerror="if (this.src != 'eth.svg') this.src = 'eth.svg';"
                  ></v-img>
                </v-flex>
                <v-flex xs10>
                  {{ props.item.name }}
                </v-flex>
              </v-layout>
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
          <v-card flat>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs6 class="text-xs-center">
                  <v-btn class="btnStyle" outline large @click="initiateTransfer">Transfer</v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                  <v-btn class="btnStyle" outline large @click="initiateTransfer">Topup</v-btn>
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
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex offset-xs1 class="text-xs-left">
          <v-btn class="btnStyle" outline large @click="initiateTransfer">Transfer</v-btn>
          <v-btn class="btnStyle" outline large @click="initiateTransfer">Top-up</v-btn>
        </v-flex>
        <v-flex xs2 align-self-center class="hidden-xs-only">
          <img src="images/torus_logo.png" class="text-xs-right" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['headers', 'tokenBalances'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      search: '',
      selected: []
    }
  },
  computed: {
    showFooter() {
      return this.tokenBalances.length > 5
    }
  },
  methods: {
    select(selectedItem) {
      // this is so that we don't break their api
      this.selected = []
      this.tokenBalances.forEach(item => {
        if (item.id === selectedItem.id) {
          this.selected.push(item)
        }
      })
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    initiateTransfer() {
      console.log('transferring stuff')
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
  width: 25px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}

.btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  border-radius: 45px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

/deep/table.v-table {
  border-collapse: separate !important;
  border-spacing: 0 10px !important;
  margin-top: -10px !important; /* correct offset on first border spacing if desired */
  background: var(--v-torus_bcg-base) !important;
}

/deep/.activeRow {
  background: #bdbdbd !important;
}

/deep/tr {
  background: white;
}

/deep/td {
  border: solid 0px #fff;
  border-style: solid none;
  padding: 10px;
  cursor: pointer;
}

/deep/td:first-child {
  border-left-style: solid;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
}

/deep/td:last-child {
  border-right-style: solid;
  border-bottom-right-radius: 25px;
  border-top-right-radius: 25px;
}
</style>
