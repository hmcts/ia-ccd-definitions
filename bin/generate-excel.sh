#!/usr/bin/env bash
set -eu

env="${CCD_ENV:-dev}"
json_dir="./target/appeal/json"
xlsx_out="./target/appeal/xlsx/ccd-appeal-config-${env}.xlsx"

./bin/process-definition.sh "${json_dir}" "${xlsx_out}" "${excludedFilenamePatterns}"
