#!/usr/bin/env bash
git config --global user.email "no-reply@tor.us"
git config --global user.name "torus-bot"
GH_BRANCH=${GITHUB_REF#refs/heads/}
if ! (git diff --quiet && git diff --staged --quiet && git diff origin/$GH_BRANCH HEAD --quiet); then
    git push origin $GH_BRANCH
    if [[ "$GH_BRANCH" = 'master' ]]; then
        git push --tags 
    fi
fi
