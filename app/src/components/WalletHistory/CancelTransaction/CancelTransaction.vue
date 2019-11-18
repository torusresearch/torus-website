<template>
  <v-dialog v-model="dialog" width="400" :fullscreen="$vuetify.breakpoint.xsOnly">
    <template v-slot:activator="{ on }">
      <v-btn small block outlined color="error" v-on="on">Stop Transaction</v-btn>
    </template>
    <v-card class="speed-up-transaction py-6 px-8">
      <v-layout wrap>
        <v-flex xs12>
          <div class="font-weight-bold headline">Cancel your transaction</div>
        </v-flex>
        <v-flex xs12>
          <div class="mb-10 body-2">To do so, you have to pay for a min fee shown below:</div>
          <v-slider v-model="slider" thumb-label="always" class="align-center mx-n2" :max="gasPrice * 5" :min="gasPrice" hide-details></v-slider>
          <v-layout>
            <v-flex xs6>
              <div class="subtitle-2">Min</div>
            </v-flex>
            <v-flex xs6 class="text-right">
              <div class="subtitle-2">Max</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 mt-2>
          <v-alert class="caption" color="#FED9D8">
            <div class="subtitle-2 ml-n2">
              <v-icon class="error--text" small v-text="'$vuetify.icons.info'" />
              ATTENTION
            </div>
            <div class="caption ml-3">
              The network requires a fee higher than your original transaction fee. A higher fee increases the chances of a succesful cancellation.
              <span class="font-weight-bold">This fee will only be charged</span>
              if the attempt to cancel the transaction is successful.
            </div>
          </v-alert>
        </v-flex>
        <v-flex xs12 class="mx-n1 mt-2">
          <v-layout>
            <v-flex mx-1>
              <v-btn block depressed @click="dialog = false">Cancel</v-btn>
            </v-flex>
            <v-flex mx-1>
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
