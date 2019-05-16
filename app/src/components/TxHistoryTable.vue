<template>
  <v-layout row wrap>
    <v-flex d-flex offset-xs8 xs4 sm4 offset-sm7 align-self-end v-if="showFooter">
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1>
      <v-data-table
        :headers="headers"
        :items="transactions"
        item-key="id"
        :pagination.sync="pagination"
        :hide-actions="!showFooter"
        :search="search"
        expand
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
          <tr @click="props.expanded = !props.expanded" :class="{ activeRow: props.expanded }">
            <td class="text-xs-left">
              <v-layout row wrap>
                <v-flex xs11 align-self-center>
                  {{ props.item.date }}
                </v-flex>
              </v-layout>
            </td>
            <td class="text-xs-center no-wrap">{{ props.item.slicedFrom }}</td>
            <td class="text-xs-center no-wrap">{{ props.item.slicedTo }}</td>
            <td class="text-xs-center no-wrap">{{ props.item.totalAmountString }}</td>
            <td class="text-xs-center no-wrap">{{ props.item.currencyAmountString }}</td>
            <td class="text-xs-center no-wrap">{{ props.item.status }}</td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat v-show="props.item.status !== 'rejected'">
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs6 class="text-xs-center">
                  <v-btn id="flexibtn" class="btnStyle" outline large>
                    <a target="_blank" rel="noopener noreferrer" :href="props.item.etherscanLink">View On Etherscan</a></v-btn
                  >
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
  </v-layout>
</template>

<script>
export default {
  props: ['headers', 'transactions'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      search: '',
      expand: false
    }
  },
  computed: {
    showFooter() {
      return this.transactions && this.transactions.length > 5
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

#flexibtn .btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  border-radius: 45px;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.inline-small {
  width: 25px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
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
