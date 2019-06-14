
#!/bin/bash
git clone git@github.com:torusresearch/torus-serverless.git ~/torus-serverless
PACKAGE_VERSION=$(cat package.json | grep buildVersion | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
FOLDER=''
if [ "$CIRCLE_BRANCH" == 'master' ]; then
  FOLDER='cloudfront-redirect'
  FUNCTION_NAME='torus-routing'
  CLOUDFRONTID=$CLOUDFRONT_DISTRIBUTION_ID
elif [ "$CIRCLE_BRANCH" == 'staging' ]; then
  FOLDER='cloudfront-staging-redirect'
  FUNCTION_NAME='torus-staging-routing'
  CLOUDFRONTID=$CLOUDFRONT_STAGING_DISTRIBUTION_ID
fi
cd ~/torus-serverless/$FOLDER
sed -i -e "s|const GLOBAL_VERSION.*|const GLOBAL_VERSION = \"$PACKAGE_VERSION\";|g" index.js
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git diff --quiet && git diff --staged --quiet || (git commit -am "Updating version" && git push origin master)
zip lambda-code index.js
aws lambda update-function-code --function-name $FUNCTION_NAME --publish --zip-file "fileb://lambda-code.zip"
aws cloudfront get-distribution-config --id $CLOUDFRONTID > cf_config.json
ETAG=$(cat cf_config.json | grep ETag | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
node ~/torus-website/app/scripts/createUpdatedDistributionConfig.js
aws cloudfront update-distribution --distribution-config "file://updated_cf_config.json" --id $CLOUDFRONTID --if-match "$ETAG"