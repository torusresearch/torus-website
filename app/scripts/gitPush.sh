#!/usr/bin/env bash
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git diff --quiet && git diff --staged --quiet || (git add package.json && git commit -m "Updating version [skip ci]" && git push origin $CIRCLE_BRANCH)
if ! (git diff --quiet && git diff --staged --quiet); then
    if (git push origin $CIRCLE_BRANCH); then 
        if [[ "$CIRLCE_BRANCH" = 'master' ]]; then
            git push --tags 
        fi
    fi
fi
