<template>
  <div>
    <Navbar />
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      selectedItem: 'home'
    }
  }
}
</script>

<style lang="scss">
.theme--light,
.theme--dark {
  &.v-application {
    background: var(--v-background-base);
  }
  &.v-sheet {
    background: var(--v-background-base);
  }
  &.v-tabs .v-tabs-bar {
    background: var(--v-background-base);
  }
  &.v-data-table {
    background: var(--v-background-base);
  }
  &.v-stepper {
    background: var(--v-background-base);
  }
}

.card-shadow {
  box-shadow: 0 14px 28px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #f5f5f5;
  border-radius: 3px;
}

.v-window__container {
  height: 100% !important;
}

.application--wrap {
  min-height: 0px !important;
}

.v-btn {
  text-transform: inherit;
}

.v-input.v-input--is-readonly {
  .v-input__slot {
    background: var(--v-background_2-base) !important;
  }
}

.v-text-field__suffix {
  color: var(--v-torus_text-lighten5);
  font-size: 14px;
}

body,
html {
  height: 100%;
}

@media only screen and (max-width: 599px) {
  .container {
    padding: 12px 0;
  }
}
</style>
