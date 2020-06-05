#!/usr/bin/env bash
rm -rf target/*

for ROLE in caseworker-ia-legalrep-solicitor citizen caseworker-ia-caseofficer caseworker-ia-system caseworker-ia-iacjudge caseworker-ia-admofficer caseworker-ia-homeofficeapc caseworker-ia-homeofficelart caseworker-ia-homeofficepou caseworker-ia-respondentofficer;
do
  export ROLES=${ROLE} && node bin/generate_state_diagram.js && java -jar lib/plantuml.jar target/state_diagram.txt;
  cp target/state_diagram.png target/${ROLE}.png;
done
