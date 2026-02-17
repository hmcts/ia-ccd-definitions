#!/usr/bin/env bash

set -eu

# Default values
DEFAULT_FILENAME="ccd-appeal-config-mirrord.xlsx"
DEFAULT_DEFINITION_STORE_URL="http://localhost:4451"
DEFAULT_TOKEN_ENV="local" # Default to local token environment

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -f|--filename)
      FILENAME="$2"
      shift
      shift
      ;;
    -u|--url)
      CCD_DEFINITION_STORE_API_BASE_URL="$2"
      shift
      shift
      ;;
    -e|--env)
      TOKEN_ENV="$2"
      shift
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  -f, --filename FILENAME    Name of the CCD definition file to upload (default: ${DEFAULT_FILENAME})"
      echo "  -u, --url URL              CCD Definition Store API base URL (default: ${DEFAULT_DEFINITION_STORE_URL})"
      echo "  -e, --env ENV              Token environment to use (local, aat) (default: ${DEFAULT_TOKEN_ENV})"
      echo "  -h, --help                 Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Set default values if not provided
FILENAME="${FILENAME:-$DEFAULT_FILENAME}"
CCD_DEFINITION_STORE_API_BASE_URL="${CCD_DEFINITION_STORE_API_BASE_URL:-$DEFAULT_DEFINITION_STORE_URL}"
TOKEN_ENV="${TOKEN_ENV:-$DEFAULT_TOKEN_ENV}"

# Get the project root directory (assuming script is in bin/utils)
dir=$(dirname ${0})
project_root=$(cd "${dir}/../.." && pwd)
filepath="${project_root}/target/appeal/xlsx/${FILENAME}"

# Check if file exists
if [ ! -f "${filepath}" ]; then
  echo "Error: File not found at ${filepath}"
  exit 1
fi

uploadFilename="$(date +"%Y%m%d-%H%M%S")-${FILENAME}"

# Generate tokens based on environment
echo "Using token environment: ${TOKEN_ENV}"

if [[ "${TOKEN_ENV}" == "local" ]]; then
  # Check for CCD_DOCKER_PATH environment variable
  if [[ -z "${CCD_DOCKER_PATH:-}" ]]; then
    echo "Warning: CCD_DOCKER_PATH environment variable is not set."
    echo "Using local token scripts directly..."
    userToken=$(${dir}/idam-user-token-local.sh)
    serviceToken=$(${dir}/idam-service-token-local.sh)
  else
    echo "Using CCD Docker token scripts..."
    userToken=$(${CCD_DOCKER_PATH}/bin/idam-user-token.sh)
    serviceToken=$(${CCD_DOCKER_PATH}/bin/idam-service-token.sh)
  fi
else
  # For non-local environments, source AAT variables and use AAT token scripts
  echo "Loading AAT environment variables..."
  source ${dir}/load-env-variables.sh
  
  userToken=$(${dir}/idam-user-token-aat.sh)
  serviceToken=$(${dir}/idam-service-token-aat.sh)
fi

echo "userToken: ${userToken}"
echo "serviceToken: ${serviceToken}"

echo "Authorization userToken obtained"
echo "Authorization serviceToken obtained"

echo "Uploading ${FILENAME} to ${CCD_DEFINITION_STORE_API_BASE_URL}"

uploadResponse=$(curl --insecure --verbose --silent -w "\n%{http_code}" --show-error -X POST \
  ${CCD_DEFINITION_STORE_API_BASE_URL}/import \
  -H "Authorization: Bearer ${userToken}" \
  -H "ServiceAuthorization: Bearer ${serviceToken}" \
  -F "file=@${filepath};filename=${uploadFilename}")

upload_http_code=$(echo "$uploadResponse" | tail -n1)
upload_response_content=$(echo "$uploadResponse" | sed '$d')

if [[ "${upload_http_code}" == '504' ]]; then
  for try in {1..10}
  do
    sleep 5
    echo "Checking status of ${FILENAME} (${uploadFilename}) upload (Try ${try})"
    audit_response=$(curl --insecure --silent --show-error -X GET \
      ${CCD_DEFINITION_STORE_API_BASE_URL}/api/import-audits \
      -H "Authorization: Bearer ${userToken}" \
      -H "ServiceAuthorization: Bearer ${serviceToken}")

    if [[ ${audit_response} == *"${uploadFilename}"* ]]; then
      echo "${FILENAME} (${uploadFilename}) uploaded"
      exit 0
    fi
  done
else
  if [[ "${upload_response_content}" == 'Case Definition data successfully imported' ]]; then
    echo "${FILENAME} (${uploadFilename}) uploaded"
    exit 0
  fi
fi

echo "${FILENAME} (${uploadFilename}) upload failed (${upload_response_content}) uploadResponse: ${uploadResponse}"
exit 1
