import {expect, test} from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials, judgeCredentials, legalOfficerCredentials,
    legalOfficerAdminCredentials, listingOfficerCredentials,
} from '../../iacConfig';
import { IdamPage} from '../../page-objects/pages/idam.po';
import {LinkHelper} from '../../helpers/LinkHelper';
import {PageHelper} from '../../helpers/PageHelper';
import {ButtonHelper} from '../../helpers/ButtonHelper';
import {ValidationHelper} from '../../helpers/ValidationHelper'
import {CreateAppeal} from '../../flows/createAppeal';
import {CreateCasePage} from '../../page-objects/pages/createCase_page';
import {SubmitYourAppeal} from '../../flows/events/submitYourAppeal';
import {RequestHomeOfficeData} from '../../flows/events/requestHomeOfficeData';
import {RespondentEvidenceDirection} from '../../flows/events/respondentEvidenceDirection';
import {HomeOfficeBundle} from '../../flows/events/homeOfficeBundle';
import {CaseBuildingDirection} from '../../flows/events/caseBuildingDirection';
import {BuildYourCase} from '../../flows/events/buildYourCase';
import {RespondentReviewDirection} from '../../flows/events/respondentReviewDirection';
import {UploadAppealResponse} from '../../flows/events/uploadAppealResponse';
import {ForceCaseHearingReqs} from '../../flows/events/forceCaseHearingReqs';
import {SubmitHearingRequirements} from '../../flows/events/submitHearingRequirements';
import {ReviewHearingRequirements} from '../../flows/events/reviewHearingRequirements';
import {imageLocators} from '../../fixtures/imageLocators';
import {CreateCaseSummary} from "../../flows/events/createCaseSummary";
import {GenerateHearingBundle} from "../../flows/events/generateHearingBundle";
import {StartDecisionAndReasons} from "../../flows/events/startDecisionAndReasons";
import {PrepareDecisionAndReasons} from "../../flows/events/prepareDecisionAndReasons";
import {CompleteDecisionAndReasons} from "../../flows/events/completeDecisionAndReasons";
import {ListTheCase} from "../../flows/events/listTheCase";

const inTime: boolean = true;
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;
let submitYourAppeal: SubmitYourAppeal;
const daysToComply: number = 14;
let caseId: string = '';


const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)
test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Represented Non-Detained Appeal (ICC)', { tag: '@LegalAdminCreatesNonDetainedRepresentedICC' }, () => {


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

    test('Create Represented Non-Detained Appeal',   async () => {
        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('No', 'Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('No');
        await createAppeal.setHomeOfficeReferenceNumber();
        await createAppeal.setAppellantBasicDetails(true);
        await createAppeal.setNationality(true);
        await createAppeal.setAppellantAddress('nonDetained', 'Yes');
        await createAppeal.setAppellantContactDetails();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setHomeOfficeDecisionDate(inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.hasSponsor('No');
        await createAppeal.hasDeportationOrder('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.isHearingRequired(true);
        await createAppeal.uploadAppealDocs();
        await createAppeal.checkMyAnswers();
        await buttonHelper.closeAndReturnToCaseDetailsButton.click();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
        await submitYourAppeal.submit(false, inTime);

        await linkHelper.signOut.click();
});

    test('Legal Officer creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        await validationHelper.validateLabelDisplayed(imageLocators.nonDetained.representedManual.locator, imageLocators.nonDetained.representedManual.name);

        if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
            await new RequestHomeOfficeData(page).matchAppellantDetails();
        }

        await new RespondentEvidenceDirection(page).submit(daysToComply);

        await linkHelper.signOut.click();
    });

    test('Home Office Officer (respondent) review appeal and upload Home Office bundle',   async ({ page }) => {
        await idamPage.login(homeOfficeOfficerCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new HomeOfficeBundle(page).upload();
        await linkHelper.signOut.click();
    });

    test('Legal Officer directs appellant/Legal Rep to build case',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new CaseBuildingDirection(page).submit();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Admin build case (acting as Legal Rep)',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);
        await new BuildYourCase(page).build();
        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Review Direction',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new RespondentReviewDirection(page).submit(daysToComply);
        await linkHelper.signOut.click();
    });

    test('Home Office Officer (respondent) responds to appeal response from Appellant/Legal Rep',   async ({ page }) => {
        await idamPage.login(homeOfficeOfficerCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new UploadAppealResponse(page).upload();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Force case - hearing reqs, thus bypassing Appellant/Legal Rep needing to review the HO decision',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ForceCaseHearingReqs(page).submit();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Admin submit hearing requirements (acting as Legal Rep)',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);
        await new SubmitHearingRequirements(page).submit()
        await linkHelper.signOut.click();
    });

    test('Legal Officer to review hearing requirements',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ReviewHearingRequirements(page).submit();
        await linkHelper.signOut.click();
    });

    // This is not the route the caseworker would use, however, we use it in the tests to get to the state of: Prepare for hearing
    // This state is only available when the hearing is listed - this event mimics the List Assist integration for us and thus allows us to complete the journey
    test('Admin Legal Officer to list the case',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);
        await new ListTheCase(page).list('No');
        await linkHelper.signOut.click();
    });

    test('Listing Officer to create the case summary, generate hearing bundle and start decision and reasons',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new CreateCaseSummary(page).create();
        await new GenerateHearingBundle(page).submit();

        // The bundle can take a while to generate so we need to refresh the page until the Do Next text is updated to relate to Decision and reasons
        await pageHelper.waitForHearingBundleToBeGenerated();
        await expect(page.locator(' #progress_caseOfficer_preHearing')).toBeVisible();
        await new StartDecisionAndReasons(page).submit('Yes', 'Yes');
        await linkHelper.signOut.click();
    });

    test('Judge to Prepare and Complete decision and reasons',   async ({ page }) => {
        await idamPage.login(judgeCredentials);
        await pageHelper.getCase(caseId);
        await new PrepareDecisionAndReasons(page).generate('Yes');
        await new CompleteDecisionAndReasons(page).upload('allowed');
        await linkHelper.signOut.click();
    });

});
