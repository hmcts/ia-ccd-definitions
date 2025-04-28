#!/bin/bash
## Returns a valid IDAM user token for the preview environment

USERNAME=${1:-ccd-import@fake.hmcts.net}
PASSWORD=${2:-London01}
REDIRECT_URI="http://localhost:3002/oauth2/callback"
CLIENT_ID="ccd_gateway"
CLIENT_SECRET="OOOOOOOOOOOOOOOO"
SCOPE="openid%20profile%20roles"

# Replace with the correct IDAM URL for preview environment
IDAM_URL="http://sidam-api"

curl --silent --show-error \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -XPOST "${IDAM_URL}/o/token?grant_type=password&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USERNAME}&password=${PASSWORD}&scope=${SCOPE}" -d "" | jq -r .access_token 