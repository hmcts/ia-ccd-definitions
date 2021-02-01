#!/bin/bash

file="definitions/appeal/json/AuthorisationCaseField.json"
lineWithRoleToCopyFrom="${1:-caseworker-ia-caseofficer}"
newRole="${2:-caseworker-wa-task-configuration}"
output="${3:-output.json}"

while IFS= read -r line
do
  echo "$line"
  echo "$line" >> ${output}
  if [[ $line =~ "${lineWithRoleToCopyFrom}" ]] 
  then
    echo "${line/$lineWithRoleToCopyFrom/$newRole}" >> ${output}
  fi

done < "$file"
