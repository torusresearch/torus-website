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
        <wallet-badge @openModal="openModal" :badge="badge" :index="index" />
      </v-flex>
    </v-layout>
    <v-layout mt-4 pr-2 wrap>
      <v-spacer></v-spacer>
      <v-dialog v-model="showModalMessage" max-width="500">
        <badge-modal
          @onClose="closeModal"
          :text="
            !isCompleted
              ? badge.title
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
      badge: {}
    }
  },
  created() {
    this.loadBadges()
  },
  computed: {
    badges() {
      let badges = []
      this.$store.state.badges.filter(badge => {
        if (this.$store.state.myBadges.includes(badge.id)) {
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
    }
  },
  methods: {
    openModal(badge) {
      this.showModalMessage = true
      this.badge = badge
    },
    loadBadges() {
      this.$store.dispatch('loadBadges')
    },
    closeModal() {
      this.showModalMessage = false
      this.badge = {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadges.scss';
</style>
