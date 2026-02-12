#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

env="${CCD_ENV:-dev}"
json_dir="${ROOT_DIR}/target/appeal/json"
xlsx_out="${ROOT_DIR}/target/appeal/xlsx/ccd-appeal-config-${env}.xlsx"

mkdir -p "$(dirname "${xlsx_out}")"

if [ -n "${CCD_EXCLUDED_FILENAME_PATTERNS:-}" ]; then
  excludedFilenamePatterns="-e ${CCD_EXCLUDED_FILENAME_PATTERNS}"
else
  case "${env}" in
    prod|aat|staging) excludedFilenamePatterns="-e *-nonprod.json" ;;
    preview|demo|perftest|ithc|local|dev) excludedFilenamePatterns="-e *-prod.json" ;;
    *) echo "Unknown CCD_ENV: ${env}"; exit 1 ;;
  esac
fi

"${SCRIPT_DIR}/utils/process-definition.sh" "${json_dir}" "${xlsx_out}" "${excludedFilenamePatterns}"
