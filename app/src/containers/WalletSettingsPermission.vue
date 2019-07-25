<template>
  <v-card class="advance-option">
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
              <img width="20" height="20" :src="require('../../public/img/icons/add.svg')" class="mr-1" />
              Add a new List
            </v-btn>
          </v-flex>
          <v-flex xs12 class="px-4">
            <template v-for="(permission, index) in permissions">
              <v-slide-y-transition :key="index">
                <dapp-permission-edit v-if="permission.isEdit" @onCancel="permission.isEdit = false" />
              </v-slide-y-transition>
              <v-slide-y-transition :key="index">
                <dapp-permission v-if="!permission.isEdit" @onDelete="onDeletePermission(permission)" @onEdit="permission.isEdit = true" />
              </v-slide-y-transition>
            </template>
          </v-flex>
        </v-layout>
        <v-layout mt-4 pr-4>
          <v-spacer></v-spacer>
          <v-btn large text @click="onClose">Close</v-btn>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import DappPermission from '../components/DappPermission'
import DappPermissionEdit from '../components/DappPermissionEdit'

export default {
  data() {
    return {
      editMode: false,
      permissions: []
    }
  },
  components: {
    DappPermission,
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
.wallet-dapp-permission {
  .btn-cancel {
    box-shadow: none;
  }
  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      max-width: 70%;
    }
  }
  .text {
    font-size: 1rem;
    line-height: 20px;
    font-weight: normal;
  }
  .chevron-icon {
    transition: ease 0.2s;
  }

  .icon-button {
    background-color: transparent;
    box-shadow: none !important;
    height: auto !important;
  }

  .custom-text-input {
    font-size: 0.7rem;
    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid #d3d5e2 !important;
    }
  }

  .other-input {
    display: flex;
    align-items: center;

    .max-transaction-input {
      font-size: 0.7rem;
      label {
        font-size: 0.7rem;
      }
    }
  }

  .section-note {
    font-size: 0.7rem;
  }

  .text-gray {
    color: #5c6c7f;
  }

  .save-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
