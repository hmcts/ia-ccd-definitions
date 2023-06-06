#!/usr/bin/env bash
source default.env
CCD_ENV=ithc yarn copy-json && CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16` CCD_ENV=ithc CCD_DEF_IA_URL=$npm_package_config_ithc_iaCaseUrl CCD_DEF_AAC_URL=$npm_package_config_ithc_aacUrl yarn generate-excel