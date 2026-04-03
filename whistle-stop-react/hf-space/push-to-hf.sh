#!/bin/bash
# Push to Hugging Face Space
# Usage: ./push-to-hf.sh YOUR_HF_TOKEN
# Or set HF_TOKEN env var: HF_TOKEN=hf_xxx ./push-to-hf.sh

TOKEN="${1:-$HF_TOKEN}"
SPACE_NAME="whistle-stop"
USERNAME="truegleai"

if [ -z "$TOKEN" ]; then
  echo "Error: No HF token provided."
  echo "Usage: ./push-to-hf.sh hf_xxxxxxxxxxxx"
  echo "Get a token at: https://huggingface.co/settings/tokens"
  exit 1
fi

# Create space if it doesn't exist
echo "Creating space: $USERNAME/$SPACE_NAME..."
curl -s -X POST "https://huggingface.co/api/spaces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$USERNAME/$SPACE_NAME\", \"sdk\": \"static\"}" > /dev/null 2>&1

# Push files via git
echo "Setting up git repo..."
cd "$(dirname "$0")"

git init
git remote add origin "https://huggingface.co/spaces/$USERNAME/$SPACE_NAME"
git add -A
git commit -m "Initial deploy: Whistle Stop v2.0" || true

echo "Pushing to Hugging Face..."
echo "$TOKEN" | git -c credential.helper='store' push --force origin main 2>&1

# Cleanup credential helper
git config --local --unset credential.helper 2>/dev/null

echo ""
echo "Done! Visit: https://huggingface.co/spaces/$USERNAME/$SPACE_NAME"
