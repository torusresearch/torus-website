<template>
  <v-card class="seed-phrase" :class="{ 'is-mobile': $vuetify.breakpoint.xsOnly }">
    <v-layout class="card-header" wrap>
      <v-flex text-center xs12 py-7 px-6>
        <v-avatar class="avatar" size="64">
          <v-icon size="20" dark>$vuetify.icons.tkey_seed_phrase</v-icon>
        </v-avatar>
        <v-btn class="close-btn" icon aria-label="Close Seed Phrase" title="Close Seed Phrase" @click="onCancel">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout mx-6 pt-6 pb-12 wrap>
      <v-flex xs12 class="text-center mb-6">
        <div class="display-1 mb-2">{{ t('tkeySettings.tkeySeedPhrase.add.title') }}</div>
        <div class="body-2 mb-4">{{ t('tkeySettings.tkeySeedPhrase.add.description1') }}</div>
        <div class="body-2">{{ t('tkeySettings.tkeySeedPhrase.add.description2') }}</div>
      </v-flex>
      <v-flex v-if="isCustomSeedPhrase" xs12 class="text-center">
        <v-textarea
          v-model="newSeedPhrase"
          :placeholder="t('tkeySettings.tkeySeedPhrase.enterSeedPhrase')"
          hide-details
          class="custom-seed-phrase text_3--text mb-4"
          outlined
          rows="10"
        />
        <div class="text-right mb-4">
          <v-btn text large class="text_2--text mr-2" @click="cancelCustomSeedPhrase">
            {{ t('walletSettings.cancel') }}
          </v-btn>
          <v-btn
            class="px-8 white--text"
            :disabled="!newSeedPhrase"
            large
            depressed
            color="torusBrand1"
            type="button"
            @click="confirmCustomSeedPhrase"
          >
            {{ t('walletSettings.confirm') }}
          </v-btn>
        </div>
        <div class="d-flex align-start mb-8">
          <v-icon size="14" class="mr-2 warning--text" :style="{ marginTop: '2px' }">$vuetify.icons.alert_circle_filled</v-icon>
          <div class="caption text_2--text text-left">
            {{ t('tkeySettings.tkeySeedPhrase.add.note2') }}
          </div>
        </div>
      </v-flex>
      <v-flex v-else xs12 class="text-center mb-2">
        <div class="seed-phrase-container">
          <div v-show="!showSeedPhrase" class="seed-phrase-container_overlay"></div>
          <ul>
            <li v-for="(phrase, index) in seedPhraseArray" :key="index" class="body-2">
              <span class="text_3--text mr-2">{{ padZero(index + 1) }}.</span>
              <span class="text_2--text font-weight-bold">{{ phrase }}</span>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex v-if="!isCustomSeedPhrase" xs12 class="d-flex mb-10">
        <div>
          <!-- <v-btn
          class="circle-btn mr-2"
          icon
          small
          aria-label="Show/Hide Seed Phrase"
          title="Show/Hide Seed Phrase"
          @click="showSeedPhrase = !showSeedPhrase"
        >
          <v-icon size="16">{{ showSeedPhrase ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}</v-icon>
        </v-btn> -->
          <ShowToolTip :is-btn="true" :address="seedPhrase">
            <v-icon size="12" class="torusFont2--text" v-text="'$vuetify.icons.copy'" />
          </ShowToolTip>
          <v-btn class="circle-btn ml-2" icon small aria-label="Download Seed Phrase" title="Download Seed Phrase">
            <v-icon class="torusFont2--text" size="16">$vuetify.icons.download</v-icon>
          </v-btn>
        </div>
        <div class="ml-auto d-flex align-center">
          <v-btn text small color="torusBrand1" class="caption px-1" @click="showCustomSeedPhrase">
            {{ t('tkeySettings.tkeySeedPhrase.add.useYourOwn') }}
          </v-btn>
          <HelpTooltip>
            <template #description>
              <div class="d-flex align-start">
                <v-icon size="14" class="mr-2 text_3--text" :style="{ marginTop: '4px' }">$vuetify.icons.question_filled</v-icon>
                <div class="body-2 text_3--text text-justify">
                  {{ t('tkeySettings.tkeySeedPhrase.add.note') }}
                </div>
              </div>
            </template>
          </HelpTooltip>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-layout mx-n2>
          <v-flex xs6 px-2>
            <v-btn block text large class="text_2--text" @click="onCancel">
              {{ t('walletSettings.close') }}
            </v-btn>
          </v-flex>
          <v-flex xs6 px-2>
            <v-btn
              block
              large
              :disabled="addingSeedPhrase || isCustomSeedPhrase"
              :loading="addingSeedPhrase"
              class="torus-btn1 py-1"
              :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
              :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
              type="button"
              @click="onConfirm"
            >
              {{ t('walletSettings.confirm') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { generateMnemonic } from 'bip39'
import { mapActions, mapMutations } from 'vuex'

import HelpTooltip from '../../components/helpers/HelpTooltip'
import ShowToolTip from '../../components/helpers/ShowToolTip'

export default {
  components: { HelpTooltip, ShowToolTip },
  data() {
    return {
      showSeedPhrase: true,
      isCustomSeedPhrase: false,
      seedPhrase: '',
      newSeedPhrase: '',
      addingSeedPhrase: false,
    }
  },
  computed: {
    seedPhraseArray() {
      return this.seedPhrase.split(' ')
    },
  },
  mounted() {
    this.seedPhrase = generateMnemonic()
  },
  methods: {
    ...mapActions(['addSeedPhrase']),
    ...mapMutations(['setIsTkeySeedPhraseInputRequired']),
    onCancel() {
      this.setIsTkeySeedPhraseInputRequired(false)
    },
    async onConfirm() {
      this.addingSeedPhrase = true
      await this.addSeedPhrase(this.seedPhrase)
      this.setIsTkeySeedPhraseInputRequired(false)
      this.addingSeedPhrase = false
    },
    padZero(seedIndex) {
      return seedIndex.toString().padStart(2, 0)
    },
    showCustomSeedPhrase() {
      this.newSeedPhrase = this.seedPhrase
      this.isCustomSeedPhrase = true
    },
    cancelCustomSeedPhrase() {
      this.newSeedPhrase = ''
      this.isCustomSeedPhrase = false
    },
    confirmCustomSeedPhrase() {
      this.seedPhrase = this.newSeedPhrase
      this.isCustomSeedPhrase = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CreateSeedPhraseForm.scss';
</style>
