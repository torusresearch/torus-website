<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn class="hidden-xs-only" small text v-on="on">
        <span>Satoshi Nakamoto</span>
        <v-icon class="ml-2 mt-1">$vuetify.icons.select</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="require('../../public/images/logos/eth.svg')" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>satoshi.nakamoto@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <div class="font-weight-bold headline mt-2">Personal Wallet</div>
            <div class="subtitle-2 mb-0">2.3455 ETH / 222USD</div>
            <div class="caption torus_text--text text--lighten-4">0xdbb59a63bf5d4d0c32a20dc33e04008a71aa8b6e</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-action>
            <img :src="require('../../public/img/icons/indent-increse-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Add Account</v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <img :src="require('../../public/img/icons/indent-increse-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Import Account</v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-action>
            <img :src="require('../../public/img/icons/indent-increse-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Info and Support</v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn text class="mb-4 ml-2">Log Out</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
