#!/bin/bash

sed -i '' -e 's/vm\.stateManager\.cache\._lookupAccount/vm\.stateManager\._cache\._lookupAccount/g' ./dist/bundle.js
