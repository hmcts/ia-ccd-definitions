import { test } from '@playwright/test';
import { envUrl, legalOfficerAdminCredentials } from '../detainedConfig';
import {IdamPage} from "../page-objects/pages/idam.po";
import {LinkHelper} from "../helpers/LinkHelper";
import {PageHelper} from "../helpers/PageHelper";
import { ButtonHelper } from "../helpers/ButtonHelper";
import {CreateAppeal} from "../flows/createAppealPlaywright";
import {CreateCasePage} from "../page-objects/pages/createCase_page";
import { SubmitYourAppeal } from '../flows/events/submitYourAppealPlaywright';

let caseId: string;
const inTime: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;

test.describe('Legal Admin creates Detained Appeal', { tag: '@LegalOfficerAdminDetainedAppellantInPersonPlaywright' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
        await page.goto(envUrl);
    });

    test('Create Detained Appeal - Appellant In Person as Legal Admin - ' + (inTime ? 'In Time' : 'Out of Time'),   async ({ page}) => {
        const typeOfAppeal: string = 'deprivation'; //Deprivation of citizenship (no payment required) "deprivation"
        const createAppeal = new CreateAppeal(page);

        await idamPage.login(legalOfficerAdminCredentials);
        await new CreateCasePage(page).createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);
        await createAppeal.setBailApplication('No');
        await createAppeal.setHomeOfficeDetails(inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setAppellantBasicDetails(true);
        await createAppeal.setNationality(true);
        await createAppeal.appellantDetails();
        await createAppeal.hasSponsor('No');
        await createAppeal.hasDeportationOrder('No');
        await createAppeal.hasRemovalDirections('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.isHearingRequired(true);
        await createAppeal.uploadAppealDocs();
        await createAppeal.checkMyAnswers();
        await buttonHelper.closeAndReturnToCaseDetailsButton.click();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
        await new SubmitYourAppeal(page).submit(false, inTime);

        await linkHelper.signOut.click();
    });
});

