#!/usr/bin/env bash
set -eu

env="${CCD_ENV:-dev}"
json_dir="./target/appeal/json"
xlsx_out="./target/appeal/xlsx/ccd-appeal-config-${env}.xlsx"
mkdir -p "$(dirname "${xlsx_out}")"

if [ -n "${CCD_EXCLUDED_FILENAME_PATTERNS:-}" ]; then
  excludedFilenamePatterns="-e ${CCD_EXCLUDED_FILENAME_PATTERNS}"
else
  case "${env}" in
    prod|aat|staging) excludedFilenamePatterns="-e UserProfile.json,*-nonprod.json" ;;
    preview|demo|perftest|ithc|local|dev) excludedFilenamePatterns="-e UserProfile.json,*-prod.json" ;;
    *) echo "Unknown CCD_ENV: ${env}"; exit 1 ;;
  esac
fi

./bin/process-definition.sh "${json_dir}" "${xlsx_out}" "${excludedFilenamePatterns}"
