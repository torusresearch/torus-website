<template>
  <div>
    <v-data-table :headers="headers" :items="transactions" hide-actions hide-default-footer="true">
      <template v-slot:item.from="{ item }">
        <span style="word-break: break-all">{{ item.from }}</span>
      </template>
      <template v-slot:item.to="{ item }">
        <span style="word-break: break-all">{{ item.to }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <span :class="`text-${item.status.toLowerCase()}`">{{ item.status }}</span>
      </template>
    </v-data-table>
    <v-layout row wrap v-if="false">
      <v-flex d-flex offset-xs8 xs4 sm4 offset-sm7 align-self-end v-if="showFooter">
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-flex>
      <v-flex xs12 sm10 offset-sm1>
        <v-data-table
          :headers="headers"
          :items="transactions"
          item-key="id"
          :options.sync="pagination"
          :sort-by.sync="defaultSort"
          :hide-default-footer="!showFooter"
          :search="search"
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
              <td class="text-xs-center">
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
            <v-card flat v-show="props.item.status !== 'rejected' && props.item.etherscanLink !== ''">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs6 class="text-xs-left">
                    <v-btn id="flexibtn" class="btnStyle" outlined large>
                      <a target="_blank" rel="noopener noreferrer" :href="props.item.etherscanLink">View On Etherscan</a>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">Your search for "{{ search }}" found no results.</v-alert>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  // props: ['headers', 'transactions'],
  props: ['transactions'],
  data() {
    return {
      pagination: {},
      defaultSort: 'date',
      search: '',
      expand: false,
      headers: [
        {
          text: 'Transaction',
          value: 'action',
          align: 'left'
        },
        {
          text: 'From',
          value: 'from',
          align: 'left',
          width: '400px'
        },
        {
          text: 'To',
          value: 'to',
          align: 'left',
          width: '400px'
        },
        {
          text: 'Amount',
          value: 'amount',
          align: 'right',
          width: '150px'
        },
        {
          text: 'Date',
          value: 'date',
          align: 'right',
          width: '150px'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'center'
        }
      ]
      // transactions: [
      //   {
      //     action: 'Sending',
      //     date: '10 Jun',
      //     amount: '4TH / 1086.40USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Pending'
      //   },
      //   {
      //     action: 'Received',
      //     date: '10 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Successful'
      //   },
      //   {
      //     action: 'Top-Up',
      //     date: '8 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Denied'
      //   },
      //   {
      //     action: 'Sending',
      //     date: '10 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Pending'
      //   },
      //   {
      //     action: 'Received',
      //     date: '10 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Successful'
      //   },
      //   {
      //     action: 'Top-Up',
      //     date: '10 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Denied'
      //   },
      //   {
      //     action: 'Received',
      //     date: '10 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Successful'
      //   },
      //   {
      //     action: 'Top-Up',
      //     date: '10 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Denied'
      //   },
      //   {
      //     action: 'Sending',
      //     date: '10 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Pending'
      //   },
      //   {
      //     action: 'Received',
      //     date: '10 Jun',
      //     amount: '4TH / 1086.40USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Successful'
      //   },
      //   {
      //     action: 'Sending',
      //     date: '10 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Pending'
      //   },
      //   {
      //     action: 'Received',
      //     date: '10 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Successful'
      //   },
      //   {
      //     action: 'Top-Up',
      //     date: '8 Jun',
      //     amount: '2TH / 543.20 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Denied'
      //   },
      //   {
      //     action: 'Sending',
      //     date: '10 Jun',
      //     amount: '1TH / 271.60 USD',
      //     from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
      //     status: 'Pending'
      //   }
      // ]
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
  },
  created() {
    console.log(this.transactions)
  }
}
</script>

<style lang="scss" scoped>
.text-successful,
.text-confirmed {
  color: #2dcc70;
}

.text-denied {
  color: #e20d0d;
}

.text-pending,
.text-submitted {
  color: #b3c0ce;
}

.text-gray {
  color: #5c6c7f;
}
</style>
