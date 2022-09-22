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

## Feature list

Feature list includes the following:

- Use OpenLogin for Auth
- Multiple network support (All EVM Chains)
- View Native token, ERC20, ERC721, ERC1155 Balances
- Transfer Native token, ERC20, ERC721, ERC1155 Balances
- Connect to dapps via Wallet Connect
- Allow Transfers to ETH, Google, Discord, Reddit, Twitter, ENS, Unstoppable domains, GitHub, .BIT
- Allow adding contacts and sending assets to contacts
- Export private keys
- Multiple themes supported
- Fully whitelabelable engine
- Multiple languages supported (6)
- Import external accounts
- Web SDK to connect to dapps
- Discover page with featured dapps(One click login)

## Environments we support

<table>
  <tr>
    <th>Environment</th>
    <th>Torus Network</th>
    <th>GitHub branch</th>
  </tr>
  <tr>
    <td>alpha</td>
    <td>testnet</td>
    <td>Any branch</td>
  </tr>
  <tr>
    <td>beta</td>
    <td>testnet</td>
    <td>Any branch</td>
  </tr>
  <tr>
    <td>testing</td>
    <td>testnet</td>
    <td>develop</td>
  </tr>
  <tr>
    <td>staging</td>
    <td>mainnet</td>
    <td>staging (versioning)</td>
  </tr>
  <tr>
    <td>prod</td>
    <td>mainnet</td>
    <td>master (versioning)</td>
  </tr>
  <tr>
    <td>cyan</td>
    <td>cyan</td>
    <td>master (versioning)</td>
  </tr>
</table>
