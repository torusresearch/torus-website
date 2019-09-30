#!/usr/bin/env bash

# remove first line of service-worker.js, which imports precache-manifest.[manifestHash].js
echo "$(tail -n +2 ./dist/service-worker.js)" > ./dist/service-worker.js

# copy precache-manifest.[manifestHash].js into top of service-worker.js
for f in './dist/precache-manifest*'; do
  cat $f './dist/service-worker.js' > './temp'
  mv './temp' './dist/service-worker.js'
done
