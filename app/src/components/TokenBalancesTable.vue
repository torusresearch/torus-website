<template>
  <v-data-table :headers="headers" :items="tokenBalances" :search="search">
    <template v-slot:items="props">
      <td>{{ props.item.ticker }}</td>
      <td class="text-xs-left">
        <a :href="props.item.etherscanLink" target="_blank" rel="noreferrer noopener">{{ props.item.name }}</a>
      </td>
      <td class="text-xs-left">{{ props.item.balance }}</td>
      <td class="text-xs-left">
        <v-dialog v-model="props.item.dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="#75b4fd" v-on="on" class="white--text mb-4">Transfer</v-btn>
          </template>
          <v-form ref="tokenForm" v-model="tokenFormValid" lazy-validation>
            <v-card>
              <v-card-title>
                <span class="headline">Send Token: {{ props.item.ticker }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm12 md12>
                      <v-text-field
                        id="tokenToAddress"
                        placeholder="Enter address to send token to"
                        aria-label="box"
                        solo
                        required
                        v-model="tokenToAddress"
                        :rules="[rules.toAddress, rules.required]"
                        height="15px"
                        class="input-width"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field
                        id="amount"
                        placeholder="Enter token amount to send"
                        aria-label="box"
                        solo
                        required
                        v-model="tokenAmount"
                        height="15px"
                        :rules="[rules.required]"
                        class="input-width"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" large flat @click="props.item.dialog = false">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" large flat :disabled="!tokenFormValid" @click="onTransferToken(props.item)">Send</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </td>
    </template>
    <v-alert v-slot:no-results :value="true" color="error" icon="warning"> Your search for "{{ search }}" found no results. </v-alert>
  </v-data-table>
</template>
