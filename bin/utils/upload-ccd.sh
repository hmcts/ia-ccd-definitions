#!/usr/bin/env bash

set -eu

# Default values
ENV="dev"
PR_NUMBER=""
USERNAME=$(whoami)
DRY_RUN=false

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
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  -e, --env ENV           Environment (dev, preview, mirrord)"
      echo "  -p, --pr PR_NUMBER      PR number for preview environment (required when '-e preview' is specified)"
      echo "  -d, --dry-run           Show what would be done without actually uploading"
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

# Define environment-specific configuration
case $ENV in
  dev)
    FILENAME="ccd-appeal-config-dev.xlsx"
    CCD_URL="http://localhost:4451"
    GENERATE_CMD="yarn generate-dev"
    TOKEN_ENV="local"
    ;;
  mirrord)
    FILENAME="ccd-appeal-config-mirrord.xlsx"
    CCD_URL="https://ccd-definition-store-ia-case-api-${USERNAME}-pr-1.preview.platform.hmcts.net"
    GENERATE_CMD="yarn generate -e mirrord"
    TOKEN_ENV="aat"
    ;;
  preview)
    FILENAME="ccd-appeal-config-preview-pr${PR_NUMBER}.xlsx"
    CCD_URL="https://ccd-definition-store-ia-case-api-pr-${PR_NUMBER}.preview.platform.hmcts.net"
    GENERATE_CMD="yarn generate -e preview -p ${PR_NUMBER}"
    TOKEN_ENV="aat"
    ;;
  aat)
    echo "upload-ccd aat"
    FILENAME="ccd-appeal-config-aat.xlsx"
    #CCD_URL="https://ccd-definition-store-ia-case-api-pr-2620.preview.platform.hmcts.net"
    CCD_URL="https://ccd-definition-store-api-aat.service.core-compute-aat.internal"
    GENERATE_CMD="corepack yarn generate -e aat"
    TOKEN_ENV="aat"
    az login --identity
    ;;
  *)
    echo "Error: Unsupported environment: ${ENV}"
    echo "Supported environments: dev, mirrord, preview"
    exit 1
    ;;
esac

echo "Environment: ${ENV}"
echo "File to upload: ${FILENAME}"
echo "CCD Definition Store URL: ${CCD_URL}"
echo "Token Environment: ${TOKEN_ENV}"

# If dry run, exit here
if [[ "${DRY_RUN}" == "true" ]]; then
  echo "Dry run - exiting without uploading"
  exit 0
fi

# Generate definition file
echo "Generating definition file for ${ENV} environment..."
${GENERATE_CMD}

# Run validation scripts
echo "Running validation checks..."
node bin/case-event-to-fields-duplicate-checker.js
node bin/check-missing-system-user-fields.js
node bin/auth-casefield-duplicate-checker.js

# Check if file exists before uploading
OUTPUT_PATH="target/appeal/xlsx/${FILENAME}"
if [ ! -f "${OUTPUT_PATH}" ]; then
  echo "Error: Generated file not found at ${OUTPUT_PATH}"
  exit 1
fi

# Upload to CCD using the appropriate token environment
echo "Uploading definition file to ${CCD_URL}..."
bin/utils/ccd-import-definition.sh -f "${FILENAME}" -u "${CCD_URL}" -e "${TOKEN_ENV}" 