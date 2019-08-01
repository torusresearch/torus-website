#!/usr/bin/env bash
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
if ! (git diff --quiet && git diff --staged --quiet); then
    git add package.json
    git commit -m "Updating version [skip ci]"
    if (git push origin $CIRCLE_BRANCH); then 
        if [[ "$CIRLCE_BRANCH" = 'master' ]]; then
            git push --tags 
        fi
    fi
fi
