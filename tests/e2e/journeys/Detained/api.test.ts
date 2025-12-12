import {expect, test} from '@playwright/test';
import {TokensHelper} from '../../helpers/TokensHelper';
import {CcdApiHelper} from "../../helpers/CcdApiHelper";

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
        const response = await ccdApiHelper.validatePageData('startAppealappealReferenceNumber',uid, accessToken, s2sToken, eventToken);
        console.log('response>>>> ', response);
    });
});
