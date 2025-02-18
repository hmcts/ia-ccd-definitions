#!/usr/bin/env bash

source default.env

export CCD_ENV="hearings-preview"

yarn copy-json

CURRENT_BRANCH=$(git branch --show-current | cut -c -16)

export CCD_DEF_VERSION="$CURRENT_BRANCH"
export CCD_DEF_IA_URL="$npm_package_config_preview_iaCaseUrl"
export CCD_DEF_AAC_URL="$npm_package_config_preview_aacUrl"

yarn generate-excel