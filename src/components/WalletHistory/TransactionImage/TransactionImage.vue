<template>
  <div class="transaction-image">
    <div
      class="icon-holder float-left"
      :class="{
        circle:
          [TRANSACTION_TYPES.TOKEN_METHOD_APPROVE, TRANSACTION_TYPES.DEPLOY_CONTRACT, TRANSACTION_TYPES.CONTRACT_INTERACTION].includes(
            transaction.transaction_category
          ) ||
          !(
            (transaction.type === CONTRACT_TYPE_ERC20 && transaction.actionIcon !== 'n/a') ||
            transaction.action === ACTIVITY_ACTION_TOPUP ||
            ((transaction.type === CONTRACT_TYPE_ERC721 || transaction.type === CONTRACT_TYPE_ERC1155) && transaction.actionIcon !== 'n/a') ||
            transaction.type === CONTRACT_TYPE_ETH
          ),
      }"
    >
      <v-icon
        v-if="
          [TRANSACTION_TYPES.TOKEN_METHOD_APPROVE, TRANSACTION_TYPES.DEPLOY_CONTRACT, TRANSACTION_TYPES.CONTRACT_INTERACTION].includes(
            transaction.transaction_category
          )
        "
        class="float-left"
        size="24"
        color="torusBrand1"
      >
        {{ transaction.actionIcon }}
      </v-icon>
      <img
        v-else-if="transaction.type === CONTRACT_TYPE_ERC20 && transaction.actionIcon !== 'n/a'"
        :src="`${logosUrl}/${transaction.actionIcon}`"
        :alt="`${transaction.type_name} Icon`"
        class="mr-2"
        :class="isCancel ? 'ml-0' : 'ml-2'"
        width="36"
        :onerror="`if (!this.src.includes('images/token-${isDarkMode ? 'dark' : 'light'}.svg')) this.src = '/images/token-${
          isDarkMode ? 'dark' : 'light'
        }.svg';`"
      />
      <v-icon v-else-if="transaction.type === CONTRACT_TYPE_ERC20" class="float-left" size="24" color="torusBrand1">$token</v-icon>
      <img
        v-else-if="transaction.action === ACTIVITY_ACTION_TOPUP"
        :src="require(`../../../assets/images/${transaction.actionIcon}`)"
        :alt="`${transaction.type_name} Icon`"
        class="mr-2"
        :class="isCancel ? 'ml-0' : 'ml-2'"
        width="36"
      />
      <img
        v-else-if="(transaction.type === CONTRACT_TYPE_ERC721 || transaction.type === CONTRACT_TYPE_ERC1155) && transaction.actionIcon !== 'n/a'"
        :src="transaction.actionIcon"
        class="mr-3 ml-1"
        height="36"
        large
        :alt="`${transaction.type_name} Icon`"
        onerror="if (!this.src.includes('images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
      />
      <v-icon
        v-else-if="transaction.type === CONTRACT_TYPE_ERC721 || transaction.type === CONTRACT_TYPE_ERC1155"
        class="float-left"
        size="24"
        color="torusBrand1"
      >
        $collectibles
      </v-icon>
      <img
        v-else-if="transaction.type === CONTRACT_TYPE_ETH"
        :src="`${logosUrl}/${transaction.actionIcon}`"
        height="36"
        large
        :alt="`${transaction.type_name} Icon`"
        :onerror="`if (!this.src.includes('images/token-${isDarkMode ? 'dark' : 'light'}.svg')) this.src = '/images/token-${
          isDarkMode ? 'dark' : 'light'
        }.svg';`"
        :style="{ marginRight: '16px', marginLeft: isCancel ? '0px' : '13px' }"
      />
      <v-icon v-else class="float-left" size="24" color="torusBrand1">{{ transaction.actionIcon }}</v-icon>
    </div>
    <div class="caption text_1--text d-flex" :class="{ 'font-weight-medium': !$vuetify.display.xs }">
      <span>{{ transaction.actionText }}</span>
      <v-chip
        v-if="transaction.isEtherscan && !$vuetify.display.xs"
        class="etherscan-chip"
        :class="[{ isDark: isDarkMode }, isCancel ? 'ml-0' : 'ml-2']"
        size="x-small"
      >
        {{ $vuetify.display.smAndDown ? $t('walletActivity.external') : $t('walletActivity.externalTransaction') }}
      </v-chip>
    </div>
    <div class="info text-text_2 font-weight-light">
      <span>
        {{
          transaction.action === ACTIVITY_ACTION_SEND
            ? `${$t('walletActivity.to')} ${transaction.slicedToChecksummed}`
            : `${$t('walletActivity.from')} ${transaction.slicedFromChecksummed}`
        }}
      </span>
      <v-chip v-if="transaction.isEtherscan && $vuetify.display.xs" class="etherscan-chip ml-1" :class="{ isDark: isDarkMode }" size="x-small">
        External
      </v-chip>
    </div>
  </div>
</template>

<script>
import config from '../../../config'
import {
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  TRANSACTION_TYPES,
} from '../../../utils/enums'

export default {
  props: {
    transaction: {
      type: Object,
      default() {
        return {}
      },
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ACTIVITY_ACTION_SEND,
      ACTIVITY_ACTION_TOPUP,
      CONTRACT_TYPE_ETH,
      CONTRACT_TYPE_ERC20,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
      TRANSACTION_TYPES,
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionImage.scss';
</style>
