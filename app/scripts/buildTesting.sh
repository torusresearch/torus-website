npm run build:staging
cd dist/
aws s3 rm s3://staging.tor.us/v0.2.12 --recursive
aws s3 cp . s3://staging.tor.us/v0.2.12 --recursive
TEMPINVALIDATION=$(aws cloudfront create-invalidation --distribution-id E3S3OGA822BEAK --paths /v0.2.12/* | grep "\"Id\"" | awk -F: '{ print $2 }' | sed 's/[",]//g')
cd ..
watch -n 5 "aws cloudfront get-invalidation --id$TEMPINVALIDATION --distribution-id E3S3OGA822BEAK"