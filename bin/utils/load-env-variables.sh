#!/usr/bin/env bash

export DEFINITION_IMPORTER_USERNAME=$(az keyvault secret show --vault-name ia-aat --name ccd-importer-username --query value -o tsv)
export DEFINITION_IMPORTER_PASSWORD=$(az keyvault secret show --vault-name ia-aat --name ccd-importer-password --query value -o tsv)
export IDAM_BASE_URL=https://idam-api.aat.platform.hmcts.net
export CCD_API_GATEWAY_IDAM_CLIENT_SECRET=$(az keyvault secret show --vault-name ccd-aat --name  ccd-admin-web-oauth2-client-secret --query value -o tsv)
export CCD_IDAM_REDIRECT_URL=https://ccd-case-management-web-aat.service.core-compute-aat.internal/oauth2redirect

