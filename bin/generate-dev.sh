#!/usr/bin/env bash
source default.env
CCD_ENV=dev yarn copy-json && CCD_DEF_VERSION=$(git branch | grep '* ' | cut -c -16) CCD_ENV=dev CCD_DEF_IA_URL=${IA_CASE_URL:-$npm_package_config_dev_iaCaseUrl} CCD_DEF_AAC_URL=${AAC_URL:-$npm_package_config_dev_aacUrl} yarn generate-excel
