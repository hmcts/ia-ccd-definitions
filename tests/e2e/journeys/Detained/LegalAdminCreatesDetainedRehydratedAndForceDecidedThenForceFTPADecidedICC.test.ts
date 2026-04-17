import {test} from '@playwright/test';
import {
    envUrl, legalOfficerAdminCredentials, runningEnv,
} from '../../../iacConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
import {LinkHelper} from '../../../helpers/LinkHelper';
import {PageHelper} from '../../../helpers/PageHelper';
import {ButtonHelper} from '../../../helpers/ButtonHelper';
import {ValidationHelper} from '../../../helpers/ValidationHelper'
import {CreateAppeal} from '../../flows/createAppeal';
import {CreateCasePage} from '../../page-objects/pages/createCase_page';
import {SubmitYourAppeal} from "../../flows/events/submitYourAppeal";
import {RecordRemissionDecision} from "../../flows/events/recordRemissionDecision";
import {MarkAppealAsPaid} from "../../flows/events/markAppealAsPaid";
import {imageLocators} from "../../../fixtures/imageLocators";
import {ForceDecidedStateEvent} from '../../flows/events/forceDecidedState';
import {ForceFtpaDecidedState} from "../../flows/events/forceFtpaDecidedState";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
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
test.describe('Legal Admin creates Detained Rehydrated and Force Decided ICC Case', { tag: '@LegalAdminCreatesDetainedRehydratedAndForceDecidedICC' }, () => {

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

        if (['preview', 'demo'].includes(runningEnv)) {
            isRehydrated ? await createAppeal.setSourceOfAppeal('rehydratedAppeal') : await createAppeal.setSourceOfAppeal('paperForm');
            await buttonHelper.continueButton.click(); // Before you start screen

            if (isRehydrated) {
                await createAppeal.setAriaReferenceNumber();
                await createAppeal.setTribunalAppealReceived();
                await createAppeal.isAppealOutOfTime(inTime ? 'No' : 'Yes');
            } else {
                await createAppeal.setTribunalAppealReceived();
            }
        } else {
            await buttonHelper.continueButton.click(); // Before you start screen
            await createAppeal.setTribunalAppealReceived();
        }

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

    test('Force case to decided state', { }, async ({ page }) => {
        test.skip(process.env.FORCE_DECIDED !== 'true' || !isRehydrated, 'Skipping force decided state test - FORCE_DECIDED not set or not a rehydrated case');

        await idamPage.login(legalOfficerAdminCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);

        const forceDecidedState = new ForceDecidedStateEvent(page);
        await forceDecidedState.forceDecidedState(judgeDecision);

        if (judgeDecision === 'allowed') {
            await validationHelper.validateLabelDisplayed(imageLocators.appealCompleted.appealAllowed.locator, imageLocators.appealCompleted.appealAllowed.name);
        } else {
            await validationHelper.validateLabelDisplayed(imageLocators.appealCompleted.appealDismissed.locator, imageLocators.appealCompleted.appealDismissed.name);
        }
    });

    test('Force case to FTPA decided state', { }, async ({ page }) => {
        test.skip(!isRehydrated, 'Skipping force FTPA decided state test - not a rehydrated case');

        await idamPage.login(legalOfficerAdminCredentials);
        await page.goto(envUrl + '/cases/case-details/' + caseId);
        await new ForceFtpaDecidedState(page).submit(judgeDecision);

    });

});
