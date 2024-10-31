#!/usr/bin/env bash
source default.env
CCD_ENV=preview yarn copy-json && CCD_DEF_VERSION=`git branch | grep '* ' | cut -c -16` CCD_ENV=preview CCD_DEF_IA_URL=http://ia-case-api-pr-2378-java CCD_DEF_AAC_URL=http://aac-manage-case-assignment-aat.service.core-compute-aat.internal yarn generate-excel
