#!/usr/bin/env bash
source default.env
CCD_ENV=prod yarn copy-json && yarn decrypt && CCD_DEF_VERSION='' CCD_ENV=prod CCD_DEF_IA_URL=$npm_package_config_prod_iaCaseUrl CCD_DEF_AAC_URL=$npm_package_config_prod_aacUrl yarn generate-excel
