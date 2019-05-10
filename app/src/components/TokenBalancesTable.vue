<template>
  <v-data-table :headers="headers" :items="tokenBalances" :pagination.sync="pagination">
    <template v-slot:headers="props">
      <tr class="background-grey">
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon small>arrow_upward</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td>
          {{ props.item.logo }}
          {{ props.item.name }}
        </td>
        <td class="text-xs-left text-bluish">{{ props.item.formattedBalance }}</td>
        <td class="text-xs-left">
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
    <v-alert v-slot:no-results :value="true" color="error" icon="warning"> Your search for "{{ search }}" found no results. </v-alert>
  </v-data-table>
</template>

<script>
export default {
  props: ['headers', 'tokenBalances'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      }
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
.background-grey {
  background: var(--v-torus_bcg-base);
}

.text-bluish {
  color: var(--v-torus_blue-base);
}
</style>
