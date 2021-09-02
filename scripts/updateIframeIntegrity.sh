
#!/bin/bash
git clone -b $CIRCLE_BRANCH git@github.com:torusresearch/torus-embed.git ~/torus-embed
PACKAGE_VERSION=$(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
cd dist
HASH="$(cat index.html | openssl dgst -sha384 -binary | openssl base64 -A)"
cd ~/torus-embed/src/
sed -i -e "s|sha384-.*|sha384-$HASH\";|g" embed.ts
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git commit -am "Updating embed with new hash"
cd ..
if ! (git diff --quiet && git diff --staged --quiet && git diff origin/master HEAD --quiet); then
    if [[ "$CIRCLE_BRANCH" = 'master' ]]; then 
        npm version patch -m 'Updating iframe integrity and publish %s'
        git push origin $CIRCLE_BRANCH
        git push --tags 
    fi
    if [[ "$CIRCLE_BRANCH" = 'binance' ]]; then 
        npm version patch -m 'Updating iframe integrity and publish %s'
        git push origin $CIRCLE_BRANCH
    fi
fi