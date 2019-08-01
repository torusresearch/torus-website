<template>
  <v-flex xs12 sm6 mb-4 px-4 class="topup-providers">
    <v-card class="mb-4" v-for="targetProvider in providers" @click="innerProvider = targetProvider.name" :key="targetProvider.name">
      <v-list-item three-line>
        <v-list-item-icon class="mr-2 align-self-center">
          <v-icon color="primary" v-if="innerProvider === targetProvider.name">$vuetify.icons.radio_checked</v-icon>
          <v-icon color="grey" v-else>$vuetify.icons.radio_unchecked</v-icon>
        </v-list-item-icon>
        <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 105 : 138" height="100%" tile class="align-self-center mr-2">
          <img :src="require(`../../public/images/logos/${targetProvider.logo}`)" />
        </v-list-item-avatar>
        <v-list-item-content class="align-self-center text-right caption">
          <div>{{ targetProvider.line1 }}</div>
          <div v-html="targetProvider.line2"></div>
          <div>{{ targetProvider.line3 }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <template>
      <v-tooltip right v-for="targetProvider in providersInactive" :key="targetProvider.name">
        <template v-slot:activator="{ on }">
          <v-card class="mb-4 coming-soon" v-on="on">
            <v-list-item three-line>
              <v-list-item-icon class="mr-2 align-self-center">
                <v-icon color="grey">$vuetify.icons.radio_unchecked</v-icon>
              </v-list-item-icon>
              <v-list-item-avatar :width="$vuetify.breakpoint.xsOnly ? 105 : 138" height="100%" tile class="align-self-center mr-2">
                <img :src="require(`../../public/images/logos/${targetProvider.logo}`)" />
              </v-list-item-avatar>
              <v-list-item-content class="align-self-center text-right caption">
                <div>{{ targetProvider.line1 }}</div>
                <div v-html="targetProvider.line2"></div>
                <div>{{ targetProvider.line3 }}</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </template>
        <span>Coming Soon</span>
      </v-tooltip>

      <div class="mt-4 py-4 px-1 text-gray caption">
        <div>Prefer other mode of payment?</div>
        <div>
          <a href="mailto:hello@tor.us?Subject=Add%20Payment%20Method" target="_blank">Write to us</a>
          and we would try out best to improve and serve you better
        </div>
      </div>
    </template>
  </v-flex>
</template>

<script>
export default {
  props: ['provider'],
  data() {
    return {
      innerProvider: '',
      providers: [
        {
          name: 'simplex',
          logo: 'simplex-logo.png',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">Simplex Service Fee</span> : 5% or 10 USD',
          line3: '(whichever is higher)'
        },
        {
          name: 'moonpay',
          logo: 'moon-pay-logo.svg',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">Moonpay Service Fee</span> : 4.5% or 5 USD',
          line3: '(whichever is higher)'
        }
      ],
      providersInactive: [
        {
          name: 'wyre',
          logo: 'wyre-logo.svg',
          line1: 'Pay with Credit Card or Wire Transfer',
          line2: '<span class="font-weight-medium">Wyre Service Fee</span> : Varies',
          line3: ''
        },
        {
          name: 'crypto',
          logo: 'crypto-logo.png',
          line1: 'Pay with Credit Card or Wire Transfer',
          line2: '<span class="font-weight-medium">crypto.com Service Fee</span> : Varies',
          line3: ''
        }
      ]
    }
  },
  computed: {
    providersFiltered() {
      return this.providers.filter(provider => {
        return this.innerProvider === '' || (this.innerProvider && this.innerProvider === provider.name)
      })
    }
  },
  watch: {
    innerProvider() {
      this.$emit('onSelectProvider', this.innerProvider)
    },
    provider() {
      this.innerProvider = this.provider
    }
  },
  created() {
    this.innerProvider = this.provider
  }
}
</script>

<style lang="scss" scoped>
.topup-providers {
  .coming-soon {
    opacity: 0.4;
  }
}
/* .topup-providers {
  .coming-soon {
    opacity: 0.4;
  }

  .provider {
    min-height: 63px;
    width: 100%;

    &-checkbox {
      display: flex;
      align-items: center;
    }

    &-description {
      padding-left: 3rem;
    }

    &-logo {
      max-height: 40px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
  }

  @media screen and (max-width: 768px) {
    .provider {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-description {
        text-align: right;
        padding-left: 0;
      }

      &-logo {
        margin-bottom: 0;
      }
    }
  }
} */

.v-tooltip__content {
  background: #fff;
  border: 1px solid var(--v-primary-base);
  color: var(--v-primary-base);
  &::after {
    content: ' ';
    position: absolute;
    transform: rotate(90deg);
    top: 50%;
    left: 0%;
    margin-left: -10px;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--v-primary-base) transparent transparent transparent;
  }
}
</style>
