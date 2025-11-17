import {expect, test} from '@playwright/test';
import {
    envUrl,
    legalRepresentativeCredentials,
    legalOfficerCredentials,
    homeOfficeOfficerCredentials,
    legalOfficerAdminCredentials,
    listingOfficerCredentials, judgeCredentials
} from '../../detainedConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { CreateAppeal } from '../../flows/createAppeal';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { ValidationHelper } from '../../helpers/ValidationHelper';
import { SubmitYourAppeal } from '../../flows/events/submitYourAppeal';
import { CreateServiceRequest } from '../../flows/events/createServiceRequest';
import { PaymentPage } from '../../page-objects/pages/payment_page';
import { S94b } from '../../flows/events/setS94bStatus';
import { UpdateDetentionLocation } from '../../flows/events/updateDetentionLocation';
import { RequestHomeOfficeData } from '../../flows/events/requestHomeOfficeData';
import { RespondentEvidenceDirection } from '../../flows/events/respondentEvidenceDirection';
import { HomeOfficeBundle } from '../../flows/events/homeOfficeBundle';
import { CaseBuildingDirection } from '../../flows/events/caseBuildingDirection';
import { BuildYourCase } from '../../flows/events/buildYourCase';
import { RespondentReviewDirection } from '../../flows/events/respondentReviewDirection';
import { UploadAppealResponse } from '../../flows/events/uploadAppealResponse';
import { ForceCaseHearingReqs} from '../../flows/events/forceCaseHearingReqs';
import { SubmitHearingRequirements } from '../../flows/events/submitHearingRequirements';
import { ReviewHearingRequirements } from '../../flows/events/reviewHearingRequirements';
import { ListTheCase } from "../../flows/events/listTheCase";
import { CreateCaseSummary } from "../../flows/events/createCaseSummary";
import { GenerateHearingBundle } from '../../flows/events/generateHearingBundle';
import { StartDecisionAndReasons } from "../../flows/events/startDecisionAndReasons";
import { PrepareDecisionAndReasons } from "../../flows/events/prepareDecisionAndReasons";
import { CompleteDecisionAndReasons } from "../../flows/events/completeDecisionAndReasons";
import { imageLocators } from '../../fixtures/imageLocators';
import {CreateHearingRequest} from "../../flows/createHearingRequest";
import {TabsHelper} from "../../helpers/TabsHelper";
import {GenerateListCMR} from "../../flows/events/generateListCMRTask";
import {RecordOutOfTimeDecision} from "../../flows/events/recordOutOfTimeDecision";
import {RecordRemissionDecision} from "../../flows/events/recordRemissionDecision";

//await this.page.waitForTimeout(10000); // waits for 2 seconds

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
let detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
let caseId: string = '';


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
let validationHelper: ValidationHelper;
let updateDetentionLocation: UpdateDetentionLocation;
let createHearingRequest: CreateHearingRequest;

test.describe.configure({ mode: 'serial' });
test.describe('Create Detained ' + typeOfAppeal + ' Appeal as Legal Representative with detention location: ' + detentionLocation + ', ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + (cmrHearing ? 'with' : 'without') + ' CMR listing', { tag: '@LegalRepCreatesDetainedAppeal' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        validationHelper = new ValidationHelper(page);
        updateDetentionLocation = new UpdateDetentionLocation(page);
        createHearingRequest = new CreateHearingRequest(page);
        await page.goto(envUrl);
    });

    test('Create LR Detained Appeal', async ({ page }) => {
        const createAppeal = new CreateAppeal(page);
        await idamPage.login(legalRepresentativeCredentials);
        await new CreateCasePage(page).createCase();
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);

        if (detentionLocation === 'prison' || detentionLocation === 'other') {
            await createAppeal.setCustodialSentence('Yes');
        }

        if (detentionLocation === 'immigrationRemovalCentre') {
            await createAppeal.setBailApplication('Yes');
        }

        await createAppeal.setHomeOfficeDetailsHO();
        await createAppeal.setAppellantBasicDetails(false);
        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellantAddress('detained', 'Yes');
        }

        await createAppeal.setTypeOfAppeal(typeOfAppeal);

        if (typeOfAppeal !== 'euSettlementScheme') {
            await createAppeal.setGroundsOfAppeal(typeOfAppeal);
        }

        await createAppeal.setDecisionDateHO(inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.hasSponsor('Yes');
        await createAppeal.hasDeportationOrder('Yes');
        await createAppeal.hasRemovalDirections('Yes');
        await createAppeal.hasNewMatters('Yes');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.setLegalRepresentativeDetails();
        await createAppeal.isHearingRequired(true);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            await createAppeal.hasFeeRemission(feeRemission);
        }

        if (typeOfAppeal === 'protection' && feeRemission === 'No') {
            await createAppeal.setPayNowLater('Now');
        }

        await createAppeal.checkMyAnswers(true);

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
        await new SubmitYourAppeal(page).submit(true, inTime);

        if ((typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') && feeRemission === 'No') {
            // create service request
            await new CreateServiceRequest(page).submit();

            // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
            await new PaymentPage(page).makePayment('CC', caseId);
        }

        await linkHelper.signOut.click();
    });

    // This is an additional step/test ONLY run if fee remission has been undertaken, as we need to make a decision on the fee remission
    if (feeRemission === 'Yes') {
        test('Legal Officer Admin decides Fee Remission', async ({ page }) => {
            await idamPage.login(legalOfficerAdminCredentials);
            await pageHelper.getCase(caseId);
            if (feeRemission === 'Yes') {
                await new RecordRemissionDecision(page).submit('approved');
            }
        });
    }

    test('Legal Officer' + (!inTime ? ' records Out of Time decision, ': ' ') + 'adds s94b appeal status, updates detention location and creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        if (!inTime) {
            await new RecordOutOfTimeDecision(page).submit('approved');
        }

        await validationHelper.validateLabelDisplayed(imageLocators.detained.represented.locator, imageLocators.detained.represented.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new S94b(page).setStatus('Yes');
        await validationHelper.validateLabelDisplayed(imageLocators.detained.representedS94b.locator, imageLocators.detained.representedS94b.name);

        detentionLocation = detentionLocation === 'prison' ? 'other' : (detentionLocation === 'other' ? 'immigrationRemovalCentre' : 'prison');
        await updateDetentionLocation.changeLocation(detentionLocation, detentionLocation === 'prison' ? false:  (detentionLocation === 'other' ? true : false));
        await updateDetentionLocation.validateDataUpdated(detentionLocation);

         if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
             await new RequestHomeOfficeData(page).matchAppellantDetails();
         }

         if (cmrHearing) {
             await new GenerateListCMR(page).createTask();
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

    test('Legal Officer directs appellant/Legal Rep to build case',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new CaseBuildingDirection(page).submit();
        await linkHelper.signOut.click();
    });

    test('Appellant/Legal Rep build case',   async ({ page }) => {
        await idamPage.login(legalRepresentativeCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new BuildYourCase(page).build();
        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Review Direction',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new RespondentReviewDirection(page).submit();
        await linkHelper.signOut.click();
    });

    test('Home Office Officer (respondent) responds to appeal response from Appellant/Legal Rep',   async ({ page }) => {
        await idamPage.login(homeOfficeOfficerCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new UploadAppealResponse(page).upload();
        await linkHelper.signOut.click();
    });

    test('Legal Officer Force case - hearing reqs, thus bypassing Appellant/Legal Rep needing to review the HO decision',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ForceCaseHearingReqs(page).submit();
        await linkHelper.signOut.click();
    });

    test('Appellant/legal rep submit hearing requirements',   async ({ page }) => {
        await idamPage.login(legalRepresentativeCredentials);
        await page.goto(envUrl + '/cases/case-details/' + await caseId);
        await new SubmitHearingRequirements(page).submit()
        await linkHelper.signOut.click();
    });

    test('Legal Officer to review hearing requirements',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ReviewHearingRequirements(page).submit();
        await linkHelper.signOut.click();
    });

    test('Listing officer creates Hearing Request',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new TabsHelper(page).selectTab('Hearings');
        // We need to wait for the text of the page to load otherwise clicking Request a hearing button too early causes error on page
        await page.waitForSelector('text=Current and upcoming', {state: 'visible'});
        await page.getByRole('button', { name: 'Request a hearing' }).click();

        await createHearingRequest.checkHearingRequirements();
        await createHearingRequest.setAdditionalFacilities();

        if (cmrHearing) {
            await createHearingRequest.setHearingStage('CMR');
        } else {
            await createHearingRequest.setHearingStage('SUB');
        }

        await createHearingRequest.setParticipantAttendance();
        await createHearingRequest.setVenueLocation('Glasgow');
        await createHearingRequest.setSpecificJudge('No');
        await createHearingRequest.setPanelRequired('No');
        await createHearingRequest.setLengthDatePriority();
        await createHearingRequest.setLinkedCase('No');
        await createHearingRequest.setAdditionalInstructions();
        await page.getByRole('button', { name: 'Submit request' }).click();
        await page.locator('text=view the status of this hearing in the hearings tab').click();
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

        // The bundle can take a while to generate so we need to refresh the page until the Do Next text is updated to relate to Decisions and reasons
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