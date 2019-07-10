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
          text: 'Date',
          value: 'date'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'To',
          value: 'to'
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
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '8 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Denied'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Denied'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Successful'
        },
        {
          action: 'Top-Up',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Denied'
        },
        {
          action: 'Sending',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Pending'
        },
        {
          action: 'Received',
          date: '10 Jun',
          amount: '4ETH',
          to: '0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e',
          status: 'Successful'
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
  <v-layout mt-5 row wrap align-start align-content-start justify-center>
    <v-flex xs12 sm9>
      <v-container class="mb-1">
        <span class="headline font-weight-bold">Transaction Activities</span>
      </v-container>
    </v-flex>
    <v-flex xs12 sm9 class="fill-height">
      <v-card
        flat
        :color="'transparent'"
        class="fill-height hidden-sm-and-down"
        style="width: 100%;"
      >
        <v-data-table
          :headers="headers"
          :items="transactions"
          :search="search"
          hide-actions
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>
              <small>
                <img
                  :src="require(`../../public/img/icons/chevron-right-circle.svg`)"
                  class="inline-small"
                />
              </small>
              {{ props.item.action }}
            </td>
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.amount }}</td>
            <td class="text-xs-left">{{ props.item.to }}</td>
            <td class="text-xs-left">{{ props.item.status }}</td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2 activity-pagination">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
      </v-card>
      <v-card
        flat
        :color="'white'"
        class="fill-height hidden-md-and-up mb-4 px-2 card-mobile"
        style="width: 100%;"
        v-for="(item, index) in transactions"
        :key="index"
      >
        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <p class="text-gray">{{ item.action }}</p>
          </v-container>
          <v-container class="text-xs-right">
            <p :class="'text-' + transactions[index].status.toLowerCase()">{{ item.status }}</p>
          </v-container>
        </v-flex>
        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <p class="text-gray">Date:</p>
          </v-container>
          <v-container class="text-xs-right">
            <p>{{ item.date }}</p>
          </v-container>
        </v-flex>

        <v-flex class="d-flex align-items-center justify-content-between card-row">
          <v-container>
            <p class="text-gray">Amount</p>
          </v-container>
          <v-container class="text-xs-right font-weight-bold">
            <p>{{ item.amount }}</p>
          </v-container>
        </v-flex>

        <v-flex class="d-flex align-items-center justify-content-between card-row mb-3">
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

<style lang="scss" scoped>
@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($tiny: 18px, $small: 24px, $medium: 38px, $large: 80px);

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

.v-table {
  thead {
    background-color: red !important;
  }
}

.activity-pagination {
  .v-pagination > li {
    .v-pagination__navigation {
      background-color: transparent !important;
      box-shadow: none !important;
      border-right: 1px solid;
      border-radius: 0;
      padding: 0 2rem;
    }
    .v-pagination .v-pagination__navigation .v-icon {
      background: #fff;
      box-shadow: none !important;
    }
  }
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
</style>
