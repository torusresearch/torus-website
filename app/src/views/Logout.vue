<template>
  <v-container fill-height align-content-center>
    <v-layout wrap align-center justify-center align-content-center>
      <v-flex text-center>
        <img width="200px" height="auto" :src="require('../../public/images/torus-people-colored.svg')" />
      </v-flex>
      <v-flex xs12 mt-10>
        <div class="text-center headline font-weight-bold">You have been logged out</div>
      </v-flex>
      <v-flex xs12 mt-8>
        <div class="text-center">
          <v-btn large color="primary" class="px-12" type="button">
            Return Home
          </v-btn>
        </div>
        <div class="text-center">
          Login Again
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'logout'
}
</script>

<style lang="scss" scoped>
::v-deep body {
  margin: 0;
  padding: 0;

  background-image: url('/images/footer_waves.png');
  background-repeat: no-repeat;
  background-position: center bottom;
}

@media only screen and (min-width: 1264px) {
  body {
    background-size: 100%;
  }
}
</style>
