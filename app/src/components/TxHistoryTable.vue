<template>
  <div>
    <v-data-table :headers="headers" :items="transactions">
      <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.action }}</td>
          <td>
            <span style="word-break: break-all">{{ item.from }}</span>
          </td>
          <td>
            <span style="word-break: break-all">{{ item.to }}</span>
          </td>
          <td class="text-xs-right">{{ item.amount }}</td>
          <td class="text-xs-right">{{ item.date }}</td>
          <td class="text-xs-center">
            <span :class="`text-${item.status.toLowerCase()}`">{{ item.status }}</span>
          </td>
        </tr>
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
  // props: ['transactions'],
  data() {
    return {
      expanded: [],
      expand: false,
      pagination: {},
      defaultSort: 'date',
      search: '',
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
          width: '350px'
        },
        {
          text: 'To',
          value: 'to',
          align: 'left',
          width: '350px'
        },
        {
          text: 'Amount',
          value: 'amount',
          align: 'right',
          width: '200px'
        },
        {
          text: 'Date',
          value: 'date',
          align: 'right',
          width: '80px'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'center'
        }
      ],
      transactions: [
        {
          id: 1,
          action: 'Sending',
          date: '10 Jun',
          amount: '4TH / 1086.40USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending',
          expanded: false
        },
        {
          id: 2,
          action: 'Received',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful',
          expanded: false
        },
        {
          id: 3,
          action: 'Top-Up',
          date: '8 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Denied',
          expanded: false
        },
        {
          id: 4,
          action: 'Sending',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending',
          expanded: false
        },
        {
          id: 5,
          action: 'Received',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful',
          expanded: false
        }
        // },
        // {
        //   id: 6,
        //   action: 'Top-Up',
        //   date: '10 Jun',
        //   amount: '1TH / 271.60 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Denied'
        // },
        // {
        //   id: 7,
        //   action: 'Received',
        //   date: '10 Jun',
        //   amount: '2TH / 543.20 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Successful'
        // },
        // {
        //   id: 8,
        //   action: 'Top-Up',
        //   date: '10 Jun',
        //   amount: '1TH / 271.60 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Denied'
        // },
        // {
        //   id: 9,
        //   action: 'Sending',
        //   date: '10 Jun',
        //   amount: '2TH / 543.20 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Pending'
        // },
        // {
        //   id: 10,
        //   action: 'Received',
        //   date: '10 Jun',
        //   amount: '4TH / 1086.40USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Successful'
        // },
        // {
        //   id: 11,
        //   action: 'Sending',
        //   date: '10 Jun',
        //   amount: '2TH / 543.20 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Pending'
        // },
        // {
        //   id: 12,
        //   action: 'Received',
        //   date: '10 Jun',
        //   amount: '1TH / 271.60 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Successful'
        // },
        // {
        //   id: 13,
        //   action: 'Top-Up',
        //   date: '8 Jun',
        //   amount: '2TH / 543.20 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Denied'
        // },
        // {
        //   id: 14,
        //   action: 'Sending',
        //   date: '10 Jun',
        //   amount: '1TH / 271.60 USD',
        //   from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
        //   status: 'Pending'
        // }
      ]
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
