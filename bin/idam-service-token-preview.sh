#!/bin/bash
## Returns a valid IDAM service token for the preview environment

microservice="${1:-ccd_gw}"

# Replace with the correct S2S URL for preview environment
S2S_URL="http://service-auth-provider-api"

curl --silent --show-error -X POST \
  -H "Content-Type: application/json" \
  -d '{"microservice":"'${microservice}'"}' \
  ${S2S_URL}/testing-support/lease 