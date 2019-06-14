#!/usr/bin/env bash
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git diff --quiet && git diff --staged --quiet || (git add package.json && git commit -m "Updating buildVersion [skip ci]" && git push origin $CIRCLE_BRANCH)