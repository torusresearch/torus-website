<template>
  <v-container>
    <PopupLogin />
    <PopupWidget />
  </v-container>
</template>

<script>
import PopupLogin from '../../components/Popup/PopupLogin'
import PopupWidget from '../../components/Popup/PopupWidget'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget },
}
</script>

<style lang="scss" scoped>
@import 'Popup.scss';
</style>
