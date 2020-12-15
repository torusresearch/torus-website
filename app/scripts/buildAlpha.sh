export VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH"
export VUE_APP_BASE_ROUTE="https://"$CIRCLE_BRANCH".tor.us"
echo $VUE_APP_TORUS_BUILD_ENV
echo $VUE_APP_BASE_ROUTE
cross-env VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH" npm run pre-build && vue-cli-service build --mode baselrc