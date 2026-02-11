#!/bin/bash

set -eu

environment=${1:-prod}
activateShutter${2:-false}

if [ ${environment} == preview ]; then
   excludedFilenamePatterns="-e *-prod.json"
elif [ ${environment} == demo ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-prod.json"
elif [ ${environment} == perftest ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-prod.json"
elif [ ${environment} == ithc ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-prod.json"
elif [ ${environment} == local ]; then
  # upload doesn't currently work with this command due to CUI files
  excludedFilenamePatterns="-e *-prod.json"
elif [ ${environment} == aat ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-nonprod.json"
elif [ ${environment} == prod ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-nonprod.json"
elif [ ${environment} == staging ]; then
  excludedFilenamePatterns="-e UserProfile.json,*-nonprod.json"
else
  echo "ERROR! You are passing an environment that is not known by the script!"
  echo "       Either add the new environment to the script or specify a supported environment!"
  exit 1
fi}

# deciding which environment should be excluded for unshuttered/shuttered
if [ "$activateShutter" = true ] ; then
  echo "We are activating shuttered file for $environment"
  excludedFilenamePatterns="${excludedFilenamePatterns},AuthorisationCaseType-unshuttered.json"
  echo "${excludedFilenamePatterns}"
else
  echo "We are activating unshuttered file for $environment"
  excludedFilenamePatterns="${excludedFilenamePatterns},AuthorisationCaseType-shuttered.json"
  echo "${excludedFilenamePatterns}"
fi

#build paths for repo root directory and define directories and files based on root dir
root_dir=$(realpath $(dirname ${0})/..)
config_dir=${root_dir}/ccd-definition
build_dir=${root_dir}/build/ccd-release-config
github_dir=${root_dir}/build/github-release
release_definition_output_file=${build_dir}/ia-ccd-${environment}.xlsx
github_file=${github_dir}/ia-ccd-${environment}.xlsx

#create output dir if missing
mkdir -p ${build_dir}
mkdir -p ${github_dir}

# build the ccd definition file
${root_dir}/bin/utils/process-definition.sh ${config_dir} ${release_definition_output_file} "${excludedFilenamePatterns}"

#copy built file to git release location
cp ${release_definition_output_file} ${github_file}