#!/usr/bin/env bash
IS_BAIL=$1
if [[ "${IS_BAIL}" == "true" ]]; then
  pushd ccd-definition-processor yarn xlsx2json -D ../definitions/bail/json -i ../definitions/bail/xlsx/ccd-bail-config-base.xlsx && popd && pretty-quick --pattern 'bail/**/json/**.json' && sed -e 's+http://ia-case-api:8090+${CCD_DEF_IA_URL}+g' ./definitions/bail/json/CaseEvent.json  > ./definitions/bail/json/CaseEvent.json.new && mv ./definitions/bail/json/CaseEvent.json.new ./definitions/bail/json/CaseEvent.json && mv definitions/bail/json/UserProfile.json definitions/bail/env/${CCD_ENV:-dev}/UserProfile.json
else
  pushd ccd-definition-processor yarn xlsx2json -D ../definitions/appeal/json -i ../definitions/appeal/xlsx/ccd-appeal-config-base.xlsx && popd && pretty-quick --pattern 'appeal/**/json/**.json' && sed -e 's+http://ia-case-api:8090+${CCD_DEF_IA_URL}+g' ./definitions/appeal/json/CaseEvent.json  > ./definitions/appeal/json/CaseEvent.json.new && mv ./definitions/appeal/json/CaseEvent.json.new ./definitions/appeal/json/CaseEvent.json && mv definitions/appeal/json/UserProfile.json definitions/appeal/env/${CCD_ENV:-dev}/UserProfile.json
fi
