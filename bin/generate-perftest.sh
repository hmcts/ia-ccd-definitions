#!/usr/bin/env bash
source default.env
CCD_ENV=perftest yarn copy-json && CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16` CCD_ENV=perftest CCD_DEF_IA_URL=$npm_package_config_perftest_iaCaseUrl CCD_DEF_AAC_URL=$npm_package_config_perftest_aacUrl yarn generate-excel
