import {APIRequestContext, Page, request} from "@playwright/test";

export class CcdApiHelper {

    constructor() {}

    async validatePageData(pageId:string, uid, accessToken, s2sToken, eventToken ) {
        const url: string = `https://ccd-data-store-api-ia-case-api-pr-2887.preview.platform.hmcts.net/caseworkers/${uid}/jurisdictions/iac/case-types/Asylum/validate?pageId=${pageId}`;
        const apiRequestContext: APIRequestContext = await request.newContext();

        try {
            const response = await apiRequestContext.post(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        Authorization: `Bearer ${accessToken}`,
                        ServiceAuthorization: s2sToken
                    },
                    data: {
                        data: {
                            appealReferenceNumber: 'LP/12212/2025',
                        },
                        event: {
                            id: 'startAppeal',
                            summary: '',
                            description: '',
                        },
                        // event_data: {
                        //     isAdmin: 'Yes',
                        //     sourceOfAppeal: 'rehydratedAppeal',
                        //     appealReferenceNumber: 'LH/20384/2025'
                        // },
                        event_token: eventToken,
                        ignore_warning: 'false'
                    }
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
            return new Array(1).fill('Success');
        } catch (error) {
            throw new Error(
                `An error occurred while trying to validate the page data: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };


    }
}