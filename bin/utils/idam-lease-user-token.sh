#!/usr/bin/env bash

set -e

username=${DEFINITION_IMPORTER_USERNAME}
password=${DEFINITION_IMPORTER_PASSWORD}

IDAM_URL=https://idam-api.aat.platform.hmcts.net

clientSecret=${CCD_API_GATEWAY_IDAM_CLIENT_SECRET}
redirectUri=${CCD_IDAM_REDIRECT_URL}

code=$(curl --insecure --fail --show-error --silent -X POST --user "${username}:${password}" "${IDAM_URL}/oauth2/authorize?redirect_uri=${redirectUri}&response_type=code&client_id=ccd_admin" -d "" | docker run --rm --interactive ghcr.io/jqlang/jq:latest -r .code)

#echo "code: ${code}"

curl --insecure --fail --show-error --silent -X POST -H "Content-Type: application/x-www-form-urlencoded" --user "ccd_admin:${clientSecret}" "${IDAM_URL}/oauth2/token?code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code" -d "" | docker run --rm --interactive ghcr.io/jqlang/jq:latest -r .access_token
