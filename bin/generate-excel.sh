#!/usr/bin/env bash
set -eu

# ---- paths ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ---- inputs ----
env="${CCD_ENV:-dev}"
features_csv="${CCD_FEATURES:-${CCD_FEATURE:-}}"

# directories
base_dir="${ROOT_DIR}/definitions/appeal/json"
feature_root="${ROOT_DIR}/definitions/appeal/features"
staged_dir="${ROOT_DIR}/target/appeal/staged-json"
xlsx_out="${ROOT_DIR}/target/appeal/xlsx/ccd-appeal-config-${env}.xlsx"

rm -rf "${staged_dir}"
mkdir -p "${staged_dir}" "$(dirname "${xlsx_out}")"

# copy base definitions (always included)
cp -R "${base_dir}/." "${staged_dir}/"

# optionally overlay feature folders
if [ -n "${features_csv}" ]; then
  IFS=',' read -r -a features <<< "${features_csv}"
  for feature in "${features[@]}"; do
    feature_dir="${feature_root}/${feature}"
    if [ ! -d "${feature_dir}" ]; then
      echo "Feature folder not found: ${feature_dir}"
      exit 1
    fi
    cp -R "${feature_dir}/." "${staged_dir}/"
  done
fi

# exclusion rules
if [ -n "${CCD_EXCLUDED_FILENAME_PATTERNS:-}" ]; then
  excludedFilenamePatterns="-e ${CCD_EXCLUDED_FILENAME_PATTERNS}"
else
  case "${env}" in
    prod|aat|staging) excludedFilenamePatterns="-e *-nonprod.json" ;;
    preview|demo|perftest|ithc|local|dev) excludedFilenamePatterns="-e *-prod.json" ;;
    *) echo "Unknown CCD_ENV: ${env}"; exit 1 ;;
  esac
fi

echo "Environment: ${env}"
echo "Features: ${features_csv:-<none>}"
echo "Exclusions: ${excludedFilenamePatterns}"

# generate xlsx
"${SCRIPT_DIR}/utils/process-definition.sh" \
  "${staged_dir}" \
  "${xlsx_out}" \
  "${excludedFilenamePatterns}"
