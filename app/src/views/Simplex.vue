<template>
  <v-flex fill-height class="simplex-page">
    <v-flex class="simplex-header" style="background: red">
      <h1>Header</h1>
    </v-flex>
    <v-container style="background: blue">
      <p>Body</p>
    </v-container>
  </v-flex>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.simplex-page {
  background: url("/images/footer_waves.png") no-repeat;
  background-position: center bottom; 
}
</style>
