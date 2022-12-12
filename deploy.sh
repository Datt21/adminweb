#!/usr/bin/env bash
set -e
#upload files
BUCKET=ministop-koshikiapp-adminweb-dev
DISTRIBUTION_ID=E31GT8XH54R20F
npm run build:prod
aws s3 sync ./dist/kaimono s3://${BUCKET} --acl public-read --delete
aws s3 cp s3://${BUCKET}/index.html s3://${BUCKET}/index.html --metadata-directive REPLACE --cache-control max-age=0 --acl public-read
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths '/*'
