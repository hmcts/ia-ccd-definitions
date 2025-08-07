import { test } from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials,
    legalOfficerAdminCredentials,
    legalOfficerCredentials
} from '../detainedConfig';
import {IdamPage} from "../page-objects/pages/idam.po";
import {LinkHelper} from "../helpers/LinkHelper";
import {PageHelper} from "../helpers/PageHelper";
import { ButtonHelper } from "../helpers/ButtonHelper";

import {CreateAppeal} from "../flows/createAppealPlaywright";
import {CreateCasePage} from "../page-objects/pages/createCase_page";
import { SubmitYourAppeal } from '../flows/events/submitYourAppealPlaywright';
import {RequestHomeOfficeData} from "../flows/events/requestHomeOfficeDataPlaywright";
import {GenerateListCMR} from "../flows/events/generateListCMRTaskPlaywright";
import {RespondentEvidenceDirection} from "../flows/events/respondentEvidenceDirectionPlaywright";
import {HomeOfficeBundle} from "../flows/events/homeOfficeBundlePlaywright";
import {CaseBuildingDirection} from "../flows/events/caseBuildingDirectionPlaywright";
import {BuildYourCase} from "../flows/events/buildYourCasePlaywright";
import {RespondentReviewDirection} from "../flows/events/respondentReviewDirectionPlaywright";
import {UploadAppealResponse} from "../flows/events/uploadAppealResponsePlaywright";
import {ForceCaseHearingReqs} from "../flows/events/ForceCaseHearingReqsPlaywright";
import {SubmitHearingRequirements} from "../flows/events/submitHearingRequirementsPlaywright";
import {ReviewHearingRequirements} from "../flows/events/reviewHearingRequirementsPlaywright";

let caseId: string;
const inTime: boolean = true;
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;
let submitYourAppeal: SubmitYourAppeal;

const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)

test.describe('Legal Admin creates Detained Appeal (ICC)', { tag: '@LegalAdminDetainedRepresentedPlaywright' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
        createAppeal = new CreateAppeal(page);
        createCasePage = new CreateCasePage(page);
        submitYourAppeal = new SubmitYourAppeal(page);

        await page.goto(envUrl);
    });

    test('Create Represented Detained Appeal in Prison with Custodial sentence - ' + (inTime ? 'In Time' : 'Out of Time'),   async () => {
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

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
        await submitYourAppeal.submit(false, inTime);

        await linkHelper.signOut.click();
});

    test('Legal Officer creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
            await new RequestHomeOfficeData(page).matchAppellantDetails();
        }

        await new GenerateListCMR(page).createTask();
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

    test('Legal Officer Admin build case (acting as Legal Rep)',   async ({ page }) => {
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

    test('Legal Officer Admin submit hearing requirements (acting as Legal Rep)',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);
        await new SubmitHearingRequirements(page).submit()
        await linkHelper.signOut.click();
    });

    test('Legal Officer to review hearing requirements',   async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new ReviewHearingRequirements(page).submit();
        await linkHelper.signOut.click();
    });

});
