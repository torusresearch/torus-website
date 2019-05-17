## Torus Website

[![Greenkeeper badge](https://badges.greenkeeper.io/torusresearch/torus-website.svg?token=891f5f5b782cc550f84cd6082f7b6059532f564030cc3a4e31989af9f0e56cc8&ts=1550579154562)](https://greenkeeper.io/)

You will nead to create an SSL directory at the main project directory containing:
```
server.crt
server.key
```
Ask one of the developers for these keys.

To install dependencies and build website, run the following commands from the main project directory:

```sh
cd app
npm install
npm run build-embed:dev
npm run serve
```

To see website, navigate to https://app.tor.us

## Torus Demo

Go to chrome://extensions
Ensure developer mode
Drag embed-local.user.js
Navigate to etheremon.com and signin

