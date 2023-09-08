
#!/bin/bash
GH_BRANCH=${GITHUB_REF#refs/heads/}
git clone -b $GH_BRANCH git@github.com:torusresearch/torus-embed.git ~/torus-embed
git config user.email "no-reply@tor.us"
git config user.name "torus-bot"
cd ~/torus-embed/

if [[ "$GITHUB_REF" = 'refs/heads/master' ]]; then 
    npm version major -m 'Updating iframe integrity and publish %s'
    git push origin master
    git push --tags 
fi
if [[ "$GITHUB_REF" = 'refs/heads/binance' ]]; then 
    npm version major -m 'Updating iframe integrity and publish %s'
    git push origin binance
fi
