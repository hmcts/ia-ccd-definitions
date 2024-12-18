#!/usr/bin/env bash
source default.env
CCD_ENV=preview yarn copy-json && CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16` CCD_ENV=preview CCD_DEF_IA_URL=$npm_package_config_preview_iaCaseUrl CCD_DEF_AAC_URL=$npm_package_config_preview_aacUrl yarn generate-excel
