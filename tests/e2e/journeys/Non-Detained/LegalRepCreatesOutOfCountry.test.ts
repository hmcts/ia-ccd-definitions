import { test, expect } from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials, judgeCredentials, legalOfficerAdminCredentials, legalOfficerCredentials,
    legalRepresentativeCredentials,
    listingOfficerCredentials
} from '../../iacConfig';
import { IdamPage } from '../../page-objects/pages/idam.po';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { CreateAppeal } from '../../flows/createAppeal';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { SubmitYourAppeal } from '../../flows/events/submitYourAppeal';
import {RespondentEvidenceDirection} from "../../flows/events/respondentEvidenceDirection";
import {HomeOfficeBundle} from "../../flows/events/homeOfficeBundle";
import {CaseBuildingDirection} from "../../flows/events/caseBuildingDirection";
import {BuildYourCase} from "../../flows/events/buildYourCase";
import {RespondentReviewDirection} from "../../flows/events/respondentReviewDirection";
import {UploadAppealResponse} from "../../flows/events/uploadAppealResponse";
import {ForceCaseHearingReqs} from "../../flows/events/forceCaseHearingReqs";
import {SubmitHearingRequirements} from "../../flows/events/submitHearingRequirements";
import {ReviewHearingRequirements} from "../../flows/events/reviewHearingRequirements";
import {CreateCaseSummary} from "../../flows/events/createCaseSummary";
import {GenerateHearingBundle} from "../../flows/events/generateHearingBundle";
import {StartDecisionAndReasons} from "../../flows/events/startDecisionAndReasons";
import {PrepareDecisionAndReasons} from "../../flows/events/prepareDecisionAndReasons";
import {CompleteDecisionAndReasons} from "../../flows/events/completeDecisionAndReasons";
import {ListTheCase} from "../../flows/events/listTheCase";
import {ValidationHelper} from "../../helpers/ValidationHelper";
import {imageLocators} from "../../fixtures/imageLocators";
import {RecordRemissionDecision} from "../../flows/events/recordRemissionDecision";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const judgeDecision: string = ['allowed'].includes(process.env.JUDGE_DECISION) ? 'allowed' : 'dismissed'; // allowed or dismissed
const daysToComply: number = 14;

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
let caseId: string = '';
const outOfCountryDecision: string = 'entryClearanceDecision';

test.describe.configure({ mode: 'serial'});
test.describe('Create Out of Country Appeal as Legal Representative', { tag: '@LegalRepCreatesOutOfCountry' }, () => {

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
        await createAppeal.outOfCountryDecision(outOfCountryDecision, inTime);
        await createAppeal.setHomeOfficeReferenceNumber(true);
        await createAppeal.setAppellantBasicDetails(false);
        await createAppeal.setNationality(true);
        await createAppeal.setOutOfCountryAddress('Yes');
        await createAppeal.setAppellantContactPreference('Email');
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setGroundsOfAppeal(typeOfAppeal);

        if (outOfCountryDecision === 'refusePermit') {
            await createAppeal.setEntryClearanceDecisionDate(inTime);
        } else {
            await createAppeal.setHomeOfficeDecisionDate(inTime);
        }

        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.hasSponsor('Yes');
        await createAppeal.hasDeportationOrder('Yes');
        await createAppeal.hasNewMatters('No');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.setLegalRepresentativeDetails();
        await createAppeal.isHearingRequired(true);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            await createAppeal.hasFeeRemission(feeRemission);
        }

        if (typeOfAppeal === 'protection' && feeRemission === 'No') {
            await createAppeal.setPayNowLater('Now');
        }

        await createAppeal.checkMyAnswers(true); //skip for preview as close and continue screen displaying

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        await new SubmitYourAppeal(page).submit(inTime);

        await linkHelper.signOut.click();
    });

    if (feeRemission === 'Yes'){
        test('Legal Admin records Remission decision', async ({ page }) => {
            await idamPage.login(legalOfficerAdminCredentials);
            await pageHelper.getCase(caseId);
            await new RecordRemissionDecision(page).submit('approved');
            await linkHelper.signOut.click();
        });
    }

    test('Legal Officer creates Respondent Evidence Direction', async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
        await pageHelper.getCase(caseId);

        await new ValidationHelper(page).validateLabelDisplayed(imageLocators.nonDetained.represented.locator, imageLocators.nonDetained.represented.name);

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

    test('Legal Rep builds case',   async ({ page }) => {
        await idamPage.login(legalRepresentativeCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new BuildYourCase(page).build();
        await linkHelper.signOut.click();
    });

    test('Legal Officer creates Respondent Review Direction',   async ({ page }) => {
        await idamPage.login(listingOfficerCredentials);
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

    test('Legal Rep submit hearing requirements',   async ({ page }) => {
        await idamPage.login(legalRepresentativeCredentials);
        await page.goto(envUrl + '/cases/case-details/' + await caseId);
        await new SubmitHearingRequirements(page).submit(false);
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
