<template>
  <div>
    <v-layout>
      <v-breadcrumbs class="px-4 subtitle-1 font-weight-bold" :items="breadcrumb">
        <template v-slot:divider>
          <v-icon small>$vuetify.icons.page_next_double</v-icon>
        </template>
      </v-breadcrumbs>
    </v-layout>
    <v-layout wrap>
      <v-flex xs6 px-4>
        <div class="subtitle-1 text-clamp-two">
          Each badge represents a chance to win prizes up to 1ETH!
        </div>
      </v-flex>
      <v-flex xs6 class="text-end">
        <div class="track">
          <HelpTooltip :title="t('walletTransfer.transferFee')" :description="t('walletTransfer.transferFeeDesc')" />
          <span>Track Badges</span>
          <v-switch color="primary" v-model="trackBadge" @change="checkTrackStatus" class="mx-2"></v-switch>
        </div>
      </v-flex>
      <v-flex class="xs12 sm6 md4 lg3 px-4 my-4" v-for="(badge, index) in badges" :key="index">
        <wallet-badge @openModal="showBadgeModal" :badge="badge" :lastBadgeIndex="badges.length" :index="index" />
      </v-flex>
      <v-layout justify-center py-12>
        <v-flex text-center xs4>
          <badge-submit :enabled="enableScoreCard"></badge-submit>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout mt-4 pr-2 wrap>
      <v-spacer></v-spacer>
      <v-dialog v-model="showModalMessage" max-width="100">
        <badge-modal @onClose="closeModal" :isCompleted="isCompleted" :badge="badge" />
      </v-dialog>
    </v-layout>
    <v-layout mt-4 pr-2 wrap>
      <v-spacer></v-spacer>
      <v-dialog v-model="showActionModal" max-width="500">
        <badge-consent-modal @onConfirm="updateTrackBadge" @onClose="closeActionModal" />
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { WalletBadge, BadgeModal, BadgeSubmit, BadgeConsentModal } from '../../../components/WalletBadges'
import HelpTooltip from '../../../components/helpers/HelpTooltip'
export default {
  name: 'walletBadges',
  components: {
    WalletBadge,
    BadgeModal,
    BadgeSubmit,
    BadgeConsentModal,
    HelpTooltip
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
          to: '/wallet/home/badges'
        }
      ],
      showModalMessage: false,
      showActionModal: false,
      isCompleted: false,
      badge: {},
      trackBadge: false
    }
  },
  created() {
    this.loadBadges()
  },
  computed: {
    badges() {
      let badges = []
      this.$store.state.badges.filter(badge => {
        if (this.$store.state.myBadges.map(myBadge => myBadge.badgeId).includes(badge.id)) {
          badges.push({
            ...badge,
            isCompleted: true
          })
        } else {
          badges.push({
            ...badge,
            isCompleted: false
          })
        }
      })
      return badges
    },
    enableScoreCard() {
      return this.$store.state.myBadges.length > 8
    }
  },
  methods: {
    closeActionModal() {
      this.showActionModal = false
      this.trackBadge = false
    },
    checkTrackStatus() {
      if (this.trackBadge) {
        this.showActionModal = true
      }
    },
    showBadgeModal(badge) {
      this.showModalMessage = true
      this.badge = badge
    },
    loadBadges() {
      this.$store.dispatch('loadBadges')
    },
    updateTrackBadge() {
      this.$store.dispatch('setUserBadgeTrack', this.trackBadge)
    },
    closeModal() {
      this.badge = {
        title: '',
        description: '',
        action: '',
        unCompletedImageUrl: [
          {
            url: ''
          }
        ],
        completedImageUrl: [
          {
            url: ''
          }
        ],
        winningBadge: [
          {
            url: ''
          }
        ]
      }
      this.showModalMessage = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadges.scss';
</style>
