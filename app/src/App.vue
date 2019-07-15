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
  color: #0f1222;
}

.card-shadow {
  box-shadow: 0 14px 28px 0 rgba(0, 0, 0, 0.06);
}

.v-input__slot {
  margin-bottom: 2px;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.v-btn {
  text-transform: inherit;
}
</style>
