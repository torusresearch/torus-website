<template>
  <div>
    <v-breadcrumbs class="px-4 subtitle-1 font-weight-bold" :items="breadcrumb">
      <template v-slot:divider>
        <v-icon small>$vuetify.icons.page_next_double</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-end>
      <v-flex xs12 px-4>
        <div class="subtitle-1 text-clamp-two">
          Each badge represents a chance to win prizes up to 1ETH!
        </div>
      </v-flex>
      <v-flex class="xs12 sm6 md4 lg3 px-4 my-4" v-for="(badge, index) in badges" :key="index">
        <wallet-badge @openModal="openModal" :badge="badge" />
      </v-flex>
    </v-layout>
    <v-layout mt-4 pr-2 wrap>
      <v-spacer></v-spacer>
      <v-dialog v-model="showModalMessage" max-width="500">
        <badge-modal
          @onClose="showModalMessage = false"
          :badgeTitle="badgeTitle"
          :text="
            !isCompleted
              ? badgeTitle
              : 'You have completed all your Badges. In order to participate for the prizes we need to access your information'
          "
          :isCompleted="isCompleted"
        />
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { WalletBadge, BadgeModal } from '../../../components/WalletBadges'
export default {
  name: 'walletBadges',
  components: {
    WalletBadge,
    BadgeModal
  },
  data() {
    return {
      breadcrumb: [
        {
          text: this.t('walletHome.home'),
          disabled: true,
          exact: true,
          to: '/wallet/home'
        },
        {
          text: 'Badges',
          disabled: false,
          exact: true,
          to: '/wallet/home/adges'
        }
      ],
      showModalMessage: false,
      isCompleted: false,
      badgeTitle: '',
      badges: [
        {
          title: 'Create Torus Wallet Account',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          action: 'account',
          status: true
        },
        {
          title: 'Conduct First Transaction',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          type: 'transfer',
          status: false
        },
        {
          title: 'Top-up your wallet',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          type: 'transfer',
          status: false
        },
        {
          title: 'Log in to Augur',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          type: 'augur',
          status: false
        },
        {
          title: 'Conduct a swap on Totle',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          type: 'totle',
          status: false
        },
        {
          title: 'Use QR Code',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere nisl neque, eu rutrum dolor feugiat eu.',
          type: 'scan',
          status: false
        }
      ]
    }
  },
  created() {
    this.loadBadges()
  },
  computed: {
    // badges() {
    //   return this.$store.state.badges
    // },
  },
  methods: {
    openModal(badge) {
      this.showModalMessage = true
      this.badgeTitle = badge
    },
    loadBadges() {
      this.$store.dispatch('loadBadges')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadges.scss';
</style>
