#!/usr/bin/env bash

# Get the raw filename from the input (which could be an absolute or relative path)
INPUT_FILE="${1:-../target/appeal/xlsx/ccd-appeal-config-${CCD_ENV:-dev}.xlsx}"
INPUT_FILE_BAIL="${2:-../target/bail/xlsx/ccd-bail-config-${CCD_ENV:-dev}.xlsx}"
FILENAME=$(basename "${INPUT_FILE}")
FILENAME_BAIL=$(basename "${INPUT_FILE}")

# Check if the input is an absolute path or a relative path
if [[ "${INPUT_FILE}" == /* ]]; then
  # Absolute path - use as is
  OUTPUT_FILE="${INPUT_FILE}"
else
  # Relative path from workspace root - adjust based on pushd into ccd-definition-processor
  OUTPUT_FILE="../${INPUT_FILE}"
fi

# Check if the input is an absolute path or a relative path
if [[ "${INPUT_FILE_BAIL}" == /* ]]; then
  # Absolute path - use as is
  OUTPUT_FILE_BAIL="${INPUT_FILE_BAIL}"
else
  # Relative path from workspace root - adjust based on pushd into ccd-definition-processor
  OUTPUT_FILE_BAIL="../${INPUT_FILE_BAIL}"
fi

echo "Generating Appeals Excel file: ${INPUT_FILE}"
# Ensure the directory exists
mkdir -p $(dirname "${INPUT_FILE}")

pushd ccd-definition-processor && yarn json2xlsx -D ../target/appeal/json -o "${OUTPUT_FILE}" && popd

echo "Generating Bail Excel file: ${INPUT_FILE_BAIL}"
# Ensure the directory exists
mkdir -p $(dirname "${INPUT_FILE_BAIL}")

pushd ccd-definition-processor && yarn json2xlsx -D ../target/bail/json -o "${OUTPUT_FILE_BAIL}" && popd
