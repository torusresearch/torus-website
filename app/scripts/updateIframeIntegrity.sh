
#!/bin/bash
git clone git@github.com:torusresearch/torus-embed.git ~/torus-embed
PACKAGE_VERSION=$(cat package.json | grep buildVersion | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
cd dist
HASH="$(cat index.html | openssl dgst -sha384 -binary | openssl base64 -A)"
cd ~/torus-embed/src/
sed -i -e "s|app\.tor\.us.*|app.tor.us\/$PACKAGE_VERSION\'|g" embed.js
sed -i -e "s|sha384-.*|sha384-$HASH\'|g" embed.js
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
cd ..
npm version patch -f -m 'Updating iframe integrity and publish %s'
git diff --quiet && git diff --staged --quiet && git diff origin/master HEAD --quiet || (git push origin master && git push --tags)