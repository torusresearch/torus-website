<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {}
</script>

<style src="../public/css/circles.css"></style>

<style lang="scss">
.v-input__slot {
  margin-bottom: 2px;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.v-btn {
  text-transform: inherit;
}

.theme--dark {
  /* width */
  ::-webkit-scrollbar {
    width: 0.5em;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #626262;
    box-shadow: inset 0 0 5px #626262;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--v-background_body-base);
    border: 1px solid #626262;
    border-radius: 8px;
  }
}
</style>
