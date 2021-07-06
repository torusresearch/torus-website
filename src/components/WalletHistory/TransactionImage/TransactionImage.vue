<template>
  <div class="transaction-image">
    <div
      class="icon-holder float-left"
      :class="{
        circle:
          [TOKEN_METHOD_APPROVE, DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(transaction.transaction_category) ||
          !(
            (transaction.type === CONTRACT_TYPE_ERC20 && transaction.actionIcon !== 'n/a') ||
            transaction.action === ACTIVITY_ACTION_TOPUP ||
            ((transaction.type === CONTRACT_TYPE_ERC721 || transaction.type === CONTRACT_TYPE_ERC1155) && transaction.actionIcon !== 'n/a') ||
            transaction.type === CONTRACT_TYPE_ETH
          ),
      }"
    >
      <v-icon
        v-if="[TOKEN_METHOD_APPROVE, DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(transaction.transaction_category)"
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
        onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
      />
      <v-icon v-else-if="transaction.type === CONTRACT_TYPE_ERC20" class="float-left" size="24" color="torusBrand1">$vuetify.icons.token</v-icon>
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
        $vuetify.icons.collectibles
      </v-icon>
      <img
        v-else-if="transaction.type === CONTRACT_TYPE_ETH"
        :src="`${logosUrl}/${transaction.actionIcon}`"
        height="36"
        large
        :alt="`${transaction.type_name} Icon`"
        onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
        :style="{ marginRight: '16px', marginLeft: isCancel ? '0px' : '13px' }"
      />
      <v-icon v-else class="float-left" size="24" color="torusBrand1">{{ transaction.actionIcon }}</v-icon>
    </div>
    <div class="caption text_1--text d-flex" :class="{ 'font-weight-medium': !$vuetify.breakpoint.xsOnly }">
      <span>{{ transaction.actionText }}</span>
      <v-chip
        v-if="transaction.isEtherscan && !$vuetify.breakpoint.xsOnly"
        class="etherscan-chip"
        :class="[{ isDark: $vuetify.theme.isDark }, isCancel ? 'ml-0' : 'ml-2']"
        x-small
      >
        {{ $vuetify.breakpoint.smAndDown ? t('walletActivity.external') : t('walletActivity.externalTransaction') }}
      </v-chip>
    </div>
    <div class="info text_2--text font-weight-light">
      <span>
        {{
          transaction.action === ACTIVITY_ACTION_SEND
            ? `${t('walletActivity.to')} ${transaction.slicedTo}`
            : `${t('walletActivity.from')} ${transaction.slicedFrom}`
        }}
      </span>
      <v-chip
        v-if="transaction.isEtherscan && $vuetify.breakpoint.xsOnly"
        class="etherscan-chip ml-1"
        :class="{ isDark: $vuetify.theme.isDark }"
        x-small
      >
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
  CONTRACT_INTERACTION_KEY,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  DEPLOY_CONTRACT_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
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
      TOKEN_METHOD_APPROVE,
      DEPLOY_CONTRACT_ACTION_KEY,
      CONTRACT_INTERACTION_KEY,
      logosUrl: config.logosUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionImage.scss';
</style>
