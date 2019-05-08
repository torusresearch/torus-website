<template>
  <div>
    <v-tabs fixed-tabs v-model="selectedItem" grow>
      <header-item
        v-for="headerItem in headerItems"
        :key="headerItem.name"
        :isSelected="selectedItem === headerItem.name"
        :href="`#${headerItem.name}`"
        :icon="headerItem.icon"
      >
        {{ headerItem.display }}
      </header-item>
      <v-tabs-items v-model="selectedItem" vertical>
        <v-tab-item value="home" lazy>
          Hello world
        </v-tab-item>
        <v-tab-item value="history" lazy>
          Hello world 2
        </v-tab-item>
        <v-tab-item value="settings" lazy>
          Hello world 3
        </v-tab-item>
        <v-tab-item value="accounts" lazy>
          Hello world 4
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import HeaderItem from './HeaderItem.vue'
export default {
  components: {
    HeaderItem
  },
  data() {
    return {
      selectedItem: 'home',
      headerItems: [
        { name: 'home', icon: 'home', display: 'Home' },
        { name: 'history', icon: 'history', display: 'History' },
        { name: 'settings', icon: 'settings', display: 'Settings' },
        { name: 'accounts', icon: 'account_circle', display: 'Accounts' }
      ]
    }
  }
}
</script>

<style lang="scss"></style>
