import { APIRequestContext, request }  from "@playwright/test";
import {
    idamApiBaseUrl,
    authProviderApiBaseUrl,
    microService,
    secret,
    ccdDataStoreApiBaseUrl, createCase
} from '../iacConfig';
import {TOTP} from 'totp-generator';
import fs from "node:fs";
import { jwtDecode } from "jwt-decode";

export class TokensHelper {

    constructor() {
    }

    private async getTokenFromIdam(username: string, password: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        try {
            const response = await apiRequestContext.post(`${idamApiBaseUrl}/loginUser?username=${encodeURIComponent(username)}&password=${password}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
            });

            if (!response.ok()) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to fetch access token: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                );
            }
            return (await response.json()).access_token;
        } catch (error) {
            throw new Error(
                `An error occurred while fetching the access token: ${
                    error instanceof Error ? error.message : error }`
            );
        };
    }

    async getAccessToken(authFile: fs.PathOrFileDescriptor, username: string, password: string) {

        // Use the storage state accessToken if one exists and it has not expired
        try {
            const sessionStorage = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
            const authCookie = sessionStorage.cookies.find(cookie => cookie.name == '__auth__');
            let accessToken = authCookie.value;
            // Check token has not expired
            if ((jwtDecode(accessToken).exp * 1000) - Date.now() >= 0) {
                console.log('Getting Access Token from Cache....');
            } else {
                console.log('Getting Access Token from Idam....');
                accessToken =  await this.getTokenFromIdam(username, password);
            }
            return accessToken;
        } catch {
            console.log('Getting Access Token from Idam....');
            return await this.getTokenFromIdam(username, password);
        };
    }

    async getUserId(accessToken) {
        const url: string = `${idamApiBaseUrl}/o/userinfo`;
        const apiRequestContext: APIRequestContext = await request.newContext();
        try {
            const response = await apiRequestContext.post(url, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );

            if (!response.ok()) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to fetch uid: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                );
            }
            return (await response.json()).uid;
        } catch (error) {
            throw new Error(
                `An error occurred while fetching the uid: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };
    }




    async getS2SToken() {
        const url: string = `${authProviderApiBaseUrl}/testing-support/lease`;
        const apiRequestContext: APIRequestContext = await request.newContext();
        try {
            const response = await apiRequestContext.post(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    },
                data:{
                        microservice: microService,
                        oneTimePassword: TOTP.generate(secret)
                    }
                }
            );

            if (!response.ok()) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to fetch S2S token: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                );
            }
            return (await response.text());
        } catch (error) {
            throw new Error(
                `An error occurred while fetching the S2S token: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };
    }


    async getEventToken(event:string, caseId: string, uid: string, accessToken: string, s2sToken: string) {
        let url: string;
        if (caseId) {
            url = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/cases/${caseId}/event-triggers/${event}/token`;
        } else {
            url = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/event-triggers/${event}/token`;
        }

        const apiRequestContext: APIRequestContext = await request.newContext();

        try {
            const response = await apiRequestContext.get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        Authorization: `Bearer ${accessToken}`,
                        ServiceAuthorization: `${s2sToken}`
                    },
                }
            );

            if (!response.ok()) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to fetch Event token: ${response.status()} - ${errorText}. Ensure your VPN is connected or check your URL/SECRET.`
                );
            }
            console.log('Getting token for event: ' + event);
            return (await response.json()).token;
        } catch (error) {
            throw new Error(
                `An error occurred while fetching the Event token: ${
                    error instanceof Error ? error.message : error
                }`
            );
        };
    }
}