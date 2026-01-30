import {APIRequestContext, request} from "@playwright/test";
import {ccdDataStoreApiBaseUrl, createCase, documentManagementStoreApiBaseUrl} from "../iacConfig";
import fs from "fs";
import path from "path";

export class CcdApiHelper {
    constructor() {

    }

    async validatePageData(pageId:string, caseData:unknown, uid, accessToken, s2sToken ) {
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

            if (!response.ok() && !(response.status() === 422)) {
                throw new Error(
                    `Failed to Validate the page data: ${response.status()} - ${await response.text()}. Ensure your VPN is connected or check your URL/SECRET.`
                    );
            }
            return response;
        } catch (error) {
            throw new Error(
                `An error occurred while trying to validate the page data: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };
    };


    async uploadDocument(accessToken, s2sToken) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const file = path.resolve("./tests/documents", "TEST_DOCUMENT_1.pdf");
        const document = fs.readFileSync(file);

        const response = await apiRequestContext.post(documentManagementStoreApiBaseUrl + "/documents", {
            headers: {
                Accept: "*/*",
                ContentType: "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
                ServiceAuthorization: s2sToken
            },
            multipart: {
                files: {
                    name: file,
                    mimeType: "application/pdf",
                    buffer: document,
                },
                key: "file",
                type: "file",
                classification: "PUBLIC"
            },
        });
        const body = await response.json();
        return body._embedded.documents[0]._links.self.href;
    }

//     async startEvent(eventName, caseId, accessToken, s2sToken) {
//         let url = ccdDataStoreApiBaseUrl;
//         if (caseId) {
//             url += `/cases/${caseId}`;
//         }
//         url += `/event-triggers/${eventName}/token`;
// console.log('>>>> ', url);
//         const apiRequestContext: APIRequestContext = await request.newContext();
//         let response;
//         try {
//             response = await apiRequestContext.get(url, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Accept: "*/*",
//                     Authorization: `Bearer ${accessToken}`,
//                     ServiceAuthorization: s2sToken
//                 },
//                 data: null
//             });
//         } catch (error) {
//                 throw new Error(
//                     `An error occurred while trying to validate the page data: ${
//                         error instanceof Error ? error.message : error
//                     }`
//                 );
//             };
//
//             console.log(response);
//
//     }



    async saveDataToDataStore(event:string, caseId, caseData:unknown, uid, accessToken, s2sToken ) {
        let url: string;
        if (event === 'startAppeal') {
            url = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/cases`;
        } else {
            url = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/cases/${caseId}/events`;
        }


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
                    const errorText = await response.text();
                    throw new Error(
                        `Failed to create appeal: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                    );
                }
            }
            return await response.json();
        } catch (error) {
            throw new Error(
                `An error occurred while trying to validate the page data: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };
    };

}