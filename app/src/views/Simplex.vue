<template>
  <v-flex fill-height class="simplex-page">
    <v-layout justify-space-between row class="header">
      <div>
        <img src="/images/torus_logo.png">
      </div>
      <div class="header-title">
        <img src="/images/wallet_blue_line.svg">
        <span>{{ username }}'s Wallet</span>
      </div>
    </v-layout>
    <v-form>
      <v-container align-content-center>
        <v-layout column text-sm-center>
          <v-flex sm6>
            <h1 class="page-title">Purchase Cryptocurrency with your credit card via Simplex</h1>
          </v-flex>
          <v-flex sm6>
            <p class="page-description">
              Simplex is a secure way to buy cryptoccurrency with your credit card.
              <br>Start by entering an amount to get a quote before making your purchase.
            </p>
          </v-flex>
        </v-layout>

        <v-layout row justify-center>
          <v-flex sm2 lg1>
            <v-subheader>Purchase</v-subheader>
          </v-flex>
          <v-flex sm4 lg4>
            <v-text-field
              class="torus-text-input"
              placeholder="0.0000"
              suffix="ETH"
              solo
              type="number"
              :rules="[rules.required]"
            ></v-text-field>
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
              type="number"
              :rules="[rules.required, validatePayRange]"
            ></v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">
                    * Includes 5% Simplex Service Fees
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          class="torus-hint-icon"
                          color="primary"
                          small
                          v-on="on"
                        >error_outline</v-icon>
                      </template>
                      <span>Tooltip</span>
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
              <img class="torus-note-icon" src="/images/clock-regular.svg">
              <span>The process would take approximately 10 - 15 mins.</span>
            </v-layout>
          </v-flex>
          <v-flex sm6>
            <v-layout row justify-center>
              <img class="torus-note-icon" src="/images/address-card-regular.svg">
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
      username: "Username",
      rules: {
        required: value => !!value || "Required"
      }
    };
  },
  methods: {
    validatePayRange(value) {
      if (parseFloat(value) > 2000) {
        return "Must be lesser than 2000";
      } else if (parseFloat(value) < 50) {
        return "Must be greater than 50";
      }

      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.simplex-page {
  background: url("/images/footer_waves.png") no-repeat;
  background-position: center bottom;

  .header {
    padding: 45px 50px 30px;
  }

  .header-title {
    display: flex;
    img {
      margin-right: 20px;
    }
    span {
      font-size: 25px;
    }
  }

  .page-title {
    font-size: 25px;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .page-description {
    font-size: 17px;
    line-height: 21px;
    margin-bottom: 40px;
  }

  .torus-button {
    border-radius: 5px;
    background-image: linear-gradient(to right, #5495f7, #295dab);
    text-transform: none;
    font-size: 21px;
    padding: 15px 30px;
    height: inherit;
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

@media only screen and (min-width: 1264px) {
  .simplex-page {
    background-size: 100%;
  }

  .container {
    max-width: 1185px;
  }
}
</style>
