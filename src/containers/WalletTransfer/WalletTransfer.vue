<template>
  <v-container class="wallet-transfer pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4 mobile-view' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold text_2--text float-left page-title" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
        {{ t('walletTransfer.transferDetails') }}
      </div>
      <div class="ml-auto">
        <QuickAddress />
      </div>
    </div>
    <v-layout
      wrap
      mx-n4
      :class="[(contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155) && $vuetify.breakpoint.xsOnly ? 'mt-0' : 'mt-7']"
    >
      <v-flex
        v-if="contractType !== CONTRACT_TYPE_ERC721 && contractType !== CONTRACT_TYPE_ERC1155 && $vuetify.breakpoint.smAndDown"
        :class="[{ 'mb-4': $vuetify.breakpoint.smOnly }]"
        px-4
        xs12
      >
        <v-card class="elevation-1 pa-6">
          <div class="d-flex">
            <span class="body-2 text_1--text">{{ t('walletTransfer.accountBalance') }}</span>
            <div class="ml-auto">
              <NetworkDisplay :store-network-type="networkType"></NetworkDisplay>
            </div>
          </div>
          <div class="d-flex mt-3">
            <div>
              <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-2" />
              <div v-else>
                <span id="account-balance" class="display-2 text_2--text mr-1">{{ selectedItem && selectedItem.computedBalanceRounded }}</span>
                <span class="caption text_2--text">{{ selectedItem && selectedItem.symbol }}</span>
              </div>
            </div>
            <div class="caption text-right currency-rate align-self-end text_2--text ml-auto">
              {{ selectedItem && selectedItem.currencyRateText }}
            </div>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
        <v-form ref="form" v-model="formValid" lazy-validation aria-autocomplete="off" autocomplete="off" @submit.prevent="sendCoin">
          <v-card
            :flat="$vuetify.breakpoint.xsOnly"
            class="form-container"
            :class="$vuetify.breakpoint.xsOnly ? 'mobile py-6 px-4' : 'elevation-1 pa-6'"
          >
            <v-layout wrap>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('walletTransfer.selectItem') }}</div>
                <div v-if="selectedItemDisplay">
                  <v-menu transition="slide-y-transition" bottom>
                    <template #activator="{ on }">
                      <v-chip class="select-coin" label large :outlined="$vuetify.theme.dark" v-on="on">
                        <span class="select-coin-name">{{ selectedItemDisplay.name }}</span>
                        <div class="flex-grow-1 text-right pr-2">
                          <v-icon right>$vuetify.icons.select</v-icon>
                        </div>
                      </v-chip>
                    </template>
                    <v-list class="select-item-list">
                      <v-list-item
                        v-for="token in finalBalancesArrayEthOnly"
                        :key="token.id"
                        class="select-coin-eth"
                        @click="selectedItemChanged(token.tokenAddress)"
                      >
                        <v-list-item-icon class="mr-1">
                          <img
                            :src="`${logosUrl}/${token.logo}`"
                            height="20px"
                            onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
                            :alt="token.name"
                          />
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">{{ token.name }} ({{ token.symbol }})</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mx-3"></v-divider>
                      <v-subheader v-if="finalBalancesArrayTokens.length > 0" class="body-2">
                        <v-icon small left class="mr-2">$vuetify.icons.token</v-icon>
                        {{ t('walletTransfer.tokens') }}
                      </v-subheader>
                      <v-list-item v-for="token in finalBalancesArrayTokens" :key="token.id" @click="selectedItemChanged(token.tokenAddress)">
                        <v-list-item-icon class="ml-8 mr-1">
                          <img
                            :src="`${logosUrl}/${token.logo}`"
                            height="20px"
                            onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
                            :alt="token.name"
                          />
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">{{ token.name }} ({{ token.symbol }})</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mx-3"></v-divider>
                      <v-subheader v-if="collectibles.length > 0" class="body-2">
                        <v-icon small left class="mr-2">$vuetify.icons.collectibles</v-icon>
                        {{ t('walletTransfer.collectibles') }}
                      </v-subheader>
                      <v-list-item v-for="collectible in collectibles" :key="collectible.address" @click="selectedItemChanged(collectible.address)">
                        <v-list-item-icon class="ml-8 mr-1">
                          <img :src="collectible.logo" height="20px" :alt="`${collectible.name} Logo`" />
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="body-2">{{ collectible.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-flex>
              <v-flex xs12 mt-6>
                <div class="body-2 mb-2">{{ t('walletTransfer.transferMode') }}</div>
                <v-layout wrap class="mx-n2">
                  <v-flex xs12 sm8 class="recipient-address-container px-2">
                    <v-combobox
                      id="recipient-address"
                      ref="contactSelected"
                      :name="randomName"
                      class="recipient-address"
                      :class="{ hasQrError: qrErrorMsg !== '' }"
                      :value="contactSelected"
                      :items="contactList"
                      :placeholder="verifierPlaceholder"
                      required
                      :rules="[contactRule, rules.contactRequired, ensRule, unstoppableDomainsRule]"
                      outlined
                      item-text="name"
                      item-value="value"
                      aria-label="Recipient Address"
                      :return-object="false"
                      @input="contactChanged"
                    >
                      <template v-if="apiStreamSupported" #append>
                        <v-btn icon small color="torusBrand1" title="Capture QR" tabindex="-1" aria-label="Capture QR" @click="startQrScanning">
                          <v-icon small>$vuetify.icons.scan</v-icon>
                        </v-btn>
                      </template>
                      <template #message="props">
                        {{ t(props.message) }}
                      </template>
                    </v-combobox>
                    <v-dialog v-model="showQrScanner" width="600" @click:outside="closeQRScanner">
                      <div v-if="showQrScanner" class="qr-scan-container">
                        <QrcodeStream :camera="camera" :style="camera === 'off' && { display: 'none' }" @decode="onDecodeQr" @init="onInit" />
                        <v-btn class="close-btn" icon aria-label="Close QR Scanner" title="Close QR Scanner" @click="closeQRScanner">
                          <v-icon>$vuetify.icons.close</v-icon>
                        </v-btn>
                      </div>
                    </v-dialog>
                    <div v-if="qrErrorMsg !== ''" class="v-text-field__details torus-hint">
                      <div class="v-messages">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message d-flex error--text px-3">{{ qrErrorMsg }}</div>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm4 class="recipient-verifier-container px-2">
                    <v-select
                      id="recipient-verifier"
                      v-model="selectedVerifier"
                      outlined
                      append-icon="$vuetify.icons.select"
                      :items="verifierOptions"
                      item-text="name"
                      item-value="value"
                      :rules="[rules.contactRequired]"
                      aria-label="Recipient Selector"
                      @blur="verifierChangedManual"
                    >
                      <template #selection="{ item }">
                        <div class="v-select__selection v-select__selection--comma">
                          {{ t(item.name) }}
                        </div>
                      </template>
                      <template #item="{ item }">{{ t(item.name) }}</template>
                      <template #message="props">
                        {{ t(props.message) }}
                      </template>
                    </v-select>
                  </v-flex>
                  <v-flex v-if="newContact && $refs.contactSelected && $refs.contactSelected.valid && selectedVerifier !== ''" xs12 mb-2>
                    <AddContact :contact="contactSelected" :verifier="selectedVerifier"></AddContact>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 class="you-send-container">
                <div class="mb-2">
                  <span class="body-2">{{ t('walletTransfer.youSend') }}</span>
                  <a
                    v-if="contractType !== CONTRACT_TYPE_ERC721 && contractType !== CONTRACT_TYPE_ERC1155 && !isSendAll"
                    id="send-all-btn"
                    class="float-right torusBrand1--text body-2"
                    @click="sendAll"
                  >
                    {{ t('walletTransfer.sendAll') }}
                  </a>
                  <a v-if="isSendAll" id="send-all-reset-btn" class="float-right torusBrand1--text body-2" @click="resetSendAll">
                    {{ t('walletTransfer.reset') }}
                  </a>
                </div>
                <v-select
                  v-if="contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155"
                  v-model="assetSelected"
                  :items="collectibleSelected.assets"
                  outlined
                  item-text="name"
                  append-icon="$vuetify.icons.select"
                  return-object
                  aria-label="Asset selector"
                >
                  <template #prepend-inner>
                    <img :src="assetSelected.image" height="24px" :alt="assetSelected.name" />
                  </template>
                  <template #item="{ item }">
                    <img class="mr-2" :src="item.image" height="24px" :alt="item.name" />
                    {{ item.name }}
                  </template>
                </v-select>
                <v-text-field
                  v-if="contractType !== CONTRACT_TYPE_ERC721 && contractType !== CONTRACT_TYPE_ERC1155"
                  id="you-send"
                  ref="youSend"
                  :hint="
                    amount <= 0 ? '' : convertedAmount ? `~ ${convertedAmount} ${!!toggle_exclusive ? selectedItem.symbol : selectedCurrency}` : ''
                  "
                  persistent-hint
                  type="number"
                  outlined
                  required
                  :value="displayAmount"
                  :readonly="isSendAll"
                  :rules="[rules.required, lesserThan, moreThanZero]"
                  aria-label="Amount you send"
                  :error-messages="sendAmountError"
                  @change="onChangeDisplayAmount"
                >
                  <template #append>
                    <v-btn
                      id="coin-mode-btn"
                      small
                      class="send-mode mr-2"
                      :class="!!toggle_exclusive ? `torus-btn1 ${$vuetify.theme.isDark ? 'torusGray3--text' : 'torusGray1--text'}` : 'active'"
                      :disabled="!toggle_exclusive"
                      :outlined="!!toggle_exclusive"
                      @click="changeSelectedToCurrency(0)"
                    >
                      {{ selectedItem && selectedItem.symbol }}
                    </v-btn>
                    <v-btn
                      v-if="selectedCurrency !== (selectedItem && selectedItem.symbol)"
                      id="currency-mode-btn"
                      small
                      class="send-mode"
                      :class="!toggle_exclusive ? `torus-btn1 ${$vuetify.theme.isDark ? 'torusGray3--text' : 'torusGray1--text'}` : 'active'"
                      :disabled="!!toggle_exclusive"
                      :outlined="!toggle_exclusive"
                      @click="changeSelectedToCurrency(1)"
                    >
                      {{ selectedCurrency }}
                    </v-btn>
                  </template>
                  <template #message="props">
                    {{ $refs.youSend && $refs.youSend.errorBucket.length === 0 ? props.message : t(props.message) }}
                  </template>
                </v-text-field>
                <v-text-field
                  v-if="contractType === CONTRACT_TYPE_ERC1155 && assetSelected.tokenBalance > 1"
                  id="you-send-nft"
                  ref="youSendNft"
                  type="number"
                  outlined
                  required
                  :value="erc1155DisplayAmount"
                  :rules="[rules.required, lesserThan, isWholeNumber, moreThanZero]"
                  aria-label="Amount you send"
                  :error-messages="sendAmountError"
                  @change="onChangeErc1155DisplayAmount"
                >
                  <template #append>
                    <v-btn
                      id="coin-mode-btn"
                      small
                      class="send-mode mr-2"
                      :class="!!toggle_exclusive ? `torus-btn1 ${$vuetify.theme.isDark ? 'torusGray3--text' : 'torusGray1--text'}` : 'active'"
                      :disabled="true"
                      :outlined="true"
                    >
                      {{ assetSelected && assetSelected.name }}
                    </v-btn>
                  </template>
                  <template #message="props">
                    {{ $refs.youSendNft && $refs.youSendNft.errorBucket.length === 0 ? props.message : t(props.message) }}
                  </template>
                </v-text-field>
              </v-flex>
              <TransactionSpeedSelect
                :reset-speed="resetSpeed"
                :symbol="contractType !== CONTRACT_TYPE_ERC721 && contractType !== CONTRACT_TYPE_ERC1155 ? selectedItem.symbol : networkType.ticker"
                :contract-type="contractType"
                :network-ticker="networkType.ticker"
                :gas="gas"
                :display-amount="displayAmount"
                :selected-currency="selectedCurrency"
                :currency-multiplier="getCurrencyTokenRate"
                :currency-multiplier-eth="currencyMultiplier"
                :nonce="nonce"
                :network-host="networkType.host"
                @onSelectSpeed="onSelectSpeed"
              />
              <v-flex v-if="contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155" xs12 mb-6 class="text-right">
                <div class="text-subtitle-2">{{ t('walletTransfer.totalCost') }}</div>
                <div class="headline text_2--text">{{ getEthAmount(gas, activeGasPrice) }} {{ networkType.ticker }}</div>
                <div class="caption text_2--text">{{ gasPriceInCurrency }} {{ selectedCurrency }}</div>
              </v-flex>
              <v-flex v-else xs12 mb-6 class="text-right">
                <div class="text-subtitle-2">{{ t('walletTransfer.totalCost') }}</div>
                <div class="headline text_2--text">{{ totalCost || 0 }} {{ totalCostSuffix }}</div>
                <div class="caption text_2--text">{{ convertedTotalCost ? convertedTotalCostDisplay : `~ 0 ${selectedCurrency}` }}</div>
              </v-flex>
              <v-flex xs12 mt-3 class="text-right">
                <v-btn
                  id="wallet-transfer-submit"
                  large
                  depressed
                  color="torusBrand1"
                  :disabled="!formValid || speedSelected === '' || selectedVerifier === ''"
                  class="px-8 white--text gmt-wallet-transfer"
                  @click="onTransferClick"
                >
                  {{ t('walletTransfer.transfer') }}
                </v-btn>
                <v-dialog v-model="confirmDialog" max-width="375" persistent>
                  <TransferConfirm
                    :converted-verifier-id="convertedVerifierId"
                    :to-address="toEthAddress"
                    :to-verifier-id="toAddress"
                    :to-verifier="selectedVerifier"
                    :from-address="selectedAddress"
                    :from-verifier-id="userInfo.verifierId"
                    :from-verifier="fromVerifier"
                    :network-type="networkType"
                    :converted-amount="
                      convertedAmount
                        ? `~ ${convertedAmount} ${
                            !!toggle_exclusive
                              ? contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155
                                ? ''
                                : selectedItem.symbol
                              : selectedCurrency
                          }`
                        : ''
                    "
                    :display-amount="`${displayAmount} ${
                      !toggle_exclusive
                        ? contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155
                          ? ''
                          : selectedItem.symbol
                        : selectedCurrency
                    }`"
                    :asset-selected="contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155 ? assetSelected : {}"
                    :is-non-fungible-token="contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155"
                    :speed-selected="timeTaken"
                    :transaction-fee="gasPriceInCurrency"
                    :transaction-fee-eth="getEthAmount(gas, activeGasPrice)"
                    :selected-currency="selectedCurrency"
                    :send-eth-to-contract-error="sendEthToContractError"
                    :total-cost="`${totalCost || 0} ${totalCostSuffix}`"
                    :total-cost-converted="convertedTotalCost ? convertedTotalCostDisplay : `~ 0 ${selectedCurrency}`"
                    :total-cost-bn="totalCostBn"
                    :item-balance="selectedItemBalance"
                    :contract-type="contractType"
                    :eth-balance="ethBalance"
                    @onClose="confirmDialog = false"
                    @onConfirm="sendCoin"
                  ></TransferConfirm>
                </v-dialog>
              </v-flex>
            </v-layout>
          </v-card>
        </v-form>
      </v-flex>
      <v-flex v-if="contractType !== CONTRACT_TYPE_ERC721 && contractType !== CONTRACT_TYPE_ERC1155 && !$vuetify.breakpoint.smAndDown" px-4 xs6>
        <v-card class="elevation-1 pa-6">
          <div class="d-flex">
            <span class="body-2">{{ t('walletTransfer.accountBalance') }}</span>
            <div class="ml-auto">
              <NetworkDisplay :store-network-type="networkType"></NetworkDisplay>
            </div>
          </div>
          <div class="d-flex mt-3">
            <div>
              <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-2" />
              <div v-else>
                <span id="account-balance" class="display-2 text_2--text mr-1">{{ selectedItem && selectedItem.computedBalanceRounded }}</span>
                <span class="caption text_2--text">{{ selectedItem && selectedItem.symbol }}</span>
              </div>
            </div>
            <div class="caption text-right currency-rate align-self-end text_2--text ml-auto">
              {{ selectedItem.currencyRateText }}
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="messageModalShow" max-width="375" persistent>
      <MessageModal
        :detail-text="messageModalDetails.replace(/\{time\}/gi, timeTaken)"
        go-to="walletHistory"
        :modal-type="messageModalType"
        :title="messageModalTitle"
        @onClose="messageModalShow = false"
      >
        <template v-if="selectedVerifier === TWITTER && messageModalType === MESSAGE_MODAL_TYPE_SUCCESS" #link>
          <div class="mb-4">
            <div class="mb-4 text_2--text body-2">{{ t('walletTransfer.transferShare') }}</div>
            <v-btn text class="share-btn" :href="tweetData" target="_blank">
              <v-icon size="20" class="mr-1">$vuetify.icons.twitter</v-icon>
              <span class="body-2 font-weight-bold">Tweet</span>
            </v-btn>
          </div>
        </template>
      </MessageModal>
    </v-dialog>
  </v-container>
</template>

<script>
import randomId from '@chaitanyapotti/random-id'
import Resolution from '@unstoppabledomains/resolution'
import BigNumber from 'bignumber.js'
import erc721TransferABI from 'human-standard-collectible-abi'
import erc20TransferABI from 'human-standard-token-abi'
import isEqual from 'lodash.isequal'
import log from 'loglevel'
import { ERC1155 as erc1155Abi } from 'multi-token-standard-abi'
import { QrcodeStream } from 'vue-qrcode-reader'
import { mapGetters, mapState } from 'vuex'
import { isAddress, toChecksumAddress } from 'web3-utils'

import TransferConfirm from '../../components/Confirm/TransferConfirm'
import ComponentLoader from '../../components/helpers/ComponentLoader'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import QuickAddress from '../../components/helpers/QuickAddress'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import AddContact from '../../components/WalletTransfer/AddContact'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import config from '../../config'
import torus from '../../torus'
import {
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  ENS,
  ETH,
  GITHUB,
  GOOGLE,
  MESSAGE_MODAL_TYPE_FAIL,
  MESSAGE_MODAL_TYPE_SUCCESS,
  OLD_ERC721_LIST,
  TWITTER,
  UNSTOPPABLE_DOMAINS,
} from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { apiStreamSupported, getEtherScanHashLink, getUserIcon, getVerifierOptions, significantDigits, validateVerifierId } from '../../utils/utils'

export default {
  name: 'WalletTransfer',
  components: {
    TransactionSpeedSelect,
    MessageModal,
    QrcodeStream,
    AddContact,
    ComponentLoader,
    TransferConfirm,
    QuickAddress,
    NetworkDisplay,
  },
  data() {
    return {
      sendEthToContractError: false,
      contractType: CONTRACT_TYPE_ETH,
      isContract: false,
      collectibleSelected: {},
      assetSelected: {},
      tokenAddress: '0x',
      toEthAddress: '',
      amount: new BigNumber('0'),
      erc1155DisplayAmount: new BigNumber('0'),
      displayAmount: new BigNumber('0'),
      convertedAmount: '',
      contactSelected: '',
      toAddress: '',
      formValid: false,
      ensError: '',
      unstoppableDomainsError: '',
      toggle_exclusive: 0,
      gas: new BigNumber('21000'),
      activeGasPrice: new BigNumber('0'),
      gasPriceInCurrency: new BigNumber('0'),
      isFastChecked: false,
      speedSelected: '',
      totalCost: '',
      totalCostBn: new BigNumber('0'),
      timeTaken: '',
      convertedTotalCost: '',
      resetSpeed: false,
      hasCustomGasLimit: false,
      qrErrorMsg: '',
      autoSelectVerifier: true,
      selectedVerifier: '',
      rules: {
        required: (value) => !!value || 'walletTransfer.required',
        contactRequired: (value) => !!value || 'walletTransfer.required',
      },
      nodeDetails: {},
      messageModalShow: false,
      messageModalType: '',
      messageModalTitle: '',
      messageModalDetails: '',
      isSendAll: false,
      confirmDialog: false,
      CONTRACT_TYPE_ETH,
      CONTRACT_TYPE_ERC20,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
      logosUrl: config.logosUrl,
      sendAmountError: '',
      convertedVerifierId: '',
      existingTwitterAccount: false,
      TWITTER,
      etherscanLink: '',
      MESSAGE_MODAL_TYPE_SUCCESS,
      nonce: -1,
      camera: 'off',
      showQrScanner: false,
    }
  },
  computed: {
    ...mapGetters({
      tokenBalances: 'tokenBalances',
      collectibles: 'collectibleBalances',
      currencyMultiplier: 'currencyMultiplier',
      contacts: 'filteredContacts',
    }),
    ...mapState([
      'selectedCurrency',
      'weiBalanceLoaded',
      'tokenDataLoaded',
      'currencyData',
      'tokenRates',
      'selectedAddress',
      'userInfo',
      'networkType',
      'wallet',
    ]),
    verifierOptions() {
      return getVerifierOptions()
    },
    randomName() {
      return `torus-${torus.instanceId}`
    },
    finalCollectibles() {
      return this.collectibles || []
    },
    finalBalancesArray() {
      return this.tokenBalances.finalBalancesArray || []
    },
    finalBalancesArrayTokens() {
      return this.tokenBalances.finalBalancesArray.filter((token) => token.tokenAddress !== '0x') || []
    },
    finalBalancesArrayEthOnly() {
      return this.tokenBalances.finalBalancesArray.filter((token) => token.tokenAddress === '0x') || []
    },
    selectedItem() {
      return this.finalBalancesArray.find((x) => x.tokenAddress === this.selectedTokenAddress)
    },
    selectedItemDisplay() {
      if (this.contractType !== CONTRACT_TYPE_ERC721 && this.contractType !== CONTRACT_TYPE_ERC1155) return this.selectedItem

      return this.collectibleSelected
    },
    selectedTokenAddress() {
      if (this.tokenAddress === '0x' || !isAddress(this.tokenAddress)) return '0x'
      return toChecksumAddress(this.tokenAddress)
    },
    getCurrencyTokenRate() {
      let tokenRateMultiplierNumber = 1
      if (this.contractType === CONTRACT_TYPE_ERC20) tokenRateMultiplierNumber = this.tokenRates[this.selectedTokenAddress.toLowerCase()] || 0
      const tokenRateMultiplier = new BigNumber(tokenRateMultiplierNumber)
      return this.currencyMultiplier.times(tokenRateMultiplier)
    },
    convertedTotalCostDisplay() {
      return `~ ${significantDigits(this.convertedTotalCost)} ${this.selectedCurrency}`
    },
    currencyBalanceDisplay() {
      // = 390.00 USD
      // USD 4,138.16
      const getNumber = this.selectedItem.currencyBalance.split(' ')[1]
      return `= ${getNumber} ${this.selectedCurrency}`
    },
    totalCostSuffix() {
      return this.contractType === CONTRACT_TYPE_ETH ? (this.toggle_exclusive === 0 ? this.selectedItem.symbol : this.selectedCurrency) : ''
    },
    verifierPlaceholder() {
      return this.selectedVerifier
        ? `${this.t('walletSettings.enter')} ${this.t(this.verifierOptions.find((verifier) => verifier.value === this.selectedVerifier).name)}`
        : ''
    },
    contactList() {
      return this.contacts.reduce((mappedObject, contact) => {
        if (contact.verifier === this.selectedVerifier || this.selectedVerifier === '') {
          mappedObject.push({
            name: `${contact.name} (${contact.contact})`,
            value: contact.contact,
            verifier: contact.verifier,
          })
        }
        return mappedObject
      }, [])
    },
    newContact() {
      if (!this.contactSelected) return false

      const targetContact = this.contactSelected
      const addressFound = this.contactList.find((contact) => contact.value.toLowerCase() === targetContact.toLowerCase())
      return addressFound === undefined
    },
    tweetData() {
      const share = new URL('https://twitter.com/intent/tweet')
      const selectedAsset =
        this.contractType === CONTRACT_TYPE_ERC721 || this.contractType === CONTRACT_TYPE_ERC1155 ? this.assetSelected.name : this.selectedItem.symbol
      const amount = `${this.contractType === CONTRACT_TYPE_ERC721 || this.contractType === CONTRACT_TYPE_ERC1155 ? '' : this.displayAmount} ${
        !this.toggle_exclusive ? selectedAsset : this.selectedCurrency
      }`
      const message = this.t('walletTransfer.transferTweet')
        .replace(/{address}/gi, this.toAddress)
        .replace(/{amount}/gi, amount)
      share.searchParams.append('text', message)
      return share.href
    },
    ethBalance() {
      const ethBalance = this.tokenBalances.finalBalancesArray.find((token) => token.tokenAddress === '0x')
      return (ethBalance && ethBalance.computedBalance) || new BigNumber(0)
    },
    selectedItemBalance() {
      return (this.selectedItem && this.selectedItem.computedBalance) || new BigNumber(0)
    },
    fromVerifier() {
      const accountType = this.wallet[this.selectedAddress]?.accountType || ''
      return getUserIcon(accountType, this.userInfo.typeOfLogin)
    },
    apiStreamSupported() {
      return apiStreamSupported()
    },
  },
  watch: {
    selectedAddress(newValue, oldValue) {
      if (newValue !== oldValue && this.toEthAddress) this.calculateGas(this.toEthAddress)
    },
  },
  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'to')) {
      this.toAddress = this.$route.query.to
      this.setSelectedVerifierFromToAddress(this.toAddress)
    } else {
      this.toAddress = ''
    }

    this.setRandomId()

    this.contactSelected = this.toAddress

    this.$watch('finalCollectibles', (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue) && newValue?.length > 0) {
        this.updateFieldsBasedOnRoute()
      }
    })

    const tokensUnwatch = this.$watch('finalBalancesArray', (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue) && newValue?.length > 0) {
        this.updateFieldsBasedOnRoute()
        tokensUnwatch()
      }
    })

    this.updateFieldsBasedOnRoute()

    torus.nodeDetailManager
      .getNodeDetails(false, true)
      .then((nodeDetails) => {
        log.info('fetched node details', nodeDetails)
        this.nodeDetails = nodeDetails
      })
      .catch((error) => log.error(error))

    this.$vuetify.goTo(0)
  },
  methods: {
    startQrScanning() {
      this.camera = 'auto'
      this.showQrScanner = true
    },
    setSelectedVerifierFromToAddress(toAddress) {
      if (toAddress.startsWith('0x')) {
        this.selectedVerifier = ETH
      } else if (toAddress.startsWith('@')) {
        this.selectedVerifier = TWITTER
      } else if (/@/.test(toAddress)) {
        this.selectedVerifier = GOOGLE
      } else if (/.eth$/.test(toAddress) || /.xyz$/.test(toAddress) || /.kred$/i.test(toAddress)) {
        this.selectedVerifier = ENS
      } else if (/.crypto$/.test(toAddress)) {
        this.selectedVerifier = UNSTOPPABLE_DOMAINS
      }
    },
    async getIdFromNick(nick, typeOfLogin) {
      if (typeOfLogin === GITHUB) {
        const userData = await get(`https://api.github.com/users/${nick}`)
        return `${typeOfLogin.toLowerCase()}|${userData.id.toString()}`
      }
      if (typeOfLogin === TWITTER) {
        return this.$store.dispatch('getTwitterId', { nick, typeOfLogin })
      }
      return nick
    },
    async onChangeErc1155DisplayAmount(value) {
      this.sendAmountError = ''
      if (
        (this.contractType === CONTRACT_TYPE_ERC1155 && BigNumber.isBigNumber(value) && !this.erc1155DisplayAmount.eq(value)) ||
        !BigNumber.isBigNumber(value)
      ) {
        this.erc1155DisplayAmount = BigNumber.isBigNumber(value) ? value : new BigNumber(value || '0')
        if (this.toEthAddress) {
          this.gas = await this.calculateGas(this.toEthAddress)
        }
      }
    },
    async onChangeDisplayAmount(value) {
      this.sendAmountError = ''
      if ((BigNumber.isBigNumber(value) && !this.displayAmount.eq(value)) || !BigNumber.isBigNumber(value)) {
        this.displayAmount = BigNumber.isBigNumber(value) ? value : new BigNumber(value || '0')
        if (this.toggle_exclusive === 0) {
          this.amount = this.displayAmount
        } else {
          this.amount = this.getCurrencyTokenRate.gt(new BigNumber('0'))
            ? this.displayAmount.div(this.getCurrencyTokenRate)
            : this.displayAmount.times(this.getCurrencyTokenRate)
        }

        this.convertedAmount = this.toggle_exclusive
          ? significantDigits(this.displayAmount.div(this.getCurrencyTokenRate), false, 4)
          : significantDigits(this.displayAmount.times(this.getCurrencyTokenRate), false, 4)

        log.info(this.toEthAddress, 'address')
        if (this.toEthAddress) {
          this.gas = await this.calculateGas(this.toEthAddress)
        }
        this.updateTotalCost()
      }
    },
    updateFieldsBasedOnRoute() {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'contract')) {
        this.selectedItemChanged(
          this.$route.query.contract,
          Object.prototype.hasOwnProperty.call(this.$route.query, 'asset') ? this.$route.query.asset : ''
        )
      }
    },
    sendEmail(typeToken, transactionHash) {
      if (/\S+@\S+\.\S+/.test(this.toAddress)) {
        const etherscanLink = getEtherScanHashLink(transactionHash, this.networkType.host)
        const emailObject = {
          from_name: this.userInfo.name,
          to_email: this.toAddress,
          total_amount: significantDigits(this.amount.toFormat(5), false, 5).toString(),
          token: typeToken.toString(),
          etherscanLink,
          currency: this.selectedCurrency,
          currencyAmount: significantDigits(this.amount.times(this.getCurrencyTokenRate).toFormat(2)) || '',
          tokenImageUrl:
            this.contractType !== CONTRACT_TYPE_ERC721 || this.contractType !== this.CONTRACT_TYPE_ERC1155
              ? `${this.logosUrl}/${this.selectedItemDisplay.logo}`
              : this.selectedItemDisplay.image,
        }
        this.$store
          .dispatch('sendEmail', { emailObject })
          .then((response) => log.info('email response', response))
          .catch((error) => log.error(error))
      }
    },
    moreThanZero(value) {
      if (this.contractType === CONTRACT_TYPE_ERC1155) {
        return new BigNumber(value || '0').gte(new BigNumber('0')) || 'walletTransfer.invalidAmount'
      }
      if (this.selectedItem) {
        return new BigNumber(value || '0').gte(new BigNumber('0')) || 'walletTransfer.invalidAmount'
      }
      return ''
    },
    isWholeNumber(value) {
      const amount = new BigNumber(value || '0')
      const fixedAmount = new BigNumber(amount.toFixed(0))
      return fixedAmount.eq(amount) || 'walletTransfer.invalidAmount'
    },
    lesserThan(value) {
      if (this.contractType === CONTRACT_TYPE_ERC1155) {
        const amount = new BigNumber(value || '0')
        const balance = new BigNumber(this.assetSelected?.tokenBalance || '0')
        return amount.lte(balance) || 'walletTransfer.insufficient'
      }
      if (this.selectedItem) {
        let amount = new BigNumber(value || '0')
        if (this.toggle_exclusive === 1) {
          amount = amount.div(this.getCurrencyTokenRate)
        }
        return amount.lte(this.selectedItem.computedBalance) || 'walletTransfer.insufficient'
      }
      return ''
    },
    contactRule(contact) {
      let value = ''
      if (contact && typeof contact === 'string') value = contact
      else if (contact && contact.value) value = contact.value
      return validateVerifierId(this.selectedVerifier, value)
    },
    ensRule() {
      return this.selectedVerifier === ENS && this.ensError ? this.ensError : true
    },
    unstoppableDomainsRule() {
      return this.selectedVerifier === UNSTOPPABLE_DOMAINS && this.unstoppableDomainsError ? this.unstoppableDomainsError : true
    },
    async verifierChangedManual() {
      this.setRandomId()
      this.autoSelectVerifier = false
      this.$refs.form.validate()
      if (this.selectedVerifier && this.toAddress) {
        this.toEthAddress = await this.calculateEthAddress()
      }
    },
    async contactChanged(contact) {
      this.contactSelected = contact
      if (contact) this.toAddress = contact
      log.info(contact, 'contactChanged')

      // Autoupdate selected verifier
      if (this.autoSelectVerifier) {
        const contactFound = this.contactList.find((item) => item.value === contact)
        if (contactFound) {
          this.selectedVerifier = contactFound.verifier
        } else {
          this.setSelectedVerifierFromToAddress(this.toAddress)
        }
      }
      this.ensError = ''
      this.unstoppableDomainsError = ''

      if (this.selectedVerifier && this.toAddress) {
        this.toEthAddress = await this.calculateEthAddress()
      }
    },
    calculateGas(toAddress) {
      this.sendEthToContractError = false
      if (isAddress(toAddress)) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
          if (this.contractType === CONTRACT_TYPE_ETH) {
            const value = `0x${this.amount
              .times(new BigNumber(10).pow(new BigNumber(18)))
              .dp(0, BigNumber.ROUND_DOWN)
              .toString(16)}`
            torus.web3.eth
              .estimateGas({ to: toAddress, value, from: this.selectedAddress })
              .then((response) => {
                let resolved = new BigNumber(response || '0')
                if (!resolved.eq(new BigNumber('21000'))) {
                  resolved = new BigNumber(resolved.times(new BigNumber('1.1')).toFixed(0))
                  this.sendEthToContractError = this.isSendAll
                }
                log.info(resolved, 'gas')
                resolve(resolved)
              })
              .catch((error) => {
                log.error(error)
                resolve(new BigNumber('0'))
              })
          } else if (this.contractType === CONTRACT_TYPE_ERC20) {
            const value = `0x${this.amount
              .times(new BigNumber(10).pow(new BigNumber(this.selectedItem.decimals)))
              .dp(0, BigNumber.ROUND_DOWN)
              .toString(16)}`
            this.getTransferMethod(this.contractType, toAddress, value)
              .estimateGas({ from: this.selectedAddress })
              .then((response) => {
                log.info(response, 'gas')
                resolve(new BigNumber(response || '0'))
              })
              .catch((error) => {
                log.error(error)
                resolve(new BigNumber('0'))
              })
          } else if (this.contractType === CONTRACT_TYPE_ERC721) {
            this.getNftTransferMethod(this.contractType, this.selectedAddress, toAddress, this.assetSelected.tokenId)
              .estimateGas({ from: this.selectedAddress })
              .then((response) => {
                resolve(new BigNumber(response || '0'))
              })
              .catch((error) => {
                log.error(error)
                resolve(new BigNumber('0'))
              })
          } else if (this.contractType === CONTRACT_TYPE_ERC1155) {
            const val =
              Number.parseInt(this.assetSelected.tokenBalance, 10) === 1 ? new BigNumber(this.assetSelected.tokenBalance) : this.erc1155DisplayAmount
            this.getNftTransferMethod(this.contractType, this.selectedAddress, toAddress, this.assetSelected.tokenId, val)
              .estimateGas({ from: this.selectedAddress })
              .then((response) => {
                resolve(new BigNumber(response || '0'))
              })
              .catch((error) => {
                log.error(error)
                resolve(new BigNumber('0'))
              })
          }
        })
      }
      return Promise.resolve(new BigNumber('0'))
    },
    getTransferMethod(contractType, toAddress, value) {
      // For support of older ERC721
      if (Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, this.selectedTokenAddress.toLowerCase()) || contractType === CONTRACT_TYPE_ERC20) {
        const contractInstance = new torus.web3.eth.Contract(erc20TransferABI, this.selectedTokenAddress)
        return contractInstance.methods.transfer(toAddress, value)
      }

      throw new Error('Invalid Contract Type')
    },
    getNftTransferMethod(contractType, selectedAddress, toAddress, tokenId, value = 1) {
      if (contractType === CONTRACT_TYPE_ERC721 && Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, this.selectedTokenAddress.toLowerCase())) {
        const contractInstance = new torus.web3.eth.Contract(erc20TransferABI, this.selectedTokenAddress)
        return contractInstance.methods.transfer(toAddress, tokenId)
      }

      if (contractType === CONTRACT_TYPE_ERC721) {
        const contractInstance = new torus.web3.eth.Contract(erc721TransferABI, this.selectedTokenAddress)
        return contractInstance.methods.safeTransferFrom(selectedAddress, toAddress, tokenId)
      }

      if (contractType === CONTRACT_TYPE_ERC1155) {
        const contractInstance = new torus.web3.eth.Contract(erc1155Abi.abi, this.selectedTokenAddress)
        return contractInstance.methods.safeTransferFrom(selectedAddress, toAddress, tokenId, value, '0x')
      }

      throw new Error('Invalid Contract Type')
    },
    async selectedItemChanged(address, tokenId) {
      const foundInBalances = this.finalBalancesArray.find((token) => token.tokenAddress.toLowerCase() === address.toLowerCase())
      const foundInCollectibles = this.finalCollectibles.find((token) => token.address.toLowerCase() === address.toLowerCase())
      if (foundInBalances) {
        this.tokenAddress = foundInBalances.tokenAddress
        this.contractType = foundInBalances.erc20 ? CONTRACT_TYPE_ERC20 : CONTRACT_TYPE_ETH
        this.collectibleSelected = {}
        this.assetSelected = {}
      } else if (foundInCollectibles) {
        this.tokenAddress = foundInCollectibles.address
        this.contractType = foundInCollectibles.standard
        this.collectibleSelected = foundInCollectibles
        if (foundInCollectibles.assets && foundInCollectibles.assets.length > 0) {
          this.assetSelected = tokenId
            ? foundInCollectibles.assets.find((asset) => asset.tokenId.toString() === tokenId.toString()) || foundInCollectibles.assets[0]
            : foundInCollectibles.assets[0]
        }
        // Reset you send
        this.resetSendAll()
      }
      if (this.toEthAddress) {
        this.gas = await this.calculateGas(this.toEthAddress)
        this.updateTotalCost()
      }
    },
    getUnstoppableDomains(domain) {
      return new Resolution({
        blockchain: { ens: `https://mainnet.infura.io/v3/${config.infuraKey}`, cns: `https://mainnet.infura.io/v3/${config.infuraKey}` },
      }).addr(domain, 'ETH')
    },
    getEnsAddress(ens) {
      return torus.web3.eth.ens.getAddress(ens)
    },
    async calculateEthAddress() {
      let toAddress
      log.info(this.toAddress, this.selectedVerifier)
      if (isAddress(this.toAddress)) {
        toAddress = toChecksumAddress(this.toAddress)
      } else if (this.selectedVerifier === ENS) {
        try {
          const ethAddr = await this.getEnsAddress(this.toAddress)
          log.info(ethAddr)
          toAddress = ethAddr
        } catch (error) {
          log.error(error)
          this.ensError = 'walletSettings.invalidEns'
          this.$refs.form.validate()
        }
      } else if (this.selectedVerifier === UNSTOPPABLE_DOMAINS) {
        try {
          const ethAddr = await this.getUnstoppableDomains(this.toAddress)
          log.info(ethAddr)
          toAddress = toChecksumAddress(ethAddr)
        } catch (error) {
          log.error(error)
          this.unstoppableDomainsError = 'walletSettings.invalidUnstoppable'
          this.$refs.form.validate()
        }
      } else {
        try {
          const { loginConfig } = this.$store.state.embedState
          const foundLoginConfig = Object.keys(loginConfig).find((x) => loginConfig[x].typeOfLogin === this.selectedVerifier)
          const validVeriferId = await this.getIdFromNick(this.toAddress, this.selectedVerifier)
          this.convertedVerifierId = validVeriferId
          if (foundLoginConfig) {
            toAddress = await torus.getPublicAddress(this.nodeDetails.torusNodeEndpoints, this.nodeDetails.torusNodePub, {
              verifier: foundLoginConfig,
              verifierId: validVeriferId.startsWith('@') ? validVeriferId.replace('@', '').toLowerCase() : validVeriferId.toLowerCase(),
            })
          }
        } catch (error) {
          log.error(error)
        }
      }
      if (
        (this.contractType === CONTRACT_TYPE_ERC721 || (this.contractType === CONTRACT_TYPE_ERC1155 && this.assetSelected.tokenBalance === 1)) &&
        !this.hasCustomGasLimit
      ) {
        this.gas = await this.calculateGas(toAddress)
        this.updateTotalCost()
      }

      return toAddress
    },
    async onTransferClick() {
      if (this.$refs.form.validate()) {
        const toAddress = await this.calculateEthAddress()
        if (!isAddress(toAddress)) {
          // Show error body
          this.messageModalShow = true
          this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
          this.messageModalTitle = this.t('walletTransfer.transferFailTitle')
          this.messageModalDetails = this.t('walletTransfer.transferFailMessage')
          log.error('Invalid to Address')
          return
        }
        this.toEthAddress = toAddress
        if (
          (this.contractType !== CONTRACT_TYPE_ERC721 || (this.contractType === CONTRACT_TYPE_ERC1155 && this.assetSelected.tokenBalance > 1)) &&
          !this.hasCustomGasLimit
        ) {
          this.gas = await this.calculateGas(toAddress)
          this.updateTotalCost()
        }
        this.confirmDialog = true
      }
    },
    changeSelectedToCurrency(value) {
      if (this.toggle_exclusive === value) return
      this.toggle_exclusive = value
      const currencyRate = this.getCurrencyTokenRate
      if (value === 0) {
        this.onChangeDisplayAmount(!currencyRate.eq(new BigNumber('0')) ? this.displayAmount.div(currencyRate) : this.displayAmount)
      } else if (value === 1) {
        this.onChangeDisplayAmount(this.displayAmount.times(currencyRate))
      }
    },
    sendAll() {
      const ethBalance = this.selectedItem.computedBalance
      const currencyBalance = ethBalance.times(this.getCurrencyTokenRate)
      const ethGasPrice = this.getEthAmount(this.gas, this.activeGasPrice)
      const currencyGasPrice = ethGasPrice.times(this.getCurrencyTokenRate)

      if (ethBalance.minus(ethGasPrice).lt(new BigNumber(0))) {
        this.sendAmountError = this.t('walletTransfer.insufficient')
        return
      }

      this.isSendAll = true

      if (this.toggle_exclusive === 0) {
        this.onChangeDisplayAmount(this.contractType === CONTRACT_TYPE_ETH ? ethBalance.minus(ethGasPrice) : ethBalance)
      } else {
        this.onChangeDisplayAmount(this.contractType === CONTRACT_TYPE_ETH ? currencyBalance.minus(currencyGasPrice) : currencyBalance)
      }
    },
    resetSendAll() {
      this.onChangeDisplayAmount(new BigNumber('0'))
      this.resetSpeed = true
      this.isSendAll = false
      this.changeSelectedToCurrency(0)
    },
    async sendCoin() {
      log.info('sending with gas price', this.activeGasPrice.toString())
      const toAddress = this.toEthAddress
      const fastGasPrice = `0x${this.activeGasPrice.times(new BigNumber(10).pow(new BigNumber(9))).toString(16)}`
      const customNonceValue = this.nonce >= 0 ? `0x${this.nonce.toString(16)}` : undefined
      if (this.contractType === CONTRACT_TYPE_ETH) {
        const value = `0x${this.amount
          .times(new BigNumber(10).pow(new BigNumber(18)))
          .dp(0, BigNumber.ROUND_DOWN)
          .toString(16)}`
        log.info(this.gas.toString())
        torus.web3.eth.sendTransaction(
          {
            from: this.selectedAddress,
            to: toAddress,
            value,
            gas: this.gas.eq(new BigNumber('0')) ? undefined : `0x${this.gas.toString(16)}`,
            gasPrice: fastGasPrice,
            customNonceValue,
          },
          (error, transactionHash) => {
            if (error) {
              const regEx = /user denied transaction signature/i
              if (!error.message.match(regEx)) {
                this.messageModalShow = true
                this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
                this.messageModalTitle = this.t('walletTransfer.transferFailTitle')
                this.messageModalDetails = this.t('walletTransfer.transferFailMessage')
              }
              log.error(error)
            } else {
              // Send email to the user
              this.sendEmail(this.selectedItem.symbol, transactionHash)
              this.etherscanLink = getEtherScanHashLink(transactionHash, this.networkType.host)

              this.messageModalShow = true
              this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
              this.messageModalTitle = this.t('walletTransfer.transferSuccessTitle')
              this.messageModalDetails = this.t('walletTransfer.transferSuccessMessage')
            }
          }
        )
      } else if (this.contractType === CONTRACT_TYPE_ERC20) {
        const value = `0x${this.amount
          .times(new BigNumber(10).pow(new BigNumber(this.selectedItem.decimals)))
          .dp(0, BigNumber.ROUND_DOWN)
          .toString(16)}`
        this.getTransferMethod(this.contractType, toAddress, value).send(
          {
            from: this.selectedAddress,
            gas: this.gas.eq(new BigNumber('0')) ? undefined : `0x${this.gas.toString(16)}`,
            gasPrice: fastGasPrice,
            customNonceValue,
          },
          (error, transactionHash) => {
            if (error) {
              const regEx = /user denied transaction signature/i
              if (!error.message.match(regEx)) {
                this.messageModalShow = true
                this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
                this.messageModalTitle = this.t('walletTransfer.transferFailTitle')
                this.messageModalDetails = this.t('walletTransfer.transferFailMessage')
              }
              log.error(error)
            } else {
              // Send email to the user
              this.sendEmail(this.selectedItem.symbol, transactionHash)
              this.etherscanLink = getEtherScanHashLink(transactionHash, this.networkType.host)

              this.messageModalShow = true
              this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
              this.messageModalTitle = this.t('walletTransfer.transferSuccessTitle')
              this.messageModalDetails = this.t('walletTransfer.transferSuccessMessage')
            }
          }
        )
      } else if (this.contractType === CONTRACT_TYPE_ERC721) {
        this.getNftTransferMethod(this.contractType, this.selectedAddress, toAddress, this.assetSelected.tokenId).send(
          {
            from: this.selectedAddress,
            gas: this.gas.eq(new BigNumber('0')) ? undefined : `0x${this.gas.toString(16)}`,
            gasPrice: fastGasPrice,
            customNonceValue,
          },
          (error, transactionHash) => {
            if (error) {
              const regEx = /user denied transaction signature/i
              if (!error.message.match(regEx)) {
                this.messageModalShow = true
                this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
                this.messageModalTitle = this.t('walletTransfer.transferFailTitle')
                this.messageModalDetails = this.t('walletTransfer.transferFailMessage')
              }
              log.error(error)
            } else {
              // Send email to the user
              this.sendEmail(this.assetSelected.name, transactionHash)
              this.etherscanLink = getEtherScanHashLink(transactionHash, this.networkType.host)
              this.messageModalShow = true
              this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
              this.messageModalTitle = this.t('walletTransfer.transferSuccessTitle')
              this.messageModalDetails = this.t('walletTransfer.transferSuccessMessage')
            }
          }
        )
      } else if (this.contractType === CONTRACT_TYPE_ERC1155) {
        const val =
          Number.parseInt(this.assetSelected.tokenBalance, 10) === 1 ? new BigNumber(this.assetSelected.tokenBalance) : this.erc1155DisplayAmount
        this.getNftTransferMethod(this.contractType, this.selectedAddress, toAddress, this.assetSelected.tokenId, val).send(
          {
            from: this.selectedAddress,
            gas: this.gas.eq(new BigNumber('0')) ? undefined : `0x${this.gas.toString(16)}`,
            gasPrice: fastGasPrice,
            customNonceValue,
          },
          (error, transactionHash) => {
            if (error) {
              const regEx = /user denied transaction signature/i
              if (!error.message.match(regEx)) {
                this.messageModalShow = true
                this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
                this.messageModalTitle = this.t('walletTransfer.transferFailTitle')
                this.messageModalDetails = this.t('walletTransfer.transferFailMessage')
              }
              log.error(error)
            } else {
              // Send email to the user
              this.sendEmail(this.assetSelected.name, transactionHash)
              this.etherscanLink = getEtherScanHashLink(transactionHash, this.networkType.host)
              this.messageModalShow = true
              this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
              this.messageModalTitle = this.t('walletTransfer.transferSuccessTitle')
              this.messageModalDetails = this.t('walletTransfer.transferSuccessMessage')
            }
          }
        )
      }
    },
    getEthAmount(gas, gasPrice) {
      return gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
    },
    goBack() {
      this.$router.go(-1)
    },
    updateTotalCost() {
      log.info(this.activeGasPrice.toString(), 'acg price')
      if (this.displayAmount.isZero() || this.activeGasPrice === '') {
        this.totalCost = '0'
        this.convertedTotalCost = '0'

        if (this.activeGasPrice !== '') {
          const gasPriceInEth = this.getEthAmount(this.gas, this.activeGasPrice)
          this.gasPriceInCurrency = gasPriceInEth.times(this.currencyMultiplier)
        }
        return
      }

      this.totalCost = '0'
      this.convertedTotalCost = '0'

      // Updated you send value if send all
      if (this.isSendAll) {
        this.sendAll()
      }

      log.info(this.activeGasPrice.toString(), 'acg price 2')

      const gasPriceInEth = this.getEthAmount(this.gas, this.activeGasPrice)
      const gasPriceInCurrency = gasPriceInEth.times(this.currencyMultiplier)
      const toSend = this.amount
      const toSendConverted = toSend.times(this.getCurrencyTokenRate)

      this.gasPriceInCurrency = gasPriceInCurrency

      if (this.contractType === CONTRACT_TYPE_ETH) {
        this.totalCost = this.toggle_exclusive === 0 ? toSend.plus(gasPriceInEth) : toSendConverted.plus(gasPriceInCurrency)
        this.totalCostBn = toSend.plus(gasPriceInEth)
      } else if (this.contractType === CONTRACT_TYPE_ERC20) {
        const displayedCurrency = this.toggle_exclusive === 0 ? this.selectedItem.symbol : this.selectedCurrency
        this.totalCost = `${this.displayAmount.toString()} ${displayedCurrency} + ${significantDigits(
          this.getEthAmount(this.gas, this.activeGasPrice),
          false,
          18
        )} ETH`
      }

      this.convertedTotalCost = gasPriceInCurrency.plus(toSendConverted)
    },
    async onSelectSpeed(data) {
      log.info('SET DATA: ', data)
      this.speedSelected = data.speedSelected
      this.activeGasPrice = data.activeGasPrice
      this.timeTaken = data.speed
      this.gas = data.gas
      this.hasCustomGasLimit = data.isAdvanceOption
      this.nonce = data.nonce || -1

      if (data.isReset) {
        this.activeGasPrice = this.speedSelected === '' ? '' : this.activeGasPrice
        this.nonce = -1
        if (this.toEthAddress) {
          this.gas = await this.calculateGas(this.toEthAddress)
        }
      }

      this.updateTotalCost()

      this.resetSpeed = false
    },
    onDecodeQr(result) {
      try {
        const qrUrl = new URL(result)
        if (qrUrl.href.includes('ethereum:') && isAddress(qrUrl.pathname)) {
          this.toAddress = qrUrl.pathname
          this.selectedVerifier = ETH
          this.qrErrorMsg = ''
        } else if (qrUrl.searchParams.has('to')) {
          this.selectedVerifier = ETH
          this.toAddress = qrUrl.searchParams.get('to')
          this.qrErrorMsg = ''
        } else {
          this.toAddress = ''
          this.qrErrorMsg = this.t('walletTransfer.incorrectQR')
        }
      } catch {
        const parsedResult = result.replace('ethereum:', '')
        if (isAddress(parsedResult)) {
          this.selectedVerifier = ETH
          this.toAddress = parsedResult
          this.qrErrorMsg = ''
        } else {
          this.toAddress = ''
          this.qrErrorMsg = this.t('walletTransfer.incorrectQR')
        }
      } finally {
        this.camera = 'off'
        this.showQrScanner = false
        this.contactSelected = this.toAddress
      }
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        log.error(error)
        if (error.name === 'NotAllowedError') {
          this.qrErrorMsg = 'ERROR: you need to grant camera access permisson'
          log.error('ERROR: you need to grant camera access permisson')
        } else if (error.name === 'NotFoundError') {
          this.qrErrorMsg = 'ERROR: no camera on this device'
          log.error('ERROR: no camera on this device')
        } else if (error.name === 'NotSupportedError') {
          this.qrErrorMsg = 'ERROR: secure context required (HTTPS, localhost)'
          log.error('ERROR: secure context required (HTTPS, localhost)')
        } else if (error.name === 'NotReadableError') {
          this.qrErrorMsg = 'ERROR: is the camera already in use?'
          log.error('ERROR: is the camera already in use?')
        } else if (error.name === 'OverconstrainedError') {
          this.qrErrorMsg = 'ERROR: installed cameras are not suitable'
          log.error('ERROR: installed cameras are not suitable')
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.qrErrorMsg = 'ERROR: Stream Api Not Supported'
          log.error('ERROR: Stream Api Not Supported')
        }
      }
    },
    closeQRScanner() {
      this.camera = 'off'
      this.showQrScanner = false
    },
    setRandomId() {
      // patch fix because vuetify stopped passing attributes to underlying component
      if (this.$refs.contactSelected && this.$refs.contactSelected.$refs && this.$refs.contactSelected.$refs.input) {
        this.$refs.contactSelected.$refs.input.name = randomId()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTransfer.scss';
</style>
