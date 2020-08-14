<template>
  <div class="two-factor-auth-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1 mb-2">Authentication Threshold</div>
      <div class="settings-container pa-4">
        <div class="text_1--text body-2 mb-4">Select threshold for authentication</div>
        <v-select outlined hide-details placeholder="2 out of 5 authentication factors"></v-select>
      </div>
    </div>

    <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1 mb-2">List of Authentication Factors</div>
      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">Torus Network</div>
        <v-list dense class="pa-0 factor-list mb-4">
          <v-list-item class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">
                {{ `$vuetify.icons.google` }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text_1--text">llenoil@gmail.com</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete Lionell Briones`">
                <v-icon x-small>$vuetify.icons.trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">
                {{ `$vuetify.icons.google` }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text_1--text">llenoil@gmail.com</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete Lionell Briones`">
                <v-icon x-small>$vuetify.icons.trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-layout wrap>
          <v-flex class="ml-auto xs8 sm4">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" block type="submit">
              Add new login
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">Device - Mac OS</div>
        <v-list dense class="pa-0 factor-list mb-2">
          <v-list-item class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">
                {{ `$vuetify.icons.device` }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text_1--text">
                  <span class="font-weight-bold">Chrome V82.04103.61</span>
                  <span class="font-italic">(Current)</span>
                </span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <div>
                <v-btn class="download-btn" color="text_2" icon small :aria-label="`Download Lionell Briones`">
                  <v-icon x-small>$vuetify.icons.download</v-icon>
                </v-btn>
                <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete Lionell Briones`">
                  <v-icon x-small>$vuetify.icons.trash</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
          <v-list-item class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">
                {{ `$vuetify.icons.device` }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text_1--text">
                  <span class="font-weight-bold">Torus Mask</span>
                </span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete Lionell Briones`">
                <v-icon x-small>$vuetify.icons.trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="caption text_3--text mb-4">
          Note: Clearing your browser data will delete the browser from this list. Click the "
          <v-icon size="10">$vuetify.icons.download</v-icon>
          " icon to allow file storage on current browser as a back-up.
        </div>
        <v-layout wrap>
          <v-flex class="ml-auto xs8 sm4">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" block type="submit">
              Add new browser
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">Account Password</div>
        <v-text-field outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs8 sm4">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" block type="submit">
              Change Password
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">Security Question</div>
        <v-select outlined hide-details placeholder="What is the name of your High School?"></v-select>
        <v-text-field outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 sm4">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" block type="submit">
              Change security question
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">Select Factor</div>
        <v-select outlined hide-details placeholder="Select from the list of Factors to add"></v-select>
        <v-layout wrap>
          <v-flex class="ml-auto xs8 sm4">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" block type="submit">
              Add factor
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFactorAuthSettings',
}
</script>

<style lang="scss" scoped>
@import 'TwoFactorAuth.scss';
</style>
