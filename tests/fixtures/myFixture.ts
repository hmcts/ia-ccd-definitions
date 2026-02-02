import { test as base } from '@playwright/test';
import {IdamPage} from "../e2e/page-objects/pages/idam.po";
import {envUrl, homeOfficeOfficerCredentials} from "../e2e/iacConfig";
import {CaseIdHelper} from "../e2e/helpers/CaseIdHelper";
import {HomeOfficeBundle} from "../e2e/flows/events/homeOfficeBundle";
import {LinkHelper} from "../e2e/helpers/LinkHelper";

type myFixtures = {
    testUser
    uploadHomeOfficeBundlePage
  }


export const test = base.extend<myFixtures>({
    /*eslint no-empty-pattern: ["error", { "allowObjectPatternsAsParameters": true }]*/
    testUser: async ({}, use) => {
        const user = {
            email: '123@gmail.com',
            password: 'securepassword123'
        };
        await use(user);
    },

    uploadHomeOfficeBundlePage: async({page}, use) => {
        console.log('login as home office officer');
        await new IdamPage(page).login(homeOfficeOfficerCredentials);
        console.log('moving to url>>> ', envUrl + '/cases/case-details/' + await CaseIdHelper.getCaseId());
        await page.goto(envUrl + '/cases/case-details/' + await CaseIdHelper.getCaseId());
        const homeOfficeBundle = new HomeOfficeBundle(page);
        console.log('uploadHomeOfficeBundlePage BEFORE>>>> ',await CaseIdHelper.getCaseId())
        await use(homeOfficeBundle);
        console.log('uploadHomeOfficeBundlePage AFTER>>>> ');
         await new LinkHelper(page).signOut.click();
    },
});