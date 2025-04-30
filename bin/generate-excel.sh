#!/usr/bin/env bash
OUTPUT_FILE="${1:-../target/appeal/xlsx/ccd-appeal-config-${CCD_ENV:-dev}.xlsx}"
pushd ccd-definition-processor && yarn json2xlsx -D ../target/appeal/json -o "${OUTPUT_FILE}" && popd
