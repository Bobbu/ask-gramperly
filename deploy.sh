#!/bin/bash

# Deploy script for Ask Gramperly
# This script:
# 1. Builds and deploys the CDK stack to AWS
# 2. Invalidates the CloudFront cache to ensure new content is served immediately
# 3. Returns to the project root directory

set -e  # Exit on error

echo "🚀 Starting deployment for Ask Gramperly..."

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Step 1: Deploy via CDK
echo ""
echo "📦 Step 1: Building and deploying CDK stack..."
cd aws-cdk
npm run cdkdeploy

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
echo "   - CDK stack updated"
echo "   - CloudFront cache invalidated"
echo "   - Distribution ID: $DISTRIBUTION_ID"

# Step 3: Return to original directory
cd "$ORIGINAL_DIR"
