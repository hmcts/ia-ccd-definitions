import { APIRequestContext, request }  from "@playwright/test";
import {
    idamApiBaseUrl,
    authProviderApiBaseUrl,
    microService,
    secret,
    ccdDataStoreApiBaseUrl, createCase
} from '../iacConfig';
import {TOTP} from 'totp-generator';

export class TokensHelper {

    constructor() {
    }

    async getAccessToken(username: string, password: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();

        try {
            const response = await apiRequestContext.post(`${idamApiBaseUrl}/loginUser?username=${encodeURIComponent(username)}&password=${password}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json",
                    },
                }
            );

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
                    error instanceof Error ? error.message : error
                }`
            );
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


    async getEventToken(event:string, uid: string, accessToken, s2sToken) {

        const url: string = `${ccdDataStoreApiBaseUrl}/caseworkers/${uid}/jurisdictions/${createCase.jurisdictionCode}/case-types/${createCase.caseTypeCode}/event-triggers/${event}/token`;
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