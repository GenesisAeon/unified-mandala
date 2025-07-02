#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist/aws/lambda-edge"
ZIP="$ROOT/ghostshell-edge.zip"

pnpm run build

cd "$DIST"
zip -r "$ZIP" .

echo "Lambda package created at $ZIP"

if [ -n "${LAMBDA_FUNCTION_NAME:-}" ] && command -v aws >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$LAMBDA_FUNCTION_NAME" --zip-file "fileb://$ZIP"
fi
