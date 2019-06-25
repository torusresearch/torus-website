<template>
  <v-flex fill-height class="simplex-page mt-2">
    <v-form>
      <v-container align-content-center>
        <v-layout column text-sm-center>
          <v-flex sm6>
            <h1 class="page-title">Purchase Cryptocurrency with your credit card via Simplex</h1>
          </v-flex>
          <v-flex sm6>
            <p class="page-description">
              Simplex is a secure way to buy cryptoccurrency with your credit card.
              <br />Start by entering an amount to get a quote before making your purchase.
            </p>
          </v-flex>
        </v-layout>

        <v-layout row justify-center>
          <v-flex sm2 lg1>
            <v-subheader>Purchase</v-subheader>
          </v-flex>
          <v-flex sm4 lg4>
            <v-text-field class="torus-text-input" placeholder="0.0000" suffix="ETH" solo :rules="[rules.required]"></v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">Rate : 1 ETH = 260.00 USD</div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>

        <v-layout row justify-center class="pay-form">
          <v-flex sm2 lg1>
            <v-subheader>Pay</v-subheader>
          </v-flex>
          <v-flex sm4 lg4>
            <v-text-field
              class="torus-text-input"
              placeholder="0.00 (Min 50.00)"
              suffix="USD*"
              solo
              :rules="[rules.required, validatePayRange]"
            ></v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">
                    * Includes 5% Simplex Service Fees
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon class="torus-hint-icon" color="primary" small v-on="on">error_outline</v-icon>
                      </template>
                      <span>
                        This fee goes entirely to Simplex for their services <br />in credit card processing, fraud detection and mitigation
                      </span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>

        <v-layout class="torus-notes" column text-sm-center>
          <v-flex sm6>
            <v-layout row justify-center>
              <img class="torus-note-icon" src="/images/clock-regular.svg" />
              <span>The process would take approximately 10 - 15 mins.</span>
            </v-layout>
          </v-flex>
          <v-flex sm6>
            <v-layout row justify-center>
              <img class="torus-note-icon" src="/images/address-card-regular.svg" />
              <span>Please prepare your Identity Card/Passport to complete the purchase.</span>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-card-actions text-sm-center>
          <v-spacer></v-spacer>
          <v-btn class="torus-button" color="primary" type="submit">Checkout with Simplex</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-container>
    </v-form>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        required: value => !!value || 'Required'
      }
    }
  },
  methods: {
    validatePayRange(value) {
      if (parseFloat(value) > 2000) {
        return 'Must be lesser than 2000'
      } else if (parseFloat(value) < 50) {
        return 'Must be greater than 50'
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.simplex-page {
  // background: url('/images/footer_waves.png') no-repeat;
  // background-position: center bottom;

  .header {
    padding: 25px 25px;
  }

  .header-title {
    display: flex;
    img {
      margin-right: 10px;
      width: 25px;
    }
    span {
      font-size: 14px;
    }
  }

  .page-title {
    font-size: 25px;
    line-height: 28px;
    margin-bottom: 10px;
  }

  .page-description {
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 20px;
  }

  .torus-button {
    border-radius: 5px;
    background-image: linear-gradient(to right, #5495f7, #295dab);
    text-transform: none;
    font-size: 16px;
    padding: 10px 20px;
    height: inherit;
  }

  .pay-form {
    margin-bottom: 20px !important;
  }

  .torus-notes {
    margin-bottom: 15px !important;
  }

  .torus-note-icon {
    margin-right: 10px;
  }

  .torus-text-input.v-text-field--solo {
    font-size: 20px;

    & /deep/ .v-input__slot {
      box-shadow: none;
      margin-bottom: 5px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #5495f7, #295dab);
      padding: 2px;
    }
    & /deep/ .v-text-field__slot {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      height: 44px;
      input {
        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        text-align: center;
        color: #ffffff;
      }
    }
    & /deep/ .v-text-field__suffix {
      background-color: #295dab;
      height: 100%;
      line-height: 42px;
      color: #ffffff;
      padding: 0 15px;
      min-width: 90px;
      text-align: center;
    }
  }

  & /deep/ .v-text-field__details {
    margin-bottom: 0;
    padding: 0 12px;
  }

  & /deep/ .v-messages {
    min-height: 0;
  }
}

@media only screen and (min-width: 600px) {
  .simplex-page {
    .header {
      padding: 45px 50px 30px;
      align-items: center;
    }

    .header-title {
      img {
        margin-right: 20px;
      }
      span {
        font-size: 14px;
      }
    }

    .page-title {
      font-size: 25px;
      line-height: 30px;
    }

    .page-description {
      font-size: 17px;
      line-height: 21px;
      margin-bottom: 40px;
    }

    .torus-button {
      font-size: 21px;
      padding: 15px 30px;
    }

    .pay-form {
      margin-bottom: 40px !important;
    }

    .torus-notes {
      margin-bottom: 20px !important;
    }

    .torus-note-icon {
      margin-right: 15px;
    }
  }
}

@media only screen and (min-width: 1264px) {
  .simplex-page {
    background-size: 100%;
  }

  .container {
    max-width: 1185px;
  }
}

@media only screen and (max-height: 750px) {
  .simplex-page {
    .header {
      padding: 45px 50px 0;
    }

    .page-title {
      margin-bottom: 0;
    }

    .page-description {
      margin-bottom: 20px;
    }

    .pay-form {
      margin-bottom: 10px !important;
    }

    .torus-notes {
      margin-bottom: 10px !important;
    }

    .torus-note-icon {
      margin-right: 15px;
    }
  }
}
</style>
