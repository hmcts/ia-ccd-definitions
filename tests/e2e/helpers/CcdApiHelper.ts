import {APIRequestContext, request} from "@playwright/test";
import {ccdDataStoreApiBaseUrl, createCase, documentManagementStoreApiBaseUrl} from "../iacConfig";
import fs from "fs";
import path from "path";
import {APIResponse} from "playwright";
import {stringify} from "node:querystring";
import {AriaReferenceNumberHelper} from "./AriaReferenceNumberHelper";

export class CcdApiHelper {
    constructor() {

    }


    async validatePageData(pageId:string, event: string, eventData:unknown, uid, eventToken, accessToken, s2sToken ) {
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
                data: {
                    data: eventData,
                    event: {
                        id: event,
                        summary: "",
                        description: ""
                    },
                    event_token: eventToken,
                    ignore_warning: false
                }
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


    async validatePageData2(pageId:string, caseData:unknown, uid, accessToken, s2sToken ) {
        const url: string = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/validate?pageId=${pageId}`;
        const apiRequestContext: APIRequestContext = await request.newContext();
let test = {
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
        ServiceAuthorization: s2sToken
    },
    data: caseData
};

console.log(test);
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


    async uploadDocument(accessToken, s2sToken, documentName: string = 'TEST_DOCUMENT_1.pdf') {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const file = path.resolve("./tests/documents", documentName);
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

    async getAriaReferenceNumber(event: string, uid, accessToken, eventToken, s2sToken) {
        const maxRetries: number = 10;
        const ariaReferenceNumberHelper = new AriaReferenceNumberHelper();
        let ariaRefNumber = ariaReferenceNumberHelper.getValidAriaReferenceNumber();

        for (let retry=0; retry < maxRetries; retry++)
        {
            let eventData = { appealReferenceNumber: ariaRefNumber };

            const response: APIResponse =  (await this.validatePageData(`${event}appealReferenceNumber`, event, eventData, uid, eventToken, accessToken, s2sToken));

            if (await response.status() === 200) {
                console.log(`Aria reference number: ${ariaRefNumber} is valid and not assigned to an existing appeal.`);
                break;
            }

            if (await response.status() === 422) {
                console.log(`Aria reference number: ${ariaRefNumber} cannot be used: ${(await response.json()).callbackErrors[0]} Generating a new Aria reference number for retry.`);
                ariaRefNumber = ariaReferenceNumberHelper.getValidAriaReferenceNumber();
                continue;
            } else {
                throw new Error(`An unknown error was returned when validating the Aria Reference number using the CCD API: ${response}`);
            }
        }

        return ariaRefNumber;

    }

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
                console.log(stringify(await response.json()));
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