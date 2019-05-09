<template>
  <v-expand-transition>
    <v-form ref="form" v-model="valid" lazy-validation v-show="sendEthExpand">
      <v-text-field
        id="toAddress"
        placeholder="Enter address to send ether to"
        aria-label="box"
        solo
        v-model="toAddress"
        :rules="[rules.toAddress, rules.required]"
        height="15px"
        class="input-width"
      ></v-text-field>
      <v-text-field
        id="amount"
        placeholder="Enter ether amount to send"
        aria-label="box"
        solo
        v-model="amount"
        height="15px"
        :rules="[rules.required]"
        class="input-width"
      ></v-text-field>
      <v-btn color="#75b4fd" :disabled="!valid" class="white--text" @click="sendEth">Send</v-btn>
    </v-form>
  </v-expand-transition>
</template>
