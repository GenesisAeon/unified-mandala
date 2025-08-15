#!/bin/bash
set -euo pipefail

# Deploy GhostShellAgent as Lambda@Edge using CloudFormation
# Requires awscli and an S3 bucket in us-east-1 (Lambda@Edge region).

ROOT="$(cd "$(dirname "$0")" && pwd)"
STACK_NAME=${STACK_NAME:-ghostshell-edge}
BUCKET=${BUCKET:?set BUCKET to S3 bucket name}
KEY=${KEY:-ghostshell-edge.zip}
REGION=${REGION:-us-east-1}

# Package Lambda and upload to S3
"$ROOT/../../scripts/package-lambda-edge.sh"
aws s3 cp "$ROOT/../../ghostshell-edge.zip" "s3://$BUCKET/$KEY"

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file "$ROOT/template.yaml" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides BucketName=$BUCKET CodeKey=$KEY

