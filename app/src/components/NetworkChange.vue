<template>
  <v-flex xs12 sm6 d-flex>
    <v-select :items="networks" v-model="selectedNetwork" @change="networkChanged" label="Network"></v-select>
  </v-flex>
</template>
