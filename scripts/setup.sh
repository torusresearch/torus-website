git config --global user.email "no-reply@tor.us"
git config --global user.name "torus-bot"
mkdir -p ~/.ssh 
echo "$GITHUB_SSH_KEY" >> ~/.ssh/id_rsa
chmod 400 ~/.ssh/id_rsa
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
git add package-lock.json
git diff --quiet && git diff --staged --quiet || git commit -m "update package-lock.json [skip ci]"