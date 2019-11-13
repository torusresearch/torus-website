<template>
  <v-card class="dapp-permisson-container">
    <v-card-text class="text_1--text">
      <v-container>
        <v-layout mt-4 wrap class="wallet-dapp-permission">
          <v-flex xs12 px-4 class="title-container mb-4">
            <div class="title">
              <div class="d-inline font-weight-bold headline">Speedup transaction</div>
              <p>{{ gas }}</p>

              <v-slider
                v-model="slider"
                thumb-label="always"
                class="align-center"
                :max="gas.gasPrice * 5"
                :min="gas.gasPrice"
                hide-details
              ></v-slider>
            </div>
          </v-flex>
        </v-layout>
        <v-layout mt-4 pr-4>
          <v-spacer>
            <v-card-text>
              <v-row>
                <v-col class="pr-4"></v-col>
              </v-row>
            </v-card-text>
          </v-spacer>
          <br />
        </v-layout>

        <v-btn id="confirm" large @click="confirm">confirm</v-btn>
        <v-btn id="close-btn" large text @click="onClose">Close</v-btn>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['gas'],
  data() {
    return {
      editMode: false,
      permissions: [],
      min: -50,
      max: 90,
      slider: 40,
      range: [-20, 70]
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
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
