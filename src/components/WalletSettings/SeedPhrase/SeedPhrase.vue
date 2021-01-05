<template>
  <v-card class="seed-phrase" :class="{ 'is-mobile': $vuetify.breakpoint.xsOnly }">
    <v-layout class="card-header" wrap>
      <v-flex text-center xs12 py-7 px-6>
        <v-avatar class="avatar" size="64">
          <v-icon size="20" dark>$vuetify.icons.seed_phrase</v-icon>
        </v-avatar>
        <v-btn class="close-btn" icon aria-label="Close Seed Phrase" title="Close Seed Phrase" @click="onClose">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout mx-6 pt-6 pb-12 wrap>
      <v-flex xs12 class="text-center mb-6">
        <div class="display-1 mb-2">Your Mnemonic</div>
        <div class="body-2">You may wish to note down your Mnemonic. This Mnemonic is unique to your account and cannot be regenerated.</div>
      </v-flex>
      <v-flex xs12 class="text-center mb-2">
        <div class="seed-phrase-container">
          <div v-show="!showSeedPhrase" class="seed-phrase-container_overlay"></div>
          <ul>
            <li v-for="(phrase, index) in seedPhraseArray" :key="phrase" class="body-2">
              <span class="text_3--text mr-2">{{ padZero(index + 1) }}.</span>
              <span class="text_2--text font-weight-bold">{{ phrase }}</span>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex xs12 class="text-right mb-10">
        <v-btn
          class="circle-btn mr-2"
          icon
          small
          aria-label="Show/Hide Seed Phrase"
          title="Show/Hide Seed Phrase"
          @click="showSeedPhrase = !showSeedPhrase"
        >
          <v-icon size="16">{{ showSeedPhrase ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}</v-icon>
        </v-btn>
        <ShowToolTip :is-btn="true" :address="seedPhrase">
          <v-icon size="12" class="torusFont2--text" v-text="'$vuetify.icons.copy'" />
        </ShowToolTip>
        <v-btn class="circle-btn ml-2" icon small aria-label="Download Seed Phrase" title="Download Seed Phrase">
          <v-icon size="16">$vuetify.icons.download</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-layout mx-n2>
          <v-flex xs3></v-flex>
          <v-flex xs6 px-2>
            <v-btn
              block
              large
              class="torus-btn1 py-1"
              :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
              :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
              type="button"
              @click="onClose"
            >
              {{ t('walletSettings.close') }}
            </v-btn>
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { ShowToolTip },
  data() {
    return {
      showSeedPhrase: false,
      seedPhrase:
        'oppose vicious lazy any seed mosquito disagree recycle chat property ' +
        'judge pilot flat business amazing render joy arrange field chase garlic joke swamp cabbage',
    }
  },
  computed: {
    seedPhraseArray() {
      return this.seedPhrase.split(' ')
    },
  },
  methods: {
    onClose() {
      this.showSeedPhrase = false
      this.$emit('onClose')
    },
    padZero(seedIndex) {
      return seedIndex.toString().padStart(2, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SeedPhrase.scss';
</style>
