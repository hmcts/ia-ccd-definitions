#!/bin/bash

FILE="definitions/appeal/json/AuthorisationCaseField.json"
LINE_WITH_STRING_TO_COPY_FROM="${1:-caseworker-ia-caseofficer}"
NEW_ROLE="${2:-caseworker-wa-task-configuration}"
OUTPUT="${3:-output.json}"

while IFS= read -r line
do
  echo "$line"
  echo "$line" >> ${OUTPUT}
  if [[ $line =~ "${LINE_WITH_STRING_TO_COPY_FROM}" ]] 
  then
    echo "${line/$LINE_WITH_STRING_TO_COPY_FROM/$NEW_ROLE}" >> ${OUTPUT}
  fi

done < "$FILE"
