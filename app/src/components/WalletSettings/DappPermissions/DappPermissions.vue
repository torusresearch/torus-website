<template>
  <v-card class="dapp-permisson-container">
    <v-card-text class="torus_text--text">
      <v-container>
        <v-layout mt-4 wrap class="wallet-dapp-permission">
          <v-flex xs12 px-4 class="title-container mb-4">
            <div class="title">
              <div class="d-inline font-weight-bold headline">Dapp Permission</div>
              <p class="text">
                <small>
                  As a form of security, all transactions require your signature for validation. You may add and allow certain Dapps to transact under
                  certain circumstances.
                </small>
              </p>
            </div>

            <v-btn depressed color="primary" @click="addPermission">
              <v-icon left>$vuetify.icons.add</v-icon>
              Add a new List
            </v-btn>
          </v-flex>
          <v-flex xs12 class="px-4">
            <template v-for="(permission, index) in permissions">
              <v-slide-y-transition :key="index">
                <dapp-permission-edit v-if="permission.isEdit" @onCancel="permission.isEdit = false" />
              </v-slide-y-transition>
              <v-slide-y-transition :key="index">
                <dapp-permission-view v-if="!permission.isEdit" @onDelete="onDeletePermission(permission)" @onEdit="permission.isEdit = true" />
              </v-slide-y-transition>
            </template>
          </v-flex>
        </v-layout>
        <v-layout mt-4 pr-4>
          <v-spacer></v-spacer>
          <v-btn id="close-btn" large text @click="onClose">Close</v-btn>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import DappPermissionView from '../DappPermissionView'
import DappPermissionEdit from '../DappPermissionEdit'

export default {
  data() {
    return {
      editMode: false,
      permissions: []
    }
  },
  components: {
    DappPermissionView,
    DappPermissionEdit
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

<style lang="scss">
@import 'DappPermissions.scss';
</style>
