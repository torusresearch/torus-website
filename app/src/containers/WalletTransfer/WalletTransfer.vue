<template>
  <v-layout wrap class="wallet-transfer" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
    <div class="text-black font-weight-bold headline px-4 mb-4">{{ pageHeader }}</div>
    <v-flex xs12 mb-4>
      <v-form ref="form" v-model="formValid" @submit.prevent="sendCoin" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 sm6 px-4 mb-5>
            <span class="subtitle-2">Select item</span>
            <div v-if="selectedItemDisplay">
              <v-menu transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on }">
                  <v-chip class="select-coin" label outlined large v-on="on">
                    <img
                      class="mr-2"
                      :src="
                        contractType === CONTRACT_TYPE_ERC721
                          ? selectedItemDisplay.logo
                          : require(`../../../public/images/logos/${selectedItemDisplay.logo}`)
                      "
                      height="20px"
                      onerror="if (this.src !== 'eth.svg') this.src = 'images/logos/eth.svg';"
                    />
                    <span class="select-coin-name">{{ selectedItemDisplay.name }}</span>
                    <div class="flex-grow-1 text-right pr-2">
                      <v-icon right>$vuetify.icons.select</v-icon>
                    </div>
                  </v-chip>
                </template>
                <v-list class="select-item-list">
                  <v-list-item
                    class="select-coin-eth"
                    v-for="token in finalBalancesArrayEthOnly"
                    :key="token.id"
                    @click="selectedItemChanged(token.tokenAddress)"
                  >
                    <v-list-item-icon class="mr-1">
                      <img
                        :src="require(`../../../public/images/logos/${token.logo}`)"
                        height="20px"
                        onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                      />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="body-2">{{ token.name }} ({{ token.symbol }})</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mx-3"></v-divider>
                  <v-subheader class="body-2" v-if="finalBalancesArrayTokens.length > 0">
                    <v-icon small left class="mr-2">$vuetify.icons.token</v-icon>
                    TOKENS
                  </v-subheader>
                  <v-list-item v-for="token in finalBalancesArrayTokens" :key="token.id" @click="selectedItemChanged(token.tokenAddress)">
                    <v-list-item-icon class="ml-8 mr-1">
                      <img
                        :src="require(`../../../public/images/logos/${token.logo}`)"
                        height="20px"
                        onerror="if (this.src !== 'eth.svg') this.src = 'images/logos/eth.svg';"
                      />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="body-2">{{ token.name }} ({{ token.symbol }})</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mx-3"></v-divider>
                  <v-subheader class="body-2" v-if="collectibles.length > 0">
                    <v-icon small left class="mr-2">$vuetify.icons.collectibles</v-icon>
                    COLLECTIBLES
                  </v-subheader>
                  <v-list-item v-for="collectible in collectibles" :key="collectible.address" @click="selectedItemChanged(collectible.address)">
                    <v-list-item-icon class="ml-8 mr-1">
                      <img :src="collectible.logo" height="20px" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="body-2">{{ collectible.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-flex>
          <v-flex xs12 sm6 mb-5 px-4 v-if="selectedItem">
            <span class="subtitle-2">Account Balance</span>
            <component-loader class="mt-2" v-if="!weiBalanceLoaded" />
            <div v-else>
              <span id="account-balance" class="headline mr-1">{{ selectedItem.formattedBalance }}</span>
              <span class="caption text_2--text">{{ currencyBalanceDisplay }}</span>
            </div>
            <div class="caption font-weight-regular text_2--text">{{ selectedItem.currencyRateText }}</div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 sm6 px-4>
            <v-layout wrap>
              <v-flex xs12>
                <span class="subtitle-2">Transfer Mode</span>
              </v-flex>
              <v-flex xs12 sm6 class="recipient-verifier-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'pr-1'">
                <v-select
                  id="recipient-verifier"
                  outlined
                  append-icon="$vuetify.icons.select"
                  :items="verifierOptions"
                  item-text="name"
                  item-value="value"
                  v-model="selectedVerifier"
                  @blur="verifierChangedManual"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="recipient-address-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'pl-1'">
                <v-combobox
                  id="recipient-address"
                  class="recipient-address"
                  ref="contactSelected"
                  v-model="contactSelected"
                  @keyup="contactChanged"
                  @change="contactChanged"
                  :items="contactList"
                  :placeholder="verifierPlaceholder"
                  required
                  :rules="[contactRule, rules.required]"
                  outlined
                  item-text="name"
                  item-value="value"
                  return-object
                >
                  <template v-slot:append>
                    <v-btn icon small color="primary" @click="$refs.captureQr.$el.click()">
                      <v-icon small>$vuetify.icons.scan</v-icon>
                    </v-btn>
                  </template>
                </v-combobox>
                <qrcode-capture @decode="onDecodeQr" ref="captureQr" style="display: none" />
                <div v-if="qrErrorMsg !== ''" class="v-text-field__details torus-hint">
                  <div class="v-messages">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message d-flex error--text px-3">{{ qrErrorMsg }}</div>
                    </div>
                  </div>
                </div>
              </v-flex>
              <v-flex v-if="newContact && $refs.contactSelected && $refs.contactSelected.valid" x12 mb-2>
                <add-contact :contact="contactSelected" :verifier="selectedVerifier"></add-contact>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 px-4 sm6 class="you-send-container">
            <div>
              <span class="subtitle-2">You send</span>
              <a
                id="send-all-btn"
                class="float-right primary--text subtitle-2"
                v-if="contractType !== CONTRACT_TYPE_ERC721 && !isSendAll"
                @click="sendAll"
              >
                Send All
              </a>
              <a id="send-all-reset-btn" class="float-right primary--text subtitle-2" v-if="isSendAll" @click="resetSendAll">Reset</a>
            </div>
            <v-select
              v-if="contractType === CONTRACT_TYPE_ERC721"
              v-model="assetSelected"
              :items="collectibleSelected.assets"
              outlined
              item-text="name"
              append-icon="$vuetify.icons.select"
              return-object
            >
              <template v-slot:prepend-inner>
                <img :src="assetSelected.image" height="24px" />
              </template>
              <template v-slot:item="{ item }">
                <img class="mr-2" :src="item.image" height="24px" />
                {{ item.name }}
              </template>
            </v-select>
            <v-text-field
              v-if="contractType !== CONTRACT_TYPE_ERC721"
              id="you-send"
              :hint="convertedAmount ? `~ ${convertedAmount} ${!!toggle_exclusive ? selectedItem.symbol : selectedCurrency}` : ''"
              persistent-hint
              type="number"
              outlined
              required
              v-model="displayAmount"
              :readonly="isSendAll"
              :rules="[rules.required, lesserThan, moreThanZero]"
            >
              <template v-slot:append>
                <v-btn
                  small
                  id="coin-mode-btn"
                  :outlined="!toggle_exclusive"
                  :text="!!toggle_exclusive"
                  :color="!toggle_exclusive ? 'primary' : 'text_2'"
                  @click="changeSelectedToCurrency(0)"
                >
                  {{ selectedItem && selectedItem.symbol }}
                </v-btn>
                <v-btn
                  small
                  id="currency-mode-btn"
                  :outlined="!!toggle_exclusive"
                  :text="!toggle_exclusive"
                  :color="toggle_exclusive ? 'primary' : 'text_2'"
                  @click="changeSelectedToCurrency(1)"
                >
                  {{ selectedCurrency }}
                </v-btn>
              </template>
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <TransactionSpeedSelect
            :resetSpeed="resetSpeed"
            :symbol="contractType !== CONTRACT_TYPE_ERC721 ? selectedItem.symbol : 'ETH'"
            :gas="gas"
            :displayAmount="displayAmount"
            @onSelectSpeed="onSelectSpeed"
          />
        </v-layout>
        <v-layout wrap v-if="contractType !== CONTRACT_TYPE_ERC721">
          <v-flex xs12 px-4 sm6>
            <div>
              <span class="subtitle-2">Total Cost</span>
            </div>
            <v-text-field
              id="total-cost"
              :suffix="totalCostSuffix"
              :hint="convertedTotalCost ? convertedTotalCostDisplay : ''"
              persistent-hint
              outlined
              readonly
              :value="totalCost"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout mt-4 wrap>
          <v-flex xs12 px-4 sm6 class="text-right">
            <v-dialog v-model="confirmDialog" max-width="550" persistent>
              <template v-slot:activator="{ on }">
                <v-btn
                  large
                  depressed
                  color="primary"
                  :disabled="!formValid || speedSelected === ''"
                  class="px-6"
                  id="wallet-transfer-submit"
                  v-on="on"
                >
                  Transfer
                </v-btn>
              </template>
              <transfer-confirm
                :toAddress="toAddress"
                :convertedAmount="
                  convertedAmount
                    ? `~ ${convertedAmount} ${
                        !!toggle_exclusive ? (contractType === CONTRACT_TYPE_ERC721 ? '' : selectedItem.symbol) : selectedCurrency
                      }`
                    : ''
                "
                :displayAmount="
                  `${displayAmount} ${!toggle_exclusive ? (contractType === CONTRACT_TYPE_ERC721 ? '' : selectedItem.symbol) : selectedCurrency}`
                "
                :speedSelected="timeTaken"
                :transactionFee="gasPriceInCurrency"
                :selectedCurrency="selectedCurrency"
                @onClose="confirmDialog = false"
                @onConfirm="sendCoin"
              ></transfer-confirm>
            </v-dialog>
          </v-flex>
        </v-layout>

        <v-layout mt-4 pr-2 wrap>
          <v-spacer></v-spacer>
          <v-dialog v-model="showModalMessage" max-width="500" persistent>
            <message-modal
              @onClose="showModalMessage = false"
              :modal-type="modalMessageSuccess"
              :title="modalMessageSuccess ? 'Your transfer is being processed' : 'Your transfer cannot be processed'"
              :detail-text="modalMessageSuccess ? `Your transaction will be completed in approximately ${timeTaken} min` : 'Please try again later'"
            />
          </v-dialog>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { QrcodeCapture } from 'vue-qrcode-reader'
import { isAddress, toChecksumAddress, toBN, toWei } from 'web3-utils'
import torus from '../../torus'
import { significantDigits, getRandomNumber, getEtherScanHashLink, validateVerifierId } from '../../utils/utils'
import config from '../../config'
import { nodeDetails } from '../../config'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import ComponentLoader from '../../components/helpers/ComponentLoader'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import AddContact from '../../components/WalletTransfer/AddContact'
import TransferConfirm from '../../components/Confirm/TransferConfirm'
import { get, post } from '../../utils/httpHelpers'
import log from 'loglevel'
import {
  WALLET_HEADERS_TRANSFER,
  GOOGLE,
  REDDIT,
  DISCORD,
  ETH,
  ETH_LABEL,
  GOOGLE_LABEL,
  REDDIT_LABEL,
  DISCORD_LABEL,
  CONTRACT_TYPE_ETH,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  OLD_ERC721_LIST,
  ALLOWED_VERIFIERS
} from '../../utils/enums'

const erc20TransferABI = require('human-standard-token-abi')
const erc721TransferABI = require('human-standard-collectible-abi')

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  components: {
    TransactionSpeedSelect,
    MessageModal,
    QrcodeCapture,
    AddContact,
    ComponentLoader,
    TransferConfirm
  },
  data() {
    return {
      pageHeader: WALLET_HEADERS_TRANSFER,
      contractType: CONTRACT_TYPE_ETH,
      isContract: false,
      collectibleSelected: {},
      assetSelected: {},
      tokenAddress: '0x',
      amount: 0,
      displayAmount: '',
      convertedAmount: '',
      contactSelected: '',
      toAddress: '',
      formValid: false,
      toggle_exclusive: 0,
      gas: 21000,
      activeGasPrice: '',
      gasPriceInCurrency: '',
      isFastChecked: false,
      speedSelected: '',
      totalCost: '',
      timeTaken: '',
      convertedTotalCost: '',
      resetSpeed: false,
      qrErrorMsg: '',
      autoSelectVerifier: true,
      selectedVerifier: '',
      verifierOptions: ALLOWED_VERIFIERS,
      rules: {
        required: value => !!value || 'Required'
      },
      showModalMessage: false,
      modalMessageSuccess: null,
      isSendAll: false,
      confirmDialog: false,
      CONTRACT_TYPE_ETH,
      CONTRACT_TYPE_ERC20,
      CONTRACT_TYPE_ERC721
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    currentEthBalance() {
      return this.$store.state.weiBalance[this.$store.state.selectedAddress]
    },
    finalBalancesArray() {
      return this.$store.getters.tokenBalances.finalBalancesArray || []
    },
    finalBalancesArrayTokens() {
      return this.$store.getters.tokenBalances.finalBalancesArray.filter(token => token.tokenAddress !== '0x') || []
    },
    finalBalancesArrayEthOnly() {
      return this.$store.getters.tokenBalances.finalBalancesArray.filter(token => token.tokenAddress === '0x') || []
    },
    weiBalanceLoaded() {
      return this.$store.state.weiBalanceLoaded
    },
    collectibles() {
      return this.$store.getters.collectibleBalances
    },
    selectedItem() {
      let foundElement = this.finalBalancesArray.find(x => x.tokenAddress === this.selectedTokenAddress)
      return foundElement
    },
    selectedItemDisplay() {
      if (this.contractType !== CONTRACT_TYPE_ERC721) return this.selectedItem

      const foundContract = this.collectibles.find(x => x.address === this.collectibleSelected.address)
      return foundContract
    },
    selectedTokenAddress() {
      if (this.tokenAddress === '0x' || !isAddress(this.tokenAddress)) return '0x'
      return toChecksumAddress(this.tokenAddress)
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    getCurrencyTokenRate() {
      const { tokenRates } = this.$store.state
      const currencyMultiplier = this.getCurrencyMultiplier
      let tokenRateMultiplier = 1
      if (this.contractType === CONTRACT_TYPE_ERC20) tokenRateMultiplier = tokenRates[this.selectedTokenAddress.toLowerCase()] || 0
      return currencyMultiplier * tokenRateMultiplier
    },
    gasDisplayString() {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * this.fastGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `${significantDigits(currencyFee)} ${this.selectedCurrency} / ${significantDigits(ethFee)} ETH`
    },
    fastGasDisplayString() {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * this.fastestGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `Faster with ${significantDigits(currencyFee)} ${this.selectedCurrency} / ${significantDigits(ethFee)} ETH`
    },
    remainingBalanceString() {
      if (this.selectedItem) return `${this.selectedItem.currencyBalance} / ${this.selectedItem.formattedBalance}`
      return ''
    },
    convertedTotalCostDisplay() {
      return `~ ${significantDigits(this.convertedTotalCost)} ${this.selectedCurrency}`
    },
    currencyBalanceDisplay() {
      // = 390.00 USD
      // USD 4,138.16
      const getNumber = this.selectedItem.currencyBalance.split(' ')[1].replace(',', '')
      return `= ${getNumber} ${this.selectedCurrency}`
    },
    totalCostSuffix() {
      return this.contractType === CONTRACT_TYPE_ETH ? (this.toggle_exclusive === 0 ? this.selectedItem.symbol : this.selectedCurrency) : ''
    },
    verifierPlaceholder() {
      return this.selectedVerifier ? `Enter ${this.verifierOptions.find(verifier => verifier.value === this.selectedVerifier).name}` : ''
    },
    contactList() {
      return this.$store.state.contacts.reduce((mappedObj, contact) => {
        if (contact.verifier === this.selectedVerifier) {
          mappedObj.push({
            name: `${contact.name} (${contact.contact})`,
            value: contact.contact
          })
        }
        return mappedObj
      }, [])
    },
    newContact() {
      if (!this.contactSelected) return false

      const targetContact = typeof this.contactSelected === 'string' ? this.contactSelected : this.contactSelected.value
      const addressFound = this.contactList.find(contact => contact.value.toLowerCase() === targetContact.toLowerCase())
      return addressFound === undefined
    }
  },
  watch: {
    displayAmount: function(newValue, oldValue) {
      if (this.toggle_exclusive === 0) {
        this.amount = this.displayAmount
      } else {
        this.amount = this.getCurrencyTokenRate > 0 ? this.displayAmount / this.getCurrencyTokenRate : this.displayAmount * this.getCurrencyTokenRate
      }

      this.convertedAmount = this.toggle_exclusive
        ? significantDigits(this.displayAmount / this.getCurrencyTokenRate)
        : significantDigits(this.displayAmount * this.getCurrencyTokenRate)

      this.updateTotalCost()
    }
  },
  methods: {
    updateFieldsBasedOnRoute() {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'contract')) {
        this.selectedItemChanged(
          this.$route.query.contract,
          Object.prototype.hasOwnProperty.call(this.$route.query, 'asset') ? this.$route.query.asset : ''
        )
      } else {
        this.toAddress = ''
      }
    },
    sendEmail(typeToken, transactionHash) {
      if (/\S+@\S+\.\S+/.test(this.toAddress)) {
        const etherscanLink = getEtherScanHashLink(transactionHash, this.$store.state.networkType.host)
        const emailObject = {
          from_name: this.$store.state.userInfo.name,
          to_email: this.toAddress,
          total_amount: this.amount.toString(),
          token: typeToken.toString(),
          etherscanLink: etherscanLink
        }
        post(config.api + '/transaction/sendemail', emailObject, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.jwtToken,
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
          .then(response => log.info('email response', response))
          .catch(err => log.error(err))
      }
    },
    moreThanZero(value) {
      if (this.selectedItem) {
        return parseFloat(value) > 0 || 'Invalid amount'
      }
      return ''
    },
    lesserThan(value) {
      if (this.selectedItem) {
        let amount = value
        if (this.toggle_exclusive === 1) {
          amount = amount / this.getCurrencyTokenRate
        }
        return parseFloat(amount) <= this.selectedItem.computedBalance || 'Insufficient balance for transaction'
      }
      return ''
    },
    contactRule(contact) {
      const value = contact === null ? '' : typeof contact === 'string' ? contact : contact.value
      return validateVerifierId(this.selectedVerifier, value)
    },
    verifierChangedManual() {
      this.autoSelectVerifier = false
      this.verifierChanged()
    },
    verifierChanged() {
      this.$refs.form.validate()
    },
    contactChanged(event) {
      const contact = event && event.target ? event.target.value : event
      log.info(event, 'contactChanged')
      if (contact) this.toAddress = typeof contact === 'string' ? contact : contact.value

      // Autoupdate selected verifier
      if (this.autoSelectVerifier) {
        if (/^0x/.test(this.toAddress)) {
          this.selectedVerifier = ETH
          this.verifierChanged()
        } else if (/@/.test(this.toAddress)) {
          this.selectedVerifier = GOOGLE
          this.verifierChanged()
        }
      }
    },
    async calculateGas(toAddress) {
      if (isAddress(toAddress)) {
        return new Promise((resolve, reject) => {
          if (this.contractType === CONTRACT_TYPE_ETH) {
            torus.web3.eth
              .estimateGas({ to: toAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                log.error(err)
                resolve(0)
              })
          } else if (this.contractType === CONTRACT_TYPE_ERC20) {
            const selectedAddress = this.$store.state.selectedAddress
            const value = Math.floor(parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString()
            this.getTransferMethod(this.contractType, selectedAddress, toAddress, value)
              .estimateGas({ from: selectedAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                log.error(err)
                resolve(0)
              })
          } else if (this.contractType === CONTRACT_TYPE_ERC721) {
            const selectedAddress = this.$store.state.selectedAddress
            this.getTransferMethod(this.contractType, selectedAddress, toAddress, this.assetSelected.tokenId)
              .estimateGas({ from: selectedAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                log.error(err)
                resolve(0)
              })
          }
        })
      } else {
        return 21000
      }
    },
    getTransferMethod(contractType, selectedAddress, toAddress, value) {
      // For support of older ERC721
      if (OLD_ERC721_LIST.includes(this.selectedTokenAddress.toLowerCase()) || contractType === CONTRACT_TYPE_ERC20) {
        const contractInstance = new torus.web3.eth.Contract(erc20TransferABI, this.selectedTokenAddress)
        return contractInstance.methods.transfer(toAddress, value)
      } else if (contractType === CONTRACT_TYPE_ERC721) {
        const contractInstance = new torus.web3.eth.Contract(erc721TransferABI, this.selectedTokenAddress)
        return contractInstance.methods.safeTransferFrom(selectedAddress, toAddress, value)
      }
    },
    async selectedItemChanged(address, tokenId) {
      const foundInBalances = this.finalBalancesArray.find(token => token.tokenAddress.toLowerCase() === address.toLowerCase())
      const foundInCollectibles = this.collectibles.find(token => token.address.toLowerCase() === address.toLowerCase())
      if (foundInBalances) {
        this.tokenAddress = foundInBalances.tokenAddress
        this.contractType = foundInBalances.erc20 ? CONTRACT_TYPE_ERC20 : CONTRACT_TYPE_ETH
        this.collectibleSelected = ''
        this.assetSelected = ''
      } else if (foundInCollectibles) {
        this.tokenAddress = foundInCollectibles.address
        this.contractType = CONTRACT_TYPE_ERC721
        this.collectibleSelected = foundInCollectibles
        if (foundInCollectibles.assets && foundInCollectibles.assets.length > 0) {
          this.assetSelected = tokenId
            ? foundInCollectibles.assets.find(asset => asset.tokenId.toString() === tokenId.toString()) || foundInCollectibles.assets[0]
            : foundInCollectibles.assets[0]
        }
        // Reset you send
        this.resetSendAll()
      }
      this.gas = await this.calculateGas(this.toAddress)
      this.updateTotalCost()
    },
    changeSelectedToCurrency(value) {
      this.toggle_exclusive = value
      const currencyRate = this.getCurrencyTokenRate
      if (value === 0) {
        this.displayAmount = this.displayAmount / currencyRate
      } else if (value === 1) {
        this.displayAmount = this.displayAmount * currencyRate
      }
    },
    sendAll() {
      const ethBalance = this.selectedItem.computedBalance
      const currencyBalance = ethBalance * this.getCurrencyTokenRate
      const ethGasPrice = this.getEthAmount(this.gas, this.activeGasPrice)
      const currencyGasPrice = ethGasPrice * this.getCurrencyTokenRate

      this.isSendAll = true

      if (this.toggle_exclusive === 0) {
        this.displayAmount = ethBalance - ethGasPrice
      } else {
        this.displayAmount = currencyBalance - currencyGasPrice
      }
    },
    resetSendAll() {
      this.displayAmount = ''
      this.resetSpeed = true
      this.isSendAll = false
      this.changeSelectedToCurrency(0)
    },
    async sendCoin() {
      if (this.$refs.form.validate()) {
        const fastGasPrice = toBN((this.activeGasPrice * 10 ** 9).toString())
        let toAddress
        log.info(this.toAddress, this.selectedVerifier)
        if (isAddress(this.toAddress)) {
          toAddress = toChecksumAddress(this.toAddress)
        } else {
          const endPointNumber = getRandomNumber(nodeDetails.torusNodeEndpoints.length)
          try {
            toAddress = await torus.getPubKeyAsync(nodeDetails.torusNodeEndpoints[endPointNumber], {
              verifier: this.selectedVerifier,
              verifierId: this.toAddress
            })
          } catch (err) {
            log.error(err)
            let newEndPointNumber = endPointNumber
            while (newEndPointNumber === endPointNumber) {
              newEndPointNumber = getRandomNumber(nodeDetails.torusNodeEndpoints.length)
            }
            toAddress = await torus.getPubKeyAsync(nodeDetails.torusNodeEndpoints[newEndPointNumber], {
              verifier: this.selectedVerifier,
              verifierId: this.toAddress
            })
          }
        }
        this.gas = await this.calculateGas(toAddress)
        const selectedAddress = this.$store.state.selectedAddress
        if (this.contractType === CONTRACT_TYPE_ETH) {
          log.info('TX SENT: ', {
            from: selectedAddress,
            to: toAddress,
            value: toWei(parseFloat(this.amount.toString()).toFixed(18)),
            gas: this.gas === 0 ? undefined : this.gas.toString(),
            gasPrice: fastGasPrice
          })
          torus.web3.eth.sendTransaction(
            {
              from: selectedAddress,
              to: toAddress,
              value: toWei(parseFloat(this.amount.toString()).toFixed(18)),
              gas: this.gas === 0 ? undefined : this.gas.toString(),
              gasPrice: fastGasPrice
            },
            (err, transactionHash) => {
              if (err) {
                const regEx = new RegExp('User denied transaction signature', 'i')
                if (!err.message.match(regEx)) {
                  this.showModalMessage = true
                  this.modalMessageSuccess = false
                }
                log.error(err)
              } else {
                // Send email to the user
                this.sendEmail(this.selectedItem.symbol, transactionHash)

                this.showModalMessage = true
                this.modalMessageSuccess = true
              }
            }
          )
        } else if (this.contractType === CONTRACT_TYPE_ERC20) {
          const value = Math.floor(parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString()
          this.getTransferMethod(this.contractType, selectedAddress, toAddress, value).send(
            {
              from: selectedAddress,
              gas: this.gas === 0 ? undefined : this.gas.toString(),
              gasPrice: fastGasPrice
            },
            (err, transactionHash) => {
              if (err) {
                const regEx = new RegExp('User denied transaction signature', 'i')
                if (!err.message.match(regEx)) {
                  this.showModalMessage = true
                  this.modalMessageSuccess = false
                }
                log.error(err)
              } else {
                // Send email to the user
                this.sendEmail(this.selectedItem.symbol, transactionHash)

                this.showModalMessage = true
                this.modalMessageSuccess = true
              }
            }
          )
        } else if (this.contractType === CONTRACT_TYPE_ERC721) {
          this.getTransferMethod(this.contractType, selectedAddress, toAddress, this.assetSelected.tokenId).send(
            {
              from: selectedAddress,
              gas: this.gas === 0 ? undefined : this.gas.toString(),
              gasPrice: fastGasPrice
            },
            (err, transactionHash) => {
              if (err) {
                const regEx = new RegExp('User denied transaction signature', 'i')
                if (!err.message.match(regEx)) {
                  this.showModalMessage = true
                  this.modalMessageSuccess = false
                }
                log.error(err)
              } else {
                // Send email to the user
                this.sendEmail(this.assetSelected.name, transactionHash)
                this.showModalMessage = true
                this.modalMessageSuccess = true
              }
            }
          )
        }
      }
    },
    getGasDisplayString(fastGasPrice) {
      const currencyFee = this.getGasAmount(fastGasPrice)
      return `${significantDigits(currencyFee)} ${this.selectedCurrency}`
    },
    getGasAmount(fastGasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.getEthAmount(this.gas, fastGasPrice)
      const currencyFee = ethFee * currencyMultiplier

      return currencyFee
    },
    getEthAmount(gas, gasPrice) {
      return gas * gasPrice * 10 ** -9
    },
    goBack() {
      this.$router.go(-1)
    },
    getGasSpeed() {
      if (this.speedSelected === 'average') {
        return this.averageGasPriceSpeed
      } else if (this.speedSelected === 'fast') {
        return this.fastGasPriceSpeed
      } else if (this.speedSelected === 'fastest') {
        return this.fastestGasPriceSpeed
      }
    },
    updateTotalCost() {
      if (!this.displayAmount || this.activeGasPrice === '') {
        this.totalCost = ''
        this.convertedTotalCost = ''

        if (this.activeGasPrice !== '') {
          const gasPriceInEth = this.getEthAmount(this.gas, parseFloat(this.activeGasPrice))
          this.gasPriceInCurrency = gasPriceInEth * this.getCurrencyTokenRate
        }
        return
      }

      this.totalCost = ''
      this.convertedTotalCost = ''

      // Updated you send value if send all
      if (this.isSendAll) {
        this.sendAll()
      }

      const gasPriceInEth = this.getEthAmount(this.gas, this.activeGasPrice)
      const gasPriceInCurrency = gasPriceInEth * this.getCurrencyTokenRate
      const toSend = parseFloat(this.amount)
      const toSendConverted = toSend * this.getCurrencyTokenRate

      this.gasPriceInCurrency = gasPriceInCurrency

      if (this.contractType === CONTRACT_TYPE_ETH) {
        this.totalCost = this.toggle_exclusive === 0 ? toSend + gasPriceInEth : toSendConverted + gasPriceInCurrency
      } else if (this.contractType === CONTRACT_TYPE_ERC20) {
        const displayedCurrency = this.toggle_exclusive === 0 ? this.selectedItem.symbol : this.selectedCurrency
        this.totalCost = `${this.displayAmount} ${displayedCurrency} + ${significantDigits(
          this.getEthAmount(this.gas, this.activeGasPrice),
          false,
          5
        )} ETH`
      }

      this.convertedTotalCost = gasPriceInCurrency + toSendConverted
    },
    onSelectSpeed(data) {
      log.info('SET DATA: ', data)
      this.speedSelected = data.speedSelected
      this.activeGasPrice = data.activeGasPrice
      this.timeTaken = data.speed
      this.gas = data.gas

      if (data.isReset) {
        this.activeGasPrice = this.speedSelected === '' ? '' : this.activeGasPrice
        this.calculateGas()
      }

      this.updateTotalCost()

      this.resetSpeed = false
    },
    onDecodeQr(result) {
      try {
        const qrUrl = new URL(result)
        const qrParams = new URLSearchParams(qrUrl.search)
        if (qrParams.has('to')) {
          this.selectedVerifier = ETH
          this.toAddress = qrParams.get('to')
        } else {
          this.toAddress = ''
          this.qrErrorMsg = 'Incorrect QR Code'
        }

        this.contactSelected = this.toAddress
      } catch (error) {
        if (isAddress(result)) {
          this.selectedVerifier = ETH
          this.toAddress = result
        } else {
          this.toAddress = ''
          this.qrErrorMsg = 'Incorrect QR Code'
        }

        this.contactSelected = this.toAddress
      }
    }
  },
  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'to')) {
      this.selectedVerifier = ETH
      this.toAddress = this.$route.query.to
    } else {
      this.toAddress = ''
    }

    this.contactSelected = this.toAddress

    const collectiblesUnwatch = this.$watch('collectibles', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateFieldsBasedOnRoute()
      }
    })

    const tokensUnwatch = this.$watch('finalBalancesArray', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateFieldsBasedOnRoute()
        tokensUnwatch()
      }
    })

    this.updateFieldsBasedOnRoute()
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTransfer.scss';
</style>
