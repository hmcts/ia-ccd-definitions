import {expect, test} from '@playwright/test';
import {
    envUrl, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../iacConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
import {LinkHelper} from '../../helpers/LinkHelper';
import {PageHelper} from '../../helpers/PageHelper';
import {ButtonHelper} from '../../helpers/ButtonHelper';
import {ValidationHelper} from '../../helpers/ValidationHelper'
import {CreateAppeal} from '../../flows/createAppeal';
import {CreateCasePage} from '../../page-objects/pages/createCase_page';
import {SubmitYourAppeal} from "../../flows/events/submitYourAppeal";
import {RecordRemissionDecision} from "../../flows/events/recordRemissionDecision";
import {MarkAppealAsPaid} from "../../flows/events/markAppealAsPaid";
import {imageLocators} from "../../fixtures/imageLocators";
import {RecordOutOfTimeDecision} from "../../flows/events/recordOutOfTimeDecision";
import {S94b} from "../../flows/events/setS94bStatus";
import {RequestHomeOfficeData} from "../../flows/events/requestHomeOfficeData";
import {GenerateListCMR} from "../../flows/events/generateListCMRTask";
import {RespondentEvidenceDirection} from "../../flows/events/respondentEvidenceDirection";
import {HomeOfficeBundle} from "../../flows/events/homeOfficeBundle";
import {CaseBuildingDirection} from "../../flows/events/caseBuildingDirection";
import {BuildYourCase} from "../../flows/events/buildYourCase";
import {RespondentReviewDirection} from "../../flows/events/respondentReviewDirection";
import {UploadAppealResponse} from "../../flows/events/uploadAppealResponse";
import {ForceCaseHearingReqs} from "../../flows/events/forceCaseHearingReqs";
import {SubmitHearingRequirements} from "../../flows/events/submitHearingRequirements";
import {ReviewHearingRequirements} from "../../flows/events/reviewHearingRequirements";
import {ListTheCase} from "../../flows/events/listTheCase";
import {CreateCaseSummary} from "../../flows/events/createCaseSummary";
import {GenerateHearingBundle} from "../../flows/events/generateHearingBundle";
import {StartDecisionAndReasons} from "../../flows/events/startDecisionAndReasons";
import {PrepareDecisionAndReasons} from "../../flows/events/prepareDecisionAndReasons";
import {CompleteDecisionAndReasons} from "../../flows/events/completeDecisionAndReasons";
import {ApplyForPermissionToAppeal} from "../../flows/events/applyForPermissionToAppeal";
import {DecideFtpaApplication} from "../../flows/events/decideFtpaApplication";
import {TurnOnNotifications} from "../../flows/events/turnOnNotifications";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const judgeDecision: string = ['allowed'].includes(process.env.JUDGE_DECISION) ? 'allowed' : 'dismissed'; // allowed or dismissed
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
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;


test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Appellant in Person ' + typeOfAppeal + (isRehydrated ? ' Rehydrated ' : ' Paper ') + 'ICC Case ' + (inTime ? 'In Time' : 'Out of Time'), { tag: '@LegalAdminCreatesDetainedAppellantInPersonICC' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
        validationHelper = new ValidationHelper(page);
        createAppeal = new CreateAppeal(page);
        createCasePage = new CreateCasePage(page);

        await page.goto(envUrl);
    });

    test('Create ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + 'ICC case',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();

        if (['preview'].includes(runningEnv)) {
            isRehydrated ? await createAppeal.setSourceOfAppeal('rehydratedAppeal') : await createAppeal.setSourceOfAppeal('paperForm');
            await buttonHelper.continueButton.click(); // Before you start screen

            if (isRehydrated) {
                await createAppeal.enterAriaReferenceNumber();
                await createAppeal.isAppealOutOfTime(inTime ? 'No' : 'Yes');
            }
        } else {
            await buttonHelper.continueButton.click(); // Before you start screen
        }

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

        await createAppeal.setHomeOfficeReferenceNumber();
        await createAppeal.setAppellantBasicDetails(true);
        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellantAddress('detained', 'Yes');
        }

        await createAppeal.setAppellantContactDetails();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setHomeOfficeDecisionDate(inTime);
        isRehydrated ? await createAppeal.uploadNoticeOfDecision('RehydratedNod') : await createAppeal.uploadNoticeOfDecision();
        await createAppeal.hasSponsor('No');
        await createAppeal.hasDeportationOrder('No');
        await createAppeal.hasRemovalDirections('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.isHearingRequired(true);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            await createAppeal.hasFeeRemission(feeRemission);
        }

        if (typeOfAppeal === 'protection' && feeRemission === 'No') {
            await createAppeal.setPayNowLater('Now');
        }

        await createAppeal.uploadAppealDocs();
        await createAppeal.checkMyAnswers();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        if (isRehydrated) {
            await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.notifications.locator, imageLocators.rehydrated.notifications.name);
            await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.detained.appellantInPersonManual.locator, imageLocators.rehydrated.detained.appellantInPersonManual.name);
        } else {
            await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManual.locator, imageLocators.detained.appellantInPersonManual.name);
        }

        await new SubmitYourAppeal(page).submit(false, inTime);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            if (feeRemission === 'Yes') {
                await new RecordRemissionDecision(page).submit('approved');
            } else {
                await new MarkAppealAsPaid(page).recordPayment();
            }
        }

        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await linkHelper.signOut.click();
    });

    test('Legal Officer' + (!inTime ? ' records Out of Time decision, ': ' ') + 'creates Respondent Direction and adds then removes s94b', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        if (!inTime) {
            await new RecordOutOfTimeDecision(page).submit('approved');
        }

        isRehydrated ? await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.detained.appellantInPersonManual.locator, imageLocators.rehydrated.detained.appellantInPersonManual.name) :
            await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManual.locator, imageLocators.detained.appellantInPersonManual.name);

        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new S94b(page).setStatus('Yes');
        isRehydrated ? await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.detained.appellantInPersonManualS94b.locator, imageLocators.rehydrated.detained.appellantInPersonManualS94b.name) :
            await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManualS94b.locator, imageLocators.detained.appellantInPersonManualS94b.name);

        await new S94b(page).setStatus('No');
        isRehydrated ? await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.detained.appellantInPersonManual.locator, imageLocators.rehydrated.detained.appellantInPersonManual.name) :
            await validationHelper.validateLabelDisplayed(imageLocators.detained.appellantInPersonManual.locator, imageLocators.detained.appellantInPersonManual.name);


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
        await idamPage.login(legalOfficerAdminCredentials);
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
        await new CompleteDecisionAndReasons(page).upload(judgeDecision);
        await linkHelper.signOut.click();
    });

    test(`Appeal the judge's decision as ` + (judgeDecision == 'allowed' ? 'Home Office' : 'Legal Admin as Appellant'), async ({ page }) => {
        await idamPage.login(judgeDecision === 'allowed' ? homeOfficeOfficerCredentials : legalOfficerAdminCredentials);
        judgeDecision === 'allowed' ? await page.goto(envUrl + '/cases/case-details/' + caseId) : await pageHelper.getCase(caseId);
        await new ApplyForPermissionToAppeal(page).apply(judgeDecision === 'allowed' ? 'Respondent' :  'Appellant');
        await linkHelper.signOut.click();
    });

    test('Judge decides FTPA application', async ({ page }) => {
        await idamPage.login(judgeCredentials);
        await pageHelper.getCase(caseId);
        await new DecideFtpaApplication(page).submit(judgeDecision == 'allowed' ? 'Respondent' : 'Appellant');
        await linkHelper.signOut.click();
    });


});
