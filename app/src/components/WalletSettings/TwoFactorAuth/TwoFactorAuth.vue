<template>
  <div class="two-factor-auth-container" :class="[$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4', { 'is-dark': $vuetify.theme.dark }]">
    <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1">{{ t('Agregar factor') }}</div>
      <div class="settings-container pa-4 mb-4">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.selectThreshold') }}</div>
        <v-select v-model="authTreshholdSelected" class="mb-6" outlined hide-details :items="authTreshholds" append-icon="$vuetify.icons.select">
          <template v-slot:item="{ item }">
            {{ actualFactor(item) }}
          </template>
          <template v-slot:selection="{ item }">{{ actualFactor(item) }}</template>
        </v-select>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.save') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>

    <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1 mb-2">{{ t('tkeySettings.listOfAuth') }}</div>
      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.network') }}</div>
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
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`">
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
                <span class="text_1--text">llenoildsadsa@gmail.com</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`">
                <v-icon x-small>$vuetify.icons.trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit" @click="loginDialog = true">
              {{ t('tkeySettings.addNewLogin') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.device') }} - Mac OS</div>
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
                  <span class="font-italic">({{ t('tkeySettings.current') }})</span>
                </span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <div>
                <v-btn class="download-btn" color="text_2" icon small :aria-label="`Download`">
                  <v-icon x-small>$vuetify.icons.download</v-icon>
                </v-btn>
                <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`">
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
              <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`">
                <v-icon x-small>$vuetify.icons.trash</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="caption text_3--text mb-4">
          {{ t('tkeySettings.note') }}: {{ t('tkeySettings.clearing') }}. {{ t('tkeySettings.clickThe') }} "
          <v-icon size="10">$vuetify.icons.download</v-icon>
          " {{ t('tkeySettings.iconToAllow') }}.
        </div>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.addBrowser') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.accountPass') }}</div>
        <v-text-field outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.changePass') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.securityQuestion') }}</div>
        <v-select outlined hide-details placeholder="What is the name of your High School?"></v-select>
        <v-text-field outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.changeQuestion') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.selectFactor') }}</div>
        <v-select
          v-model="authFactorSelected"
          outlined
          hide-details
          class="mb-6"
          :items="authFactors"
          item-value="type"
          item-text="label"
          :placeholder="t('tkeySettings.selectFromList')"
        ></v-select>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.addFactor') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <PopupLogin :login-dialog="loginDialog" :is-link-account="true" @closeDialog="loginDialog = false" @accountLinked="accountLinked" />
    <LinkingCompleted :linking-dialog="linkingDialog" :is-successfull="isLinkingSuccessfull" @closeDialog="linkingDialog = false" />
  </div>
</template>

<script>
import PopupLogin from '../../../containers/Popup/PopupLogin'
import LinkingCompleted from '../LinkingCompleted'

const AUTH_FACTORS = [
  {
    type: 'torus_network',
    label: 'Torus Network',
  },
  {
    type: 'device',
    label: 'Device',
  },
  {
    type: 'account_password',
    label: 'Account Password',
  },
]
export default {
  name: 'TwoFactorAuthSettings',
  components: { PopupLogin, LinkingCompleted },
  data() {
    return {
      authTreshholdSelected: 2,
      authTreshholds: [1, 2, 3, 4, 5],
      authFactorSelected: '',
      authFactors: AUTH_FACTORS,
      userAuthFactors: [],
      loginDialog: false,
      linkingDialog: false,
      isLinkingSuccessfull: true,
    }
  },
  methods: {
    accountLinked() {
      // TODO check linking successfull
      this.linkingDialog = true
      this.loginDialog = false
    },
    actualFactor(item) {
      return this.t('tkeySettings.actualFactor')
        .replace(/{actualfactor}/gi, item)
        .replace(/{maxfactor}/gi, this.authTreshholds.length)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TwoFactorAuth.scss';
</style>
