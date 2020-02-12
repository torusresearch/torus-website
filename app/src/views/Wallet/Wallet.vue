<template>
  <div>
    <navbar />
    <notification :alert-show="notification.alert" :alert-text="notification.text" :alert-type="notification.type" @closeAlert="closeAlert" />
    <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
import Navbar from '../../components/helpers/Navbar'
import Notification from '../../components/helpers/Notification'
export default {
  components: {
    Navbar,
    Notification
  },
  data() {
    return {
      alert: false,
      text: 'hello world',
      type: 'success'
    }
  },
  computed: {
    notification() {
      return this.$store.state.toastNotification
    }
  },
  methods: {
    closeAlert() {
      this.$store.dispatch('setToastNotification', {
        alert: false
      })
    }
  }
}
</script>

<style lang="scss">
@import 'Wallet.scss';
</style>
