<template>
  <div class="setup-seed-phrase" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center mb-6">
      <div class="mb-2" :class="[$vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text', isRequired ? 'display-1' : 'headline']">
        {{ isRequired ? t('tkeySettings.tkeySeedPhrase.add.required.title') : t('tkeySettings.tkeySeedPhrase.add.title') }}
      </div>
      <div class="body-2 text_2--text mb-4">
        {{ isRequired ? t('tkeySettings.tkeySeedPhrase.add.required.description1') : t('tkeySettings.tkeySeedPhrase.add.description1') }}
      </div>
      <div class="body-2 text_2--text">
        {{ isRequired ? t('tkeySettings.tkeySeedPhrase.add.required.description2') : t('tkeySettings.tkeySeedPhrase.add.description2') }}
      </div>
    </div>
    <div>
      <v-flex v-if="isCustomSeedPhrase" xs12 class="text-center">
        <v-form v-model="editSeedPhraseFormValid" lazy-validation @submit.prevent="confirmCustomSeedPhrase">
          <v-textarea
            v-model="newSeedPhrase"
            :placeholder="t('tkeySettings.tkeySeedPhrase.enterSeedPhrase')"
            :rules="[rules.required, validMnemonic]"
            class="custom-seed-phrase text_3--text"
            outlined
            rows="10"
            autocomplete="off"
            spellcheck="false"
            data-gramm_editor="false"
          />
          <div class="text-right mb-4">
            <v-btn text large class="text_2--text mr-2" @click="cancelCustomSeedPhrase">
              {{ t('walletSettings.cancel') }}
            </v-btn>
            <v-btn class="px-8 white--text" :disabled="!editSeedPhraseFormValid" large depressed color="torusBrand1" type="submit">
              {{ t('walletSettings.confirm') }}
            </v-btn>
          </div>
        </v-form>
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
          <ShowToolTip :is-btn="true" :address="seedPhrase">
            <v-icon size="12" class="torusFont2--text" v-text="'$vuetify.icons.copy'" />
          </ShowToolTip>
          <v-btn class="circle-btn ml-2" icon small aria-label="Download Seed Phrase" title="Download Seed Phrase" @click="downloadSeedPhrase">
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
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn
          v-if="!isRequired"
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          class="body-2 font-weight-bold"
          outlined
          :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'"
          @click="cancelSeedPhrase"
        >
          {{ t('tkeyNew.cancel') }}
        </v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          color="torusBrand1"
          class="white--text body-2 font-weight-bold"
          :disabled="addingSeedPhrase || isCustomSeedPhrase"
          :loading="addingSeedPhrase"
          @click="createSeedPhrase"
        >
          {{ t('tkeyNew.confirm') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { generateMnemonic, validateMnemonic } from 'bip39'

import { downloadItem } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { HelpTooltip, ShowToolTip },
  props: {
    addingSeedPhrase: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSeedPhrase: true,
      isCustomSeedPhrase: false,
      seedPhrase: '',
      newSeedPhrase: '',
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      editSeedPhraseFormValid: true,
    }
  },
  computed: {
    seedPhraseArray() {
      return this.seedPhrase.split(' ')
    },
    validMnemonic() {
      return validateMnemonic(this.newSeedPhrase) || this.t('tkeySettings.tkeySeedPhrase.add.incorrect')
    },
  },
  mounted() {
    this.seedPhrase = generateMnemonic()
  },
  methods: {
    createSeedPhrase() {
      this.$emit('addSeedPhrase', this.seedPhrase)
    },
    cancelSeedPhrase() {
      this.$emit('cancelSeedPhrase')
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
    downloadSeedPhrase() {
      downloadItem('seed-phrase.txt', this.seedPhrase)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetupSeedPhrase.scss';
</style>
