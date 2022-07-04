# app

[![CircleCI](https://circleci.com/gh/torusresearch/torus-website/tree/develop.svg?style=shield&circle-token=1ae4a7866d2585614a4c5803580cedf2405e87d2)](https://circleci.com/gh/torusresearch/torus-website/tree/develop)

[![Greenkeeper badge](https://badges.greenkeeper.io/torusresearch/torus-website.svg?token=891f5f5b782cc550f84cd6082f7b6059532f564030cc3a4e31989af9f0e56cc8&ts=1548219309942)](https://greenkeeper.io/)

[![codecov](https://codecov.io/gh/torusresearch/torus-website/branch/develop/graph/badge.svg?token=fzYfxUOTLd)](https://codecov.io/gh/torusresearch/torus-website)

## Project setup

```sh
npm install --legacy-peer-deps
find ./node_modules -name ".git" -type d -exec rm -rf {} +
```

Add `.env` the project's root directory:

```
VUE_APP_INFURA_KEY={Infura key}
```

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Run your tests

```sh
npm run test:unit
```

### Run your E2E tests

Start local application first before running the e2e test

```sh
npm run serve
npm run test:e2e
npm run test:e2e:mobile
```

### Lints and fixes files

```sh
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Current Issues

To get rid of the websocket error,
use the following command in the project root (where package.json lives)

```sh
find ./node_modules -name ".git" -type d -exec rm -rf {} +
```

### Release notes

Checklist:
Website: \*.tor.us

| Test/Browser                            | Chrome             | Safari             | Brave              | Firefox            | Edge               | iOS Safari         | iOS Chrome         | Android Chrome     |
| --------------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| Test login on google/discord oauths     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Skale Network Change                    | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Import Account                          | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Test wallet transfer                    | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Test on torus-embed vue-app all buttons | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |

Notes:

- When you update @metamask/contract-metadata, run the following command to sync images to s3

```sh
cd node_modules/@metamask/contract-metadata
aws s3 cp images s3://images.toruswallet.io/ --cache-control "public, max-age=604800, immutable" --metadata-directive REPLACE --recursive
```

## Providers and their cryptocurrencies that we support (to be finalised)

| Provider | Chain            | Symbol      |
| -------- | ---------------- | ----------- |
| Mercuryo | Ethereum mainnet | ETH         |
| Mercuryo | Ethereum mainnet | BAT         |
| Mercuryo | Ethereum mainnet | USDT        |
| Mercuryo | Ethereum mainnet | DAI         |
| Mercuryo | BNB              | BNB         |
| Mercuryo | BNB              | BUSD        |
| Mercuryo | BNB              | 1INCH       |
| Xanpool  | Ethereum mainnet | ETH         |
| Xanpool  | Ethereum mainnet | USDT        |
| Wyre     | Ethereum mainnet | AAVE        |
| Wyre     | Ethereum mainnet | BAT         |
| Wyre     | Ethereum mainnet | BUSD        |
| Wyre     | Ethereum mainnet | DAI         |
| Wyre     | Ethereum mainnet | ETH         |
| Wyre     | Ethereum mainnet | MKR         |
| Wyre     | Ethereum mainnet | UNI         |
| Wyre     | Ethereum mainnet | USDC        |
| Wyre     | Ethereum mainnet | USDT        |
| Wyre     | Matic            | USDC        |
| Wyre     | Avalanche        | AVAXC       |
| Simplex  | Ethereum mainnet | AAVE        |
| Simplex  | Ethereum mainnet | BAT         |
| Simplex  | Ethereum mainnet | BUSD        |
| Simplex  | Ethereum mainnet | DAI         |
| Simplex  | Ethereum mainnet | ETH         |
| Simplex  | Ethereum mainnet | MKR         |
| Simplex  | Ethereum mainnet | MATIC-ERC20 |
| Simplex  | Ethereum mainnet | USDT        |
| Simplex  | Ethereum mainnet | USDC        |
| Simplex  | BNB              | BNB         |
| Simplex  | BNB              | BUSD-SC     |
| Simplex  | BNB              | CAKE        |
| Simplex  | BNB              | USDC-SC     |
| Simplex  | Matic            | MATIC       |
| Simplex  | Matic            | USDC-MATIC  |
| Simplex  | Avalanche        | AVAX-C      |
| Transak  | Ethereum mainnet | AAVE        |
| Transak  | Ethereum mainnet | DAI         |
| Transak  | Ethereum mainnet | ETH         |
| Transak  | Ethereum mainnet | USDC        |
| Transak  | Ethereum mainnet | USDT        |
| Transak  | BNB              | BNB         |
| Transak  | BNB              | BUSD        |
| Transak  | Matic            | AAVE        |
| Transak  | Matic            | DAI         |
| Transak  | Matic            | MATIC       |
| Transak  | Matic            | USDC        |
| Transak  | Matic            | USDT        |
| Transak  | Matic            | WETH        |
| Transak  | Avalanche        | AVAX        |
| Ramp     | Ethereum mainnet | ETH         |
| Ramp     | Ethereum mainnet | DAI         |
| Ramp     | Ethereum mainnet | USDC        |
| Ramp     | Ethereum mainnet | USDT        |
| Ramp     | Matic            | DAI         |
| Ramp     | Matic            | MATIC       |
| Ramp     | Matic            | USDC        |
| Ramp     | Avalanche        | AVAX        |
| Ramp     | XDAI             | XDAI        |
| MoonPay  | Ethereum mainnet | AAVE        |
| MoonPay  | Ethereum mainnet | BAT         |
| MoonPay  | Ethereum mainnet | DAI         |
| MoonPay  | Ethereum mainnet | ETH         |
| MoonPay  | Ethereum mainnet | MKR         |
| MoonPay  | Ethereum mainnet | MATIC       |
| MoonPay  | Ethereum mainnet | USDT        |
| MoonPay  | Ethereum mainnet | USDC        |
| MoonPay  | BNB              | BNB - BSC   |
| MoonPay  | BNB              | BUSD - BSC  |
| MoonPay  | Matic            | ETH         |
| MoonPay  | Matic            | MATIC       |
| MoonPay  | Matic            | USDC        |
| MoonPay  | Avalanche        | AVAX        |

## Providers supported currencies

| Provider        | Supported cryptocurrencies                                                                              | Supported fiat currencies                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Mercuryo        | https://help.mercuryo.io/en/articles/4519473-mercuryo-widget-faq                                        | https://support.aax.com/en/articles/5295762-mercuryo                                                      |
| Xanpool         | https://xanpool.com/documentation/api/Misc.html#methods-icons                                           | https://xanpool.com/ Currency select dropdown                                                             |
| Wyre            | https://docs.sendwyre.com/docs/supported-currencies#blockchains                                         | https://docs.sendwyre.com/docs/supported-currencies#fiat                                                  |
| Simplex         | https://support.simplex.com/hc/en-gb/articles/360020782798-Checking-your-transaction-on-the-blockchain  | https://integrations.simplex.com/supported_currencies                                                     |
| Transak Support | https://support.transak.com/hc/en-us/articles/360020147998-Which-Cryptocurrencies-does-Transak-support- | https://support.transak.com/hc/en-us/articles/360020615578-Credit-and-Debit-Card-Payments-through-Transak |
| Ramp            | https://support.ramp.network/en/articles/432-what-crypto-assets-do-you-support                          | https://support.ramp.network/en/articles/471-why-am-i-paying-in-usd-eur-gbp                               |
| Moonpay         | https://support.moonpay.com/hc/en-gb/articles/360009280177-Which-cryptocurrencies-do-you-support-       | https://support.moonpay.com/hc/en-gb/articles/360011931457-Which-fiat-currencies-are-supported-           |
