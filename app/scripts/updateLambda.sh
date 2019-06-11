
#!/bin/bash
git clone git@github.com:torusresearch/torus-serverless.git ~/torus-serverless
PACKAGE_VERSION=$(cat package.json | grep buildVersion | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
cd ~/torus-serverless/cloudfront-redirect/
sed -i -e "s|const GLOBAL_VERSION.*|const GLOBAL_VERSION = \"$PACKAGE_VERSION\";|g" handler.js
git config user.email "chaitanya.potti@gmail.com"
git config user.name "chaitanyapotti"
git diff --quiet && git diff --staged --quiet || (git commit -am "Updating version" && git push origin master)
zip lambda-code handler.js
aws lambda update-function-code --function-name torus-routing --publish --zip-file "fileb://lambda-code.zip"
aws cloudfront get-distribution-config --id $CLOUDFRONT_DISTRIBUTION_ID > cf_config.json
ETAG=$(cat cf_config.json | grep ETag | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
node ~/torus-website/app/scripts/createUpdatedDistributionConfig.js
aws cloudfront update-distribution --distribution-config "file://updated_cf_config.json" --id $CLOUDFRONT_DISTRIBUTION_ID --if-match "$ETAG"