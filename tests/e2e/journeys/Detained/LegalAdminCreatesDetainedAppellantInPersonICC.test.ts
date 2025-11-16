import {expect, test} from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials,
    listingOfficerCredentials
} from '../../detainedConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { CreateAppeal } from '../../flows/createAppeal';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { SubmitYourAppeal } from '../../flows/events/submitYourAppeal';
import { RequestHomeOfficeData } from '../../flows/events/requestHomeOfficeData';
import { RespondentEvidenceDirection } from '../../flows/events/respondentEvidenceDirection';
import { HomeOfficeBundle } from '../../flows/events/homeOfficeBundle';
import { CaseBuildingDirection } from '../../flows/events/caseBuildingDirection';
import { BuildYourCase } from '../../flows/events/buildYourCase';
import { RespondentReviewDirection } from '../../flows/events/respondentReviewDirection';
import { UploadAppealResponse } from '../../flows/events/uploadAppealResponse';
import { ForceCaseHearingReqs } from '../../flows/events/forceCaseHearingReqs';
import { SubmitHearingRequirements } from '../../flows/events/submitHearingRequirements';
import { ReviewHearingRequirements } from '../../flows/events/reviewHearingRequirements';
import { ValidationHelper } from '../../helpers/ValidationHelper';
import { imageLocators } from '../../fixtures/imageLocators';
import {CreateCaseSummary} from "../../flows/events/createCaseSummary";
import {GenerateHearingBundle} from "../../flows/events/generateHearingBundle";
import {StartDecisionAndReasons} from "../../flows/events/startDecisionAndReasons";
import {PrepareDecisionAndReasons} from "../../flows/events/prepareDecisionAndReasons";
import {CompleteDecisionAndReasons} from "../../flows/events/completeDecisionAndReasons";
import {MarkAppealAsPaid} from "../../flows/events/markAppealAsPaid";
import {ListTheCase} from "../../flows/events/listTheCase";
import {S94b} from "../../flows/events/setS94bStatus";
import {RecordRemissionDecision} from "../../flows/events/recordRemissionDecision";

const inTime: boolean = true;
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';

//refusalOfEu - Refusal under EEA regulations (EA) (payment required)
//refusalOfHumanRights - Refusal human rights (HU) (payment required)
//deprivation -  Deprivation of citizenship (DC) (no payment required)
//euSettlementScheme - Refusal of application under the EU Settlement Scheme (EU) (payment required)
//revocationOfProtection - Revocation of a protection status (RP) (no payment required)
//protection - Refusal of protection claim (PA) (payment required)
const typeOfAppeal: string = ['refusalOfEu', 'refusalOfHumanRights', 'deprivation', 'euSettlementScheme', 'revocationOfProtection', 'protection'].includes(process.env.APPEAL_TYPE) ? process.env.APPEAL_TYPE : 'deprivation';

let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let caseId: string;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Appellant in Person Appeal (ICC)', { tag: '@LegalAdminCreatesDetainedAppellantInPersonICC' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
        validationHelper = new ValidationHelper(page);

        await page.goto(envUrl);
    });

    test('Create Detained Appeal - Appellant In Person as Legal Admin - ' + (inTime ? 'In Time' : 'Out of Time'),   async ({ page}) => {
        const createAppeal = new CreateAppeal(page);

        await idamPage.login(legalOfficerAdminCredentials);
        await new CreateCasePage(page).createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);

        if (detentionLocation === 'prison' || detentionLocation === 'other') {
            await createAppeal.setCustodialSentence('Yes');
        }
        else {
            await createAppeal.setBailApplication('No');
        }

        await createAppeal.setHomeOfficeDetails(inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setAppellantBasicDetails(true);
        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellantAddress('detained', 'Yes');
        }

        await createAppeal.appellantDetails();
        await createAppeal.hasSponsor('No');
        await createAppeal.hasDeportationOrder('No');
        await createAppeal.hasRemovalDirections('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.isHearingRequired(true);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            await createAppeal.hasFeeRemission(feeRemission);
        }

        if (typeOfAppeal === 'protection') {
            await createAppeal.setPayNowLater('Now');
        }

        await createAppeal.uploadAppealDocs();
        await createAppeal.checkMyAnswers();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        await new SubmitYourAppeal(page).submit(false, inTime);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            if (feeRemission === 'Yes') {
                await new RecordRemissionDecision(page).submit('approved');
            } else {
                await new MarkAppealAsPaid(page).recordPayment();
            }
        }

        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManual.locator, imageLocators.detained.appellantInPersonManual.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new S94b(page).setStatus('Yes');
        await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManualS94b.locator, imageLocators.detained.appellantInPersonManualS94b.name);

        if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
            await new RequestHomeOfficeData(page).matchAppellantDetails();
        }

        await new RespondentEvidenceDirection(page).submit();

        await linkHelper.signOut.click();
    });

    test('Home Office Officer (respondent) review appeal and upload Home Office bundle',   async ({ page }) => {
        await idamPage.login(homeOfficeOfficerCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new HomeOfficeBundle(page).upload();
        await linkHelper.signOut.click();
    });

    test('Legal Officer directs Appellant (Legal Officer Admin) to build case',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new CaseBuildingDirection(page).submit();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Admin build case (acting as AIP)',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);
        await new BuildYourCase(page).build();
        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Review Direction',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new RespondentReviewDirection(page).submit();
        await linkHelper.signOut.click();
    });

    test('Home Office Officer (respondent) responds to appeal response from Appellant',   async ({ page }) => {
        await idamPage.login(homeOfficeOfficerCredentials);
        await page.goto(envUrl + '/cases/case-details/' + await caseId);
        await new UploadAppealResponse(page).upload();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Force case - hearing reqs, thus bypassing Appellant needing to review the HO decision',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ForceCaseHearingReqs(page).submit();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Admin submit hearing requirements (acting as AIP)',   async ({ page }) => {
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
        await new CompleteDecisionAndReasons(page).upload('allowed'); // or dismissed
        await linkHelper.signOut.click();
   });
});

