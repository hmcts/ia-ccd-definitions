import { test } from '@playwright/test';
import { envUrl, legalOfficerAdminCredentials } from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';
import { LinkHelper } from '../helpers/LinkHelper';
import { PageHelper } from '../helpers/PageHelper';
import { ButtonHelper } from '../helpers/ButtonHelper';
import { ValidationHelper } from '../helpers/ValidationHelper';
import { CreateAppeal } from '../flows/createAppeal';
import { CreateCasePage } from '../page-objects/pages/createCase_page';
import { SubmitYourAppeal } from '../flows/events/submitYourAppeal';
import { RemoveDetainedStatus } from '../flows/events/removeDetainedStatus';
import { imageLocators } from '../fixtures/imageLocators';
import { CaseIdHelper } from "../helpers/CaseIdHelper";

const inTime: boolean = true;
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let caseIdHelper: CaseIdHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;
let submitYourAppeal: SubmitYourAppeal;

test.describe('Legal Admin creates Detained Appeal then removes detained status', { tag: '@LegalAdminDetainedRepresentedToNonDetainedICC' }, () => {

    test.beforeAll(async () => {
        caseIdHelper = new CaseIdHelper();
    });

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
        validationHelper = new ValidationHelper(page);
        createAppeal = new CreateAppeal(page);
        createCasePage = new CreateCasePage(page);
        submitYourAppeal = new SubmitYourAppeal(page);

        await page.goto(envUrl);
    });

    test('Create Represented Detained Appeal in Prison with Custodial sentence - ' + (inTime ? 'In Time' : 'Out of Time') + ' - Then remove detained status',   async ({ page }) => {
        const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)
        const detentionLocation: string = 'prison';

        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('No', 'Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);
        await createAppeal.setCustodialSentence('Yes');
        await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
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

        await caseIdHelper.setCaseId(await pageHelper.grabCaseNumber());
        console.log('caseId>>>>>>>>>>>>>>>' + await caseIdHelper.getCaseId() + '<<<<<<<<<<<<<<<<<<<');
        await submitYourAppeal.submit(false, inTime);

        await validationHelper.validateLabelDisplayed(imageLocators.detained.representedManual.locator, imageLocators.detained.representedManual.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new RemoveDetainedStatus(page).removeStatus();

        await validationHelper.validateLabelNotDisplayed(imageLocators.detained.representedManual.locator);
        await validationHelper.validateLabelDisplayed(imageLocators.nonDetained.representedManual.locator, imageLocators.nonDetained.representedManual.name);
        await validationHelper.validateDataOnAppealTabDetainedStatusRemoved();
        await validationHelper.validateDataOnAppellantTabDetainedStatusRemoved(detentionLocation);

        await linkHelper.signOut.click();

});


    test('Create Represented Detained Appeal in Immigration Removal Centre - ' + (inTime ? 'In Time' : 'Out of Time') + ' - Then remove detained status',   async ({ page }) => {
        const typeOfAppeal: string = 'revocationOfProtection';// Revocation of a protection status (no payment required)
        const detentionLocation: string = 'immigrationRemovalCentre';


        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('No', 'Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);
        await createAppeal.setBailApplication('Yes');
        await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
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

        await caseIdHelper.setCaseId(await pageHelper.grabCaseNumber());
        console.log('caseId>>>>>>>>>>>>>>>' + await caseIdHelper.getCaseId() + '<<<<<<<<<<<<<<<<<<<');
        await submitYourAppeal.submit(false, inTime);

        await validationHelper.validateLabelDisplayed(imageLocators.detained.representedManual.locator, imageLocators.detained.representedManual.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new RemoveDetainedStatus(page).removeStatus();

        await validationHelper.validateLabelNotDisplayed(imageLocators.detained.representedManual.locator);
        await validationHelper.validateLabelDisplayed(imageLocators.nonDetained.representedManual.locator, imageLocators.nonDetained.representedManual.name);
        await validationHelper.validateDataOnAppealTabDetainedStatusRemoved();
        await validationHelper.validateDataOnAppellantTabDetainedStatusRemoved(detentionLocation);

        await linkHelper.signOut.click();
    });

});
