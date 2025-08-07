import { test } from '@playwright/test';
import {
    envUrl,
    legalRepresentativeCredentials,
    legalOfficerCredentials
} from '../detainedConfig';
import {IdamPage} from "../page-objects/pages/idam.po";
import {LinkHelper} from "../helpers/LinkHelper";
import {PageHelper} from "../helpers/PageHelper";
import {ValidationHelper} from "../helpers/ValidationHelper";
import {UpdateDetentionLocation} from "../flows/events/updateDetentionLocationPlaywright";
import {CreateAppeal} from "../flows/createAppealPlaywright";
import {CreateCasePage} from "../page-objects/pages/createCase_page";
import {SubmitYourAppeal} from "../flows/events/submitYourAppealPlaywright";
import { MarkAppealAsDetained } from '../flows/events/markAppealAsDetainedPlaywright';
import { imageLocators } from "../fixtures/imageLocators";

let caseId: string;
const inTime: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let validationHelper: ValidationHelper;

test.describe('Detained Appeal - Represented ', { tag: '@NonDetainedToDetainedRepresentedPlaywright' }, () =>
{
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        validationHelper = new ValidationHelper(page);
        await page.goto(envUrl);
    });

    test('Create Non-Detained Appeal as Legal Representative', async ({ page }) => {
        const typeOfAppeal: string = 'deprivation'; // Deprivation of citizenship (no payment required)
        const createAppeal = new CreateAppeal(page);
        await idamPage.login(legalRepresentativeCredentials);
        await new CreateCasePage(page).createCase();
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('No');
        await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setGroundsOfAppeal(typeOfAppeal);
        await createAppeal.setAppellantBasicDetails(false);
        await createAppeal.setNationality(true);
        await createAppeal.setAppellantAddress('nonDetained', 'Yes');
        await createAppeal.setAppellantContactPreference('Email');
        await createAppeal.hasSponsor('No');
        await createAppeal.hasDeportationOrder("No");
        await createAppeal.hasNewMatters('Yes');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.setLegalRepresentativeDetails();
        await createAppeal.isHearingRequired(true);
        await createAppeal.checkMyAnswers();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        await new SubmitYourAppeal(page).submit(true, inTime);
        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new MarkAppealAsDetained(page).setAsDetained(detentionLocation);
        await validationHelper.validateLabelDisplayed(imageLocators.detainedRepresented.locator, imageLocators.detainedRepresented.name);
        await new UpdateDetentionLocation(page).validateDataUpdated(detentionLocation, true);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await linkHelper.signOut.click();
    });
});
