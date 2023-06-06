#!/usr/bin/env bash
pushd ccd-definition-processor && yarn json2xlsx -D ../target/appeal/json -o ../target/appeal/xlsx/ccd-appeal-config-${CCD_ENV:-dev}.xlsx && popd
