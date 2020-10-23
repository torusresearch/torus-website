<template>
  <div class="sk-grid">
    <div class="sk-grid__col-mob-2">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-top: 30px; margin-bottom: 20px"></div>
    </div>
    <div class="sk-grid__col-mob-2"></div>

    <div class="sk-grid__col-mob-4">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 20px"></div>
    </div>

    <div class="sk-grid__col-mob-4">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 80px; margin-bottom: 20px"></div>
    </div>

    <div class="sk-grid__col-mob-2">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 30px"></div>
    </div>
    <div class="sk-grid__col-mob-2">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 30px"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
