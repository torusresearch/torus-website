#!/bin/bash

git clone https://gist.github.com/733405286923fa047af4cb26d167acd4.git ~/gist
cd app/app/dist/
HASH="$(cat embed.min.js | openssl dgst -sha384 -binary | openssl base64 -A)"
cd ~/gist
echo "<script src="https://app.tor.us/embed.min.js"
        integrity=\"$HASH\"
        crossorigin="anonymous"></script>" > torus-embed.html

git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git commit -am "Updating embed"
git push origin master