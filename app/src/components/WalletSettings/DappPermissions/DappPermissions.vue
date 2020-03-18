<template>
  <v-card class="dapp-permisson-container">
    <v-card-text>
      <v-container>
        <v-layout mt-4 wrap class="wallet-dapp-permission">
          <v-flex xs12 px-4 class="title-container mb-4">
            <div class="title">
              <div class="d-inline font-weight-bold headline">{{ t('walletSettings.dappPermission') }}</div>
              <p class="text">
                <small>
                  {{ t('walletSettings.dappPermissionDesc') }}
                </small>
              </p>
            </div>

            <v-btn depressed color="torus_brand1" @click="addPermission">
              <v-icon left>$vuetify.icons.add</v-icon>
              {{ t('walletSettings.addNewList') }}
            </v-btn>
          </v-flex>
          <v-flex xs12 class="px-4">
            <template v-for="(permission, index) in permissions">
              <v-slide-y-transition :key="index">
                <DappPermissionEdit v-if="permission.isEdit" @onCancel="permission.isEdit = false" />
              </v-slide-y-transition>
              <v-slide-y-transition :key="index">
                <DappPermissionView v-if="!permission.isEdit" @onDelete="onDeletePermission(permission)" @onEdit="permission.isEdit = true" />
              </v-slide-y-transition>
            </template>
          </v-flex>
        </v-layout>
        <v-layout mt-4 pr-4>
          <v-spacer></v-spacer>
          <v-btn id="close-btn" large text @click="onClose">{{ t('walletSettings.close') }}</v-btn>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import DappPermissionEdit from '../DappPermissionEdit'
import DappPermissionView from '../DappPermissionView'

export default {
  components: {
    DappPermissionView,
    DappPermissionEdit
  },
  data() {
    return {
      editMode: false,
      permissions: []
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
    addPermission() {
      this.permissions.push({
        isEdit: false
      })
    },
    onDeletePermission(target) {
      const targetIndex = this.permissions.indexOf(target)
      this.permissions.splice(targetIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'DappPermissions.scss';
</style>
