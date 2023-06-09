#!/usr/bin/env bash
source default.env
CCD_ENV=demo yarn copy-json && CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16` CCD_ENV=demo CCD_DEF_IA_URL=$npm_package_config_demo_iaCaseUrl CCD_DEF_AAC_URL=$npm_package_config_demo_aacUrl yarn generate-excel
