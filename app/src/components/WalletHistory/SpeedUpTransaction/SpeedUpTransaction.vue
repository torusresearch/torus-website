<template>
  <v-dialog v-model="dialog" width="400" :fullscreen="$vuetify.breakpoint.xsOnly">
    <template v-slot:activator="{ on }">
      <v-btn x-small width="145" outlined rounded color="success" v-on="on">Speed up Transaction</v-btn>
    </template>
    <v-card class="speed-up-transaction py-6 px-8">
      <v-layout wrap>
        <v-flex xs12 class="mb-4">
          <div class="font-weight-bold headline">Speed up your transaction</div>
        </v-flex>
        <v-flex xs12 class="mb-8">
          <div class="mb-10 body-2">Increase your transfer fee (ETH):</div>
          <v-slider v-model="slider" thumb-label="always" class="align-center mx-n2" :max="gasPrice * 5" :min="gasPrice" hide-details></v-slider>
          <v-layout>
            <v-flex xs6>
              <div class="primary--text subtitle-2">Current</div>
              <div class="body-2">~ 7 Mins</div>
            </v-flex>
            <v-flex xs6 class="text-right">
              <div class="primary--text subtitle-2">Fast</div>
              <div class="body-2">~ 2 Mins</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <div class="subtitle-2">Updated Summary</div>
          <v-divider></v-divider>
          <v-list dense class="updated-summary pt-1">
            <v-list-item>
              <v-list-item-content class="caption">Send Amount</v-list-item-content>
              <v-list-item-content class="caption text-end">
                <span>0.01 ETH</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="caption">New Transfer Fee</v-list-item-content>
              <v-list-item-content class="caption text-end">
                <span>0.12 ETH</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="body-2">New Total</v-list-item-content>
              <v-list-item-content class="body-2 text-end">
                <span>0.13 ETH</span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
        <v-flex xs12 class="mx-n1 mt-10">
          <v-layout>
            <v-flex mx-2>
              <v-btn block depressed @click="dialog = false">Cancel</v-btn>
            </v-flex>
            <v-flex mx-2>
              <v-btn block depressed color="primary">Confirm</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['transaction'],
  data() {
    return {
      dialog: false,
      editMode: false,
      permissions: [],
      min: -50,
      max: 90,
      slider: 40,
      range: [-20, 70],
      gasPrice: 10 //temporary for transaction.gasprice
    }
  },
  methods: {
    confirm() {},
    addPermission() {
      this.permissions.push({
        isEdit: false
      })
    },
    onDeletePermission(target) {
      const targetIndex = this.permissions.indexOf(target)
      this.permissions.splice(targetIndex, 1)
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import 'SpeedUpTransaction.scss';
</style>
