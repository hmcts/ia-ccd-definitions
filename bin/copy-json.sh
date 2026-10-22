#!/usr/bin/env bash

mkdir -p target/appeal/json target/appeal/xlsx

find definitions/appeal/json -maxdepth 1 -type f -name '*.json' ! -name '*-nonprod.json' \
  -exec cp {} target/appeal/json/ \;

cp definitions/appeal/env/${CCD_ENV:-dev}/*.json target/appeal/json/

if [[ "${INCLUDE_NON_PROD}" == "true" ]]; then
  for nonprod_file in definitions/appeal/json/*-nonprod.json; do
    [[ -f "$nonprod_file" ]] || continue

    base_name=$(basename "$nonprod_file" -nonprod.json)
    target_file="target/appeal/json/${base_name}.json"

    if [[ -f "$target_file" ]]; then
      jq -s '.[0] + .[1]' "$target_file" "$nonprod_file" > "${target_file}.tmp" \
        && mv "${target_file}.tmp" "$target_file"
    fi
  done
fi
mkdir -p target/bail/json && mkdir -p target/bail/xlsx && cp definitions/bail/json/*.json target/bail/json/ && cp definitions/bail/env/${CCD_ENV:-dev}/*.json target/bail/json/
