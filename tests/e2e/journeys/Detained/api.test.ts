import {expect, test} from '@playwright/test';
import {TokensHelper} from '../../helpers/TokensHelper';
import {CcdApiHelper} from "../../helpers/CcdApiHelper";
import {ariaReferenceNumber} from "../../fixtures/ariaReferenceNumber";

test.describe('api testing', { tag: '@api' }, () => {
    test('api test', async ({page}) => {
        let tokensHelper: TokensHelper = new TokensHelper();
        let ccdApiHelper: CcdApiHelper = new CcdApiHelper();
        const accessToken = await tokensHelper.getAccessToken();
        console.log('accessToken>>>>', accessToken);
        const uid = await tokensHelper.getUserId(accessToken);
        console.log('uid>>>>', uid);
        const s2sToken = await tokensHelper.getS2SToken();
        console.log('s2sToken>>>>', s2sToken);
        const eventToken = await tokensHelper.getEventToken('startAppeal', uid,accessToken,s2sToken);
        console.log('eventToken>>> ',eventToken);
        const errorMessage: string = 'The reference number already exists. Please enter a different reference number.';
        let data:string = "data: { " +
            "   appealReferenceNumber: " + ariaReferenceNumber.valid +", }, " +
            " event: { " +
            " id: 'startAppeal', " +
               " summary: '', " +
               " description: '', }," +
        // event_data: {
        //     isAdmin: 'Yes',
        //     sourceOfAppeal: 'rehydratedAppeal',
        //     appealReferenceNumber: 'LH/20384/2025'
        // },
        " event_token: " + eventToken + "," +
        " ignore_warning: 'false' ";


       // const response = await ccdApiHelper.validatePageData('startAppealappealReferenceNumber',uid, accessToken, s2sToken, eventToken, data);
       // console.log('response>>>> ', response);
        const maxRetries: number = 10;
        let retry: number = 0;
        // for (let i=0; i < maxRetries; i++) {
        //     let response = ccdApiHelper.validatePageData('startAppealappealReferenceNumber', uid, accessToken, s2sToken, eventToken, data);
        //   //  if (response[0] != 'SUCCESS' || response[0] != errorMessage) {
        //
        //     }
        // }
        // while(await ccdApiHelper.validatePageData('startAppealappealReferenceNumber', uid, accessToken, s2sToken, eventToken, data)[0] != 'SUCCESS') {
        //     if () {
        //         console.log()
        //     }
        // }
    });
});
