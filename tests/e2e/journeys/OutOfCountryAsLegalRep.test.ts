import { test } from '@playwright/test';
import { envUrl, legalRepresentativeCredentials } from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';
import { CreateCasePage } from '../page-objects/pages/createCase_page';
import { CreateAppeal } from '../flows/createAppeal';
import { LinkHelper } from'../helpers/LinkHelper';
import { PageHelper } from '../helpers/PageHelper';
import { SubmitYourAppeal } from '../flows/events/submitYourAppeal';

const inTime = true;
const typeOfAppeal = 'revocationOfProtection'; // Revocation of a protection status (no payment required)

let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let caseId: string;

test.describe.configure({ mode: 'serial'});
test.describe('Create Out of Country Appeal as Legal Representative', { tag: '@OutOfCountryAsLegalRep' }, () => {

    test.beforeEach(async ({ page }) => {
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);

        await page.goto(envUrl);
    });

    test('Create Out of Country Appeal', async ({ page }) => {
        const createAppeal = new CreateAppeal(page);
        await idamPage.login(legalRepresentativeCredentials);
        await new CreateCasePage(page).createCase();
        await createAppeal.locationInUK('No');
        await createAppeal.outOfCountryDecision('refusePermit', inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setGroundsOfAppeal(typeOfAppeal);
        await createAppeal.setAppellantBasicDetails(false);
        await createAppeal.setNationality(true);
        await createAppeal.setAppellentContactPreference('EMAIL');
        await createAppeal.setOutOfCountryAddress('Yes');
        await createAppeal.hasSponsor('Yes');
        await createAppeal.hasDeportationOrder('Yes');
        await createAppeal.hasNewMatters('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.setLegalRepresentativeDetails();
        await createAppeal.isHearingRequired(true);
        await createAppeal.checkMyAnswers();

        const submitYourAppeal = new SubmitYourAppeal(page);
        await submitYourAppeal.submit(inTime);

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        await linkHelper.signOut.click();
    });
});
