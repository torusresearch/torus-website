<template>
  <v-layout wrap class="wallet-transfer" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
    <div class="text-black font-weight-bold headline px-4 mb-4">{{ pageHeader }}</div>
    <v-flex xs12 mb-4>
      <v-form ref="form" v-model="formValid" @submit.prevent="sendCoin" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 px-4 mb-5 sm6>
            <span class="subtitle-2">Select your Coin</span>
            <v-select
              id="select-coin"
              class="select-coin-container"
              append-icon="$vuetify.icons.select"
              hide-details
              :items="finalBalancesArray"
              :value="selectedItem"
              @change="selectedItemChanged"
              item-text="name"
              item-value="tokenAddress"
              outlined
            >
              <template v-slot:prepend-inner>
                <img
                  :src="require(`../../../public/images/logos/${selectedItem.logo}`)"
                  height="24px"
                  onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                />
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 sm6 mb-5 px-4 v-if="selectedItem">
            <span class="subtitle-2">Account Balance</span>
            <div>
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
                  @change="$refs.form.validate()"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 class="recipient-address-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'pl-1'">
                <v-text-field
                  class="recipient-address"
                  id="recipient-address"
                  ref="recipientAddress"
                  v-model="toAddress"
                  :placeholder="verifierPlaceholder"
                  required
                  :rules="[toAddressRule, rules.required]"
                  outlined
                  autocomplete="ThisIsASampleAutocomplete"
                  @keyup="qrErrorMsg = ''"
                >
                  <template v-slot:append>
                    <v-btn icon small color="primary" @click="$refs.captureQr.$el.click()">
                      <v-icon small>$vuetify.icons.scan</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                <qrcode-capture @decode="onDecodeQr" ref="captureQr" style="display: none" />
                <div v-if="qrErrorMsg !== ''" class="v-text-field__details torus-hint">
                  <div class="v-messages">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message d-flex error--text px-3">{{ qrErrorMsg }}</div>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 px-4 sm6 class="you-send-container">
            <div>
              <span class="subtitle-2">You send</span>
              <a id="send-all-btn" class="float-right primary--text subtitle-2" v-if="!isSendAll" @click="sendAll">Send All</a>
              <a id="send-all-reset-btn" class="float-right primary--text subtitle-2" v-if="isSendAll" @click="resetSendAll">Reset</a>
            </div>
            <v-text-field
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
            :symbol="selectedItem.symbol"
            :gas="gas"
            :displayAmount="displayAmount"
            @onSelectSpeed="onSelectSpeed"
          />
        </v-layout>
        <v-layout wrap>
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
            <v-btn
              large
              depressed
              color="primary"
              :disabled="!formValid || speedSelected === ''"
              class="px-6"
              type="submit"
              id="wallet-transfer-submit"
            >
              Transfer
            </v-btn>
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
import torus from '../../torus'
import { significantDigits, getRandomNumber, getEtherScanHashLink } from '../../utils/utils'
import config from '../../config'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import { get, post } from '../../utils/httpHelpers'
import log from 'loglevel'
import { WALLET_HEADERS_TRANSFER, GOOGLE, REDDIT, DISCORD, ETH, ETH_LABEL, GOOGLE_LABEL, REDDIT_LABEL, DISCORD_LABEL } from '../../utils/enums'

