#!/usr/bin/env bash

# Script to generate CCD definition files for different environments
# Usage: ./bin/generate-ccd-definition.sh [options]
# Options:
#   -e, --env ENV           Environment (dev, preview, demo, ithc, perftest, aat, prod, mirrord)
#   -p, --pr PR_NUMBER      PR number for preview environment (required when `-e preview` is specified)
#   -u, --user USERNAME     Username for mirrord environment (defaults to current user)
#   -s, --service SERVICE   Service name (default: ia-case-api)
#   -d, --dry-run           Show what would be done without actually generating files
#   -h, --help              Show this help message

# Default values
ENV="dev"
PR_NUMBER=""
USERNAME=""
SERVICE="ia-case-api"
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
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      echo "Usage: ./bin/generate-ccd-definition.sh [options]"
      echo "Options:"
      echo "  -e, --env ENV           Environment (dev, preview, demo, ithc, perftest, aat, prod, mirrord)"
      echo "  -p, --pr PR_NUMBER      PR number for preview environment (required when `-e preview` is specified)"
      echo "  -u, --user USERNAME     Username for mirrord environment (defaults to current user)"
      echo "  -s, --service SERVICE   Service name (default: ia-case-api)"
      echo "  -d, --dry-run           Show what would be done without actually generating files"
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

# Source environment variables
source default.env

# Set CCD_ENV
CCD_ENV="${ENV}"

# Get current branch for version (except for prod)
if [[ "${ENV}" == "prod" ]]; then
  CCD_DEF_VERSION=""
else
  CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16`
fi

# If mirrord environment and no username provided, get current user
if [[ "${ENV}" == "mirrord" && -z "${USERNAME}" ]]; then
  USERNAME=$(whoami)
  echo "No username provided, using current user: ${USERNAME}"
fi

# Set URLs based on environment, PR number, and username
if [[ "${ENV}" == "preview" && -n "${PR_NUMBER}" ]]; then
  # Custom URL for PR in preview environment
  CCD_DEF_IA_URL="http://${SERVICE}-pr-${PR_NUMBER}-java"
  CCD_DEF_AAC_URL="${npm_package_config_preview_aacUrl}"
elif [[ "${ENV}" == "mirrord" ]]; then
  # Custom URL for mirrord environment with username
  CCD_DEF_IA_URL="http://${SERVICE}-${USERNAME}-java"
  CCD_DEF_AAC_URL="${npm_package_config_preview_aacUrl}"
else
  # Default URLs from environment variables - using proper variable indirection
  IA_URL_VAR="npm_package_config_${ENV}_iaCaseUrl"
  AAC_URL_VAR="npm_package_config_${ENV}_aacUrl"
  CCD_DEF_IA_URL="${!IA_URL_VAR}"
  CCD_DEF_AAC_URL="${!AAC_URL_VAR}"
fi

# For dev environment, allow override from environment variables
if [[ "${ENV}" == "dev" ]]; then
  CCD_DEF_IA_URL="${IA_CASE_URL:-$CCD_DEF_IA_URL}"
  CCD_DEF_AAC_URL="${AAC_URL:-$CCD_DEF_AAC_URL}"
fi

echo "Generating CCD definition for environment: ${ENV}"
echo "Service URL: ${CCD_DEF_IA_URL}"
echo "AAC URL: ${CCD_DEF_AAC_URL}"

# If dry run, exit here
if [[ "${DRY_RUN}" == "true" ]]; then
  echo "Dry run - exiting without generating files"
  exit 0
fi

# # Run decryption for prod environment
# if [[ "${ENV}" == "prod" ]]; then
#   yarn decrypt
# fi

# Determine the output file name
if [[ "${ENV}" == "preview" && -n "${PR_NUMBER}" ]]; then
  OUTPUT_FILE="target/appeal/xlsx/ccd-appeal-config-${CCD_ENV}-pr${PR_NUMBER}.xlsx"
else
  OUTPUT_FILE="target/appeal/xlsx/ccd-appeal-config-${CCD_ENV}.xlsx"
fi

# Generate the definition
yarn copy-json && \
CCD_ENV="${CCD_ENV}" \
CCD_DEF_VERSION="${CCD_DEF_VERSION}" \
CCD_DEF_IA_URL="${CCD_DEF_IA_URL}" \
CCD_DEF_AAC_URL="${CCD_DEF_AAC_URL}" \
yarn generate-excel "${OUTPUT_FILE}"

if [ $? -eq 0 ]; then
  echo "CCD definition generated successfully: ${OUTPUT_FILE}"
else
  echo "Error generating CCD definition"
  exit 1
fi 