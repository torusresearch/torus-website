<script>
export default {
  name: 'walletAcivity',
  props: ['address'],
  data() {
    return {
      search: '',
      pagination: {},
      selected: [],
      headers: [
        {
          text: 'Transaction',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'From',
          value: 'from'
        },
        {
          text: 'To',
          value: 'to'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Date',
          value: 'date'
        },
        {
          text: 'Status',
          value: 'status'
        }
      ],
      transactions: [
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '4TH / 1086.40USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '8 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Denied'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Denied'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Denied'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '4TH / 1086.40USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '8 Jun',
          amount: '2TH / 543.20 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Denied'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '1TH / 271.60 USD',
          from: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008',
          status: 'Pending'
        }
      ]
    }
  },
  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  }
}
</script>
<template>
  <v-layout mt-12 wrap align-start align-content-start justify-center class="wallet-transactions-activity">
    <v-flex xs12>
      <v-container class="mb-1 p-0">
        <span class="headline font-weight-bold">Transaction Activities</span>
      </v-container>
      <v-container class="d-flex alignt-items-center filters-container py-0 mb-4">
        <v-flex xs12 md2 d-flex class="mr-2">
          <!-- <v-select :items="items" label="All Transactions"></v-select> -->
          <div class="select-container">
            <select>
              <option value>All Transactions</option>
              <option>Español</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
        </v-flex>
        <v-flex xs12 md2 d-flex>
          <div class="select-container">
            <select>
              <option value>Period</option>
              <option>Español</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
        </v-flex>
      </v-container>
    </v-flex>
    <v-flex xs12 class="fill-height">
      <v-card flat :color="'transparent'" class="fill-height hidden-sm-and-down" style="width: 100%;">
        <v-data-table
          :headers="headers"
          :items="transactions"
          :search="search"
          hide-actions
          :pagination.sync="pagination"
          :rows-per-page-items="[10]"
        >
          <template v-slot:items="props">
            <td>
              <small>
                <img
                  v-if="props.item.status == 'Successful'"
                  :src="require(`../../public/img/icons/arrow-right-circle.svg`)"
                  class="inline-small mr-1"
                />
                <img v-if="props.item.status == 'Denied'" :src="require(`../../public/img/icons/arrow-up-circle.svg`)" class="inline-small mr-1" />
                <img v-if="props.item.status == 'Pending'" :src="require(`../../public/img/icons/arrow-left-circle.svg`)" class="inline-small mr-1" />
              </small>
              {{ props.item.action }}
            </td>
            <td class="text-left">{{ props.item.from }}</td>
            <td class="text-left">{{ props.item.to }}</td>
            <td class="text-left">{{ props.item.amount }}</td>
            <td class="text-left">{{ props.item.date }}</td>
            <td class="text-left" :class="'text-' + props.item.status.toLowerCase()">{{ props.item.status }}</td>
          </template>
        </v-data-table>
        <div class="text-center pt-2 activity-pagination mt-6">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
      </v-card>
      <v-card
        flat
        :color="'white'"
        class="fill-height hidden-md-and-up mb-6 px-2 card-mobile"
        style="width: 100%;"
        v-for="(item, index) in transactions"
        :key="index"
      >
        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <img
              v-if="transactions[index].status == 'Successful'"
              :src="require(`../../public/img/icons/arrow-right-circle.svg`)"
              class="inline-small mr-1"
            />
            <img
              v-if="transactions[index].status == 'Denied'"
              :src="require(`../../public/img/icons/arrow-up-circle.svg`)"
              class="inline-small mr-1"
            />
            <img
              v-if="transactions[index].status == 'Pending'"
              :src="require(`../../public/img/icons/arrow-left-circle.svg`)"
              class="inline-small mr-1"
            />
            <p class="text-gray d-inline">{{ item.action }}</p>
          </v-container>
          <v-container class="text-right">
            <p class="font-weight-bold" :class="'text-' + transactions[index].status.toLowerCase()">{{ item.status }}</p>
          </v-container>
        </v-flex>
        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <p class="text-gray">Date:</p>
          </v-container>
          <v-container class="text-right">
            <p>{{ item.date }}</p>
          </v-container>
        </v-flex>

        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <p class="text-gray">Amount</p>
          </v-container>
          <v-container class="text-right font-weight-bold">
            <p>{{ item.amount }}</p>
          </v-container>
        </v-flex>

        <v-flex class="d-flex align-items-center justify-content-between card-row mb-4">
          <v-container>
            <p class="text-gray">To:</p>
          </v-container>
          <v-container class="text-sm-right">
            <small>{{ item.to }}</small>
          </v-container>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style lang="scss">
.wallet-transactions-activity {
  tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  thead {
    background: #f7f7f7;
  }

  .card {
    &-mobile {
      box-shadow: 0 14px 28px 0 rgba(0, 0, 0, 0.06);

      p {
        margin: 0;
      }
    }
    &-row {
      border-bottom: 1px solid #b3c0ce;
    }
  }

  .v-label {
    font-size: 12px !important;
  }

  .activity-pagination {
    .v-pagination {
      li {
        &:first-child,
        &:last-child {
          display: none;
        }
      }
    }
    .v-pagination > li {
      .v-pagination__navigation {
        background-color: transparent !important;
        box-shadow: none !important;
        border-radius: 0;
        padding: 0 2rem;
      }
      .v-pagination .v-pagination__navigation .v-icon {
        background: #fff;
        box-shadow: none !important;
      }
      .v-pagination__item {
        background: transparent;
        box-shadow: none;
        border-right: 1px solid gray !important;
        border-radius: 0;
        margin: 0;

        &:focus {
          outline: none;
          box-shadow: none;
        }

        &--active {
          background: transparent !important;
          color: #5495f7;
        }
      }
    }
  }

  .filters-container {
    justify-content: flex-end;
  }

  .text-successful {
    color: #2dcc70;
  }

  .text-denied {
    color: #e20d0d;
  }

  .text-pending {
    color: #b3c0ce;
  }

  .text-gray {
    color: #5c6c7f;
  }

  .select-container {
    position: relative;
    height: 35px;
    width: 100%;
  }

  .select-container select {
    border: none;
    background-color: transparent;
    color: gray;
    padding: 9px;
    font-size: 12px;
    -webkit-appearance: button;
    appearance: button;
    outline: none;
    font-size: 0.9rem;
    width: 100%;
    position: relative;
  }

  .select-container::before {
    content: '\25be ';
    position: absolute;
    top: 50%;
    right: 12px;
    text-align: center;
    font-size: 0.9rem;
    color: gray;
    pointer-events: none;
    z-index: 2;
    transform: translateY(-50%);
  }

  .select-container:hover::before {
    color: gray;
    background-color: white;
  }

  .select-container select option {
    padding: 30px;
  }
}
</style>