const { torusNodeEndpoints } = config
const transferABI = require('human-standard-token-abi')

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  props: ['address'],
  components: {
    TransactionSpeedSelect,
    MessageModal,
    QrcodeCapture
  },
  data() {
    return {
      pageHeader: WALLET_HEADERS_TRANSFER,
      tokenAddress: '0x',
      amount: 0,
      displayAmount: '',
      convertedAmount: '',
      toAddress: '',
      formValid: false,
      toggle_exclusive: 0,
      gas: 21000,
      activeGasPrice: '',
      isFastChecked: false,
      speedSelected: '',
      totalCost: '',
      timeTaken: '',
      convertedTotalCost: '',
      resetSpeed: false,
      qrErrorMsg: '',
      selectedVerifier: ETH,
      verifierOptions: [
        {
          name: ETH_LABEL,
          value: ETH
        },
        {
          name: GOOGLE_LABEL,
          value: GOOGLE
        },
        {
          name: REDDIT_LABEL,
          value: REDDIT
        },
        {
          name: DISCORD_LABEL,
          value: DISCORD
        }
      ],
      rules: {
        required: value => !!value || 'Required'
      },
      showModalMessage: false,
      modalMessageSuccess: null,
      isSendAll: false
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
    selectedItem() {
      const foundElement = this.finalBalancesArray.find(x => x.tokenAddress === this.selectedTokenAddress)
      return foundElement
    },
    selectedTokenAddress() {
      if (this.tokenAddress === '0x' || !torus.web3.utils.isAddress(this.tokenAddress)) return '0x'
      return torus.web3.utils.toChecksumAddress(this.tokenAddress)
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
      if (this.selectedTokenAddress !== '0x') tokenRateMultiplier = tokenRates[this.selectedTokenAddress.toLowerCase()] || 0
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
      return this.selectedTokenAddress === '0x' ? (this.toggle_exclusive === 0 ? this.selectedItem.symbol : this.selectedCurrency) : ''
    },
    verifierPlaceholder() {
      return `Enter ${this.verifierOptions.find(verifier => verifier.value === this.selectedVerifier).name}`
    }
  },
  watch: {
    toAddress: async function(newValue, oldValue) {
      if (newValue !== oldValue) this.gas = await this.calculateGas(newValue)
    },
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
    sendEmail(typeToken, transactionHash) {
      if (/\S+@\S+\.\S+/.test(this.toAddress)) {
        const etherscanLink = getEtherScanHashLink(transactionHash, this.$store.state.networkType.host)
        const emailObject = {
          from_name: this.$store.state.userInfo.name,
          to_email: this.toAddress,
          total_amount: this.amount,
          token: typeToken,
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
    toAddressRule(value) {
      if (this.selectedVerifier === ETH) {
        return torus.web3.utils.isAddress(value) || 'Invalid ETH Address'
      } else if (this.selectedVerifier === GOOGLE) {
        return (
          // eslint-disable-next-line max-len
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || 'Invalid Email Address'
        )
      } else if (this.selectedVerifier === REDDIT) {
        return (/[\w-]+/.test(value) && !/\s/.test(value) && value.length >= 3 && value.length <= 20) || 'Invalid reddit username'
      } else if (this.selectedVerifier === DISCORD) {
        return (/^[0-9]*$/.test(value) && value.length === 18) || 'Invalid Discord ID'
      }

      return true
    },
    async calculateGas(toAddress) {
      if (torus.web3.utils.isAddress(toAddress)) {
        return new Promise((resolve, reject) => {
          if (this.selectedTokenAddress === '0x') {
            torus.web3.eth
              .estimateGas({ to: toAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                log.error(err)
                resolve(MAX_GAS)
              })
          } else {
            const selectedAddress = this.$store.state.selectedAddress
            const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
            const value = Math.floor(parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString()
            contractInstance.methods
              .transfer(toAddress, value)
              .estimateGas({ from: selectedAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                log.error(err)
                resolve(MAX_GAS)
              })
          }
        })
      } else {
        return 21000
      }
    },
    async selectedItemChanged(tokenAddress) {
      this.tokenAddress = tokenAddress
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
        const fastGasPrice = torus.web3.utils.toBN((this.activeGasPrice * 10 ** 9).toString())
        let toAddress
        if (torus.web3.utils.isAddress(this.toAddress)) {
          toAddress = torus.web3.utils.toChecksumAddress(this.toAddress)
        } else {
          const endPointNumber = getRandomNumber(torusNodeEndpoints.length)
          try {
            toAddress = await torus.getPubKeyAsync(torusNodeEndpoints[endPointNumber], {
              verifier: this.selectedVerifier,
              verifierId: this.toAddress
            })
          } catch (err) {
            log.error(err)
            let newEndPointNumber = endPointNumber
            while (newEndPointNumber === endPointNumber) {
              newEndPointNumber = getRandomNumber(torusNodeEndpoints.length)
            }
            toAddress = await torus.getPubKeyAsync(torusNodeEndpoints[newEndPointNumber], {
              verifier: this.selectedVerifier,
              verifierId: this.toAddress
            })
          }
        }
        this.gas = await this.calculateGas(toAddress)
        const selectedAddress = this.$store.state.selectedAddress
        if (this.selectedTokenAddress === '0x') {
          log.info('TX SENT: ', {
            from: selectedAddress,
            to: toAddress,
            value: torus.web3.utils.toWei(parseFloat(this.amount.toString()).toFixed(18)),
            gas: this.gas.toString(),
            gasPrice: fastGasPrice
          })
          torus.web3.eth.sendTransaction(
            {
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(parseFloat(this.amount.toString()).toFixed(18)),
              gas: this.gas.toString(),
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
        } else {
          const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
          const value = Math.floor(parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString()
          contractInstance.methods.transfer(toAddress, value).send(
            {
              from: selectedAddress,
              gas: this.gas.toString(),
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

      if (this.selectedTokenAddress === '0x') {
        this.totalCost = this.toggle_exclusive === 0 ? toSend + gasPriceInEth : toSendConverted + gasPriceInCurrency
      } else {
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
      } catch (error) {
        if (torus.web3.utils.isAddress(result)) {
          this.selectedVerifier = ETH
          this.toAddress = result
        } else {
          this.toAddress = ''
          this.qrErrorMsg = 'Incorrect QR Code'
        }
      }
    }
  },
  created() {
    this.tokenAddress = this.address
    if (this.$route.query.hasOwnProperty('to')) {
      this.selectedVerifier = ETH
      this.toAddress = this.$route.query.to
    } else {
      this.toAddress = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTransfer.scss';
</style>
