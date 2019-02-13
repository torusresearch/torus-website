## Torus Website

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

To see website, navigate to https://tor.us

## Torus Demo

Go to chrome://extensions
Ensure developer mode
Drag embed-local.user.js
Navigate to etheremon.com and signin

