#!/usr/bin/env bash
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
if ! (git diff --quiet && git diff --staged --quiet && git diff origin/$CIRCLE_BRANCH HEAD --quiet); then
    git push origin $CIRCLE_BRANCH
    if [[ "$CIRLCE_BRANCH" = 'master' ]]; then
        git push --tags 
    fi
fi
