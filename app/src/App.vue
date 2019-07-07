<template>
  <v-app>
    <div id="app" style="width:100%; height:100%">
      <router-view />
    </div>
  </v-app>
</template>
<style src="../public/css/circles.css"></style>

<style lang="scss">
#app {
  background: var(--v-torus_bcg-base) !important;
  height: 100%;
}

.card-shadow {
  box-shadow: 0 14px 28px 0 rgba(0, 0, 0, 0.06);
}
</style>
