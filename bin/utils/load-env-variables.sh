#!/usr/bin/env bash

export IA_CCD_ADMIN_USERNAME=$(az keyvault secret show --vault-name ia-aat --name ccd-importer-username --query value -o tsv)
export IA_CCD_ADMIN_PASSWORD=$(az keyvault secret show --vault-name ia-aat --name ccd-importer-password --query value -o tsv)
export IDAM_API_BASE_URL=https://idam-api.aat.platform.hmcts.net
export ADMIN_WEB_IDAM_SECRET=$(az keyvault secret show --vault-name ccd-aat --name  ccd-admin-web-oauth2-client-secret --query value -o tsv)
export SERVICE_AUTH_PROVIDER_API_BASE_URL=http://rpe-service-auth-provider-aat.service.core-compute-aat.internal