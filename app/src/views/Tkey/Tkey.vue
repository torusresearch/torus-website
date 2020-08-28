<template>
  <div class="tkey-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    }
  },
}
</script>

<!-- eslint-disable-next-line vue-scoped-css/require-scoped -->
<style lang="scss">
@import 'Tkey.scss';
</style>
