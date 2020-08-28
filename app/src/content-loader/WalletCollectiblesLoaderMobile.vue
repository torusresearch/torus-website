<template>
  <div class="sk-grid">
    <div class="sk-grid__col-mob-4">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 35px"></div>
    </div>

    <div class="sk-grid__col-mob-3">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 15px; margin-bottom: 20px"></div>
    </div>
    <div class="sk-grid__col-mob-1"></div>

    <div class="sk-grid__col-mob-4">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 5px"></div>
    </div>
    <div class="sk-grid__col-mob-2 sk-grid__col-mob-shift-2">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 15px; margin-bottom: 30px"></div>
    </div>

    <div class="sk-grid__col-mob-4">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 130px; margin-bottom: 30px"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
