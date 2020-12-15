export VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH"
export VUE_APP_BASE_ROUTE="https://"$CIRCLE_BRANCH".tor.us"
if [ "$CIRCLE_BRANCH" = "lrc" ]
then
    export BUILD_MODE="$CIRCLE_BRANCH"
else
    export BUILD_MODE="basealpha"
fi

echo $VUE_APP_TORUS_BUILD_ENV
echo $VUE_APP_BASE_ROUTE
echo $BUILD_MODE
cross-env VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH" npm run pre-build && vue-cli-service build --mode "$BUILD_MODE"