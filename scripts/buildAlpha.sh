export VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH"
if [ "$CIRCLE_BRANCH" = "lrc" ]
then
    export BUILD_MODE="$CIRCLE_BRANCH"
else
    export BUILD_MODE="basealpha"
fi

echo $VUE_APP_TORUS_BUILD_ENV
echo $BUILD_MODE
cross-env VUE_APP_TORUS_BUILD_ENV="$CIRCLE_BRANCH" npm run pre-build && vue-cli-service build --mode "$BUILD_MODE"