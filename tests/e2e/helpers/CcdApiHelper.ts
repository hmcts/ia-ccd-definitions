import {APIRequestContext, request} from "@playwright/test";
import {ccdDataStoreApiBaseUrl, createCase} from "../iacConfig";

export class CcdApiHelper {
    constructor() {

    }

    async validatePageData(pageId:string, event:string, caseData:unknown, uid, accessToken, s2sToken ) {
        const url: string = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/validate?pageId=${pageId}`;
        const apiRequestContext: APIRequestContext = await request.newContext();

        try {
            const response = await apiRequestContext.post(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        Authorization: `Bearer ${accessToken}`,
                        ServiceAuthorization: s2sToken
                    },
                data: caseData
            });

            if (!response.ok()) {
                if (response.status() === 422) {
                    const errorTextJson: string[] = (await response.json()).callbackErrors;
                    return errorTextJson;
                } else {
                    let errorText = await response.text();
                    throw new Error(
                        `Failed to Validate the page data: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                    );
                }
            }
            return new Array(1).fill('SUCCESS');
        } catch (error) {
            throw new Error(
                `An error occurred while trying to validate the page data: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };


    }
}