<template>
  <div class="sk-grid">
    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 30px"></div>
    </div>

    <div class="sk-grid__col-desk-3">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 25px; margin-bottom: 25px"></div>
    </div>
    <div class="sk-grid__col-desk-9"></div>

    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 190px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 190px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 250px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 190px; margin-bottom: 15px"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
