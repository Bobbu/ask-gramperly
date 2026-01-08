#!/bin/bash

# Deploy script for Ask Gramperly
# This script:
# 1. Builds and deploys the CDK stack to AWS (Lambda, API Gateway, S3, etc.)
# 2. Invalidates the CloudFront cache to ensure new content is served immediately
# 3. Returns to the project root directory

set -e  # Exit on error

echo "🚀 Starting deployment for Ask Gramperly..."

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Step 1: Deploy via CDK (includes Angular build, Lambda, API Gateway, and S3)
echo ""
echo "📦 Step 1: Building and deploying CDK stack..."
cd aws-cdk
npm run cdkdeploy 2>&1 | tee /tmp/cdk-deploy-output.txt

# Extract the Search API URL from CDK output
SEARCH_API_URL=$(grep -o 'https://[a-z0-9]*\.execute-api\.[a-z0-9-]*\.amazonaws\.com/prod/' /tmp/cdk-deploy-output.txt | head -1 || echo "")

# Step 2: Invalidate CloudFront cache
echo ""
echo "🔄 Step 2: Invalidating CloudFront cache..."
DISTRIBUTION_ID="EVBARN2K870NX"
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --query 'Invalidation.{ID:Id,Status:Status,CreateTime:CreateTime}' \
  --output table

echo ""
echo "✅ Deployment complete!"
echo "   - CDK stack updated (Lambda, API Gateway, S3)"
echo "   - CloudFront cache invalidated"
echo "   - Distribution ID: $DISTRIBUTION_ID"
if [ -n "$SEARCH_API_URL" ]; then
  echo "   - Search API URL: $SEARCH_API_URL"
  echo ""
  echo "📝 NOTE: If this is your first deployment, update the searchApiUrl in:"
  echo "   - src/environments/environment.ts"
  echo "   - src/environments/environment.prod.ts"
  echo "   Then run this script again."
fi

# Step 3: Return to original directory
cd "$ORIGINAL_DIR"
