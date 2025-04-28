#!/usr/bin/env bash

# Script to upload CCD definition files to different environments
# Usage: ./bin/upload-ccd-definition.sh [options]
# Options:
#   -e, --env ENV           Environment (dev, mirrord, preview)
#   -p, --pr PR_NUMBER      PR number for preview environment (required when `-e preview` is specified)
#   -u, --user USERNAME     Username for mirrord environment (defaults to current user)
#   -s, --service SERVICE   Service name (default: ia-case-api)
#   -h, --help              Show this help message

# Default values
ENV="dev"
PR_NUMBER=""
USERNAME=""
SERVICE="ia-case-api"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -e|--env)
      ENV="$2"
      shift
      shift
      ;;
    -p|--pr)
      PR_NUMBER="$2"
      shift
      shift
      ;;
    -u|--user)
      USERNAME="$2"
      shift
      shift
      ;;
    -s|--service)
      SERVICE="$2"
      shift
      shift
      ;;
    -h|--help)
      echo "Usage: ./bin/upload-ccd-definition.sh [options]"
      echo "Options:"
      echo "  -e, --env ENV           Environment (dev, mirrord, preview)"
      echo "  -p, --pr PR_NUMBER      PR number for preview environment (required when `-e preview` is specified)"
      echo "  -u, --user USERNAME     Username for mirrord environment (defaults to current user)"
      echo "  -s, --service SERVICE   Service name (default: ia-case-api)"
      echo "  -h, --help              Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check for required parameters
if [[ "${ENV}" == "preview" && -z "${PR_NUMBER}" ]]; then
  echo "Error: PR number (-p, --pr) is required for preview environment"
  echo "Usage example: $0 -e preview -p 1234"
  exit 1
fi

# If mirrord environment and no username provided, get current user
if [[ "${ENV}" == "mirrord" && -z "${USERNAME}" ]]; then
  USERNAME=$(whoami)
  echo "No username provided, using current user: ${USERNAME}"
fi

# First generate the CCD definition for the specified environment
echo "Generating CCD definition for environment: ${ENV}"

case $ENV in
  preview)
    yarn generate-ccd-definition.sh -e preview -p ${PR_NUMBER} -s ${SERVICE}
    ;;
  mirrord)
    yarn generate-ccd-definition.sh -e mirrord -u ${USERNAME} -s ${SERVICE}
    ;;
  dev|*)
    yarn generate-dev
    ;;
esac

# Exit if generation fails
if [ $? -ne 0 ]; then
  echo "Error generating CCD definition"
  exit 1
fi

# Set the upload URL and token scripts based on environment
case $ENV in
  dev)
    # For local docker environment
    if [ -z "${CCD_DOCKER_PATH}" ]; then
      echo "Error: CCD_DOCKER_PATH environment variable not set"
      exit 1
    fi
    
    UPLOAD_URL="http://127.0.0.1:4451/import"
    USER_TOKEN=$(${CCD_DOCKER_PATH}/bin/idam-user-token.sh)
    SERVICE_TOKEN=$(${CCD_DOCKER_PATH}/bin/idam-service-token.sh)
    DEFINITION_FILE="target/appeal/xlsx/ccd-appeal-config-dev.xlsx"
    ;;
    
  preview)
    # For preview environment
    UPLOAD_URL="http://ccd-definition-store-${SERVICE}-pr-${PR_NUMBER}"
    # You may need to adjust the token scripts based on your setup
    USER_TOKEN=$(./bin/idam-user-token-preview.sh)
    SERVICE_TOKEN=$(./bin/idam-service-token-preview.sh)
    DEFINITION_FILE="target/appeal/xlsx/ccd-appeal-config-preview.xlsx"
    ;;
    
  mirrord)
    # For mirrord environment
    UPLOAD_URL="http://ccd-definition-store-${SERVICE}-${USERNAME}"
    # You may need to adjust the token scripts based on your setup
    USER_TOKEN=$(./bin/idam-user-token-mirrord.sh)
    SERVICE_TOKEN=$(./bin/idam-service-token-mirrord.sh)
    DEFINITION_FILE="target/appeal/xlsx/ccd-appeal-config-mirrord.xlsx"
    ;;
    
  *)
    echo "Unsupported environment: ${ENV}"
    exit 1
    ;;
esac

# Check if file exists
if [ ! -f "${DEFINITION_FILE}" ]; then
  echo "Error: Definition file not found: ${DEFINITION_FILE}"
  exit 1
fi

echo "Uploading CCD definition to ${ENV} environment: ${UPLOAD_URL}"
echo "Definition file: ${DEFINITION_FILE}"

# Upload the definition file
curl ${UPLOAD_URL} \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "ServiceAuthorization: Bearer ${SERVICE_TOKEN}" \
  -F "file=@${DEFINITION_FILE}"

if [ $? -eq 0 ]; then
  echo ""
  echo "CCD definition uploaded successfully!"
else
  echo ""
  echo "Error uploading CCD definition"
  exit 1
fi 