<template>
  <div class="sk-grid">
    <div class="sk-grid__col-desk-12">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 30px"></div>
    </div>

    <div class="sk-grid__col-desk-2"><div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 25px"></div></div>
    <div class="sk-grid__col-desk-4 sk-grid__col-desk-shift-6 sk-grid">
      <div class="sk-grid__col-desk-6">
        <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 15px"></div>
      </div>
      <div class="sk-grid__col-desk-6">
        <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 15px"></div>
      </div>
    </div>

    <div class="sk-grid__col-desk-6">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 140px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-6">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 140px; margin-bottom: 15px"></div>
    </div>

    <div class="sk-grid__col-desk-6">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 15px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-6"></div>

    <div class="sk-grid__col-desk-3">
      <div class="sk-grid" style="margin-left: 0">
        <div class="sk-grid__col-desk-6">
          <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 2px"></div>
        </div>
        <div class="sk-grid__col-desk-6">
          <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 50px; margin-bottom: 2px"></div>
        </div>
      </div>
    </div>
    <div class="sk-grid__col-desk-6"></div>
    <div class="sk-grid__col-desk-6">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 140px; margin-bottom: 15px"></div>
    </div>
    <div class="sk-grid__col-desk-6">
      <div :class="$vuetify.theme.dark ? 'dark' : ''" class="sk-loader" style="height: 140px; margin-bottom: 15px"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
