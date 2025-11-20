import {test} from '@playwright/test';
import {
    envUrl,
//    homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials,
//    legalOfficerCredentials,
//    listingOfficerCredentials
} from '../../detainedConfig';
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
//import {SubmitYourAppeal} from '../../flows/events/submitYourAppeal';
//import {RequestHomeOfficeData} from '../../flows/events/requestHomeOfficeData';
//import {GenerateListCMR} from '../../flows/events/generateListCMRTask';
//import {RespondentEvidenceDirection} from '../../flows/events/respondentEvidenceDirection';
//import {HomeOfficeBundle} from '../../flows/events/homeOfficeBundle';
//import {CaseBuildingDirection} from '../../flows/events/caseBuildingDirection';
//import {BuildYourCase} from '../../flows/events/buildYourCase';
//import {RespondentReviewDirection} from '../../flows/events/respondentReviewDirection';
//import {UploadAppealResponse} from '../../flows/events/uploadAppealResponse';
//import {ForceCaseHearingReqs} from '../../flows/events/forceCaseHearingReqs';
//import {SubmitHearingRequirements} from '../../flows/events/submitHearingRequirements';
//import {ReviewHearingRequirements} from '../../flows/events/reviewHearingRequirements';
//import {S94b} from '../../flows/events/setS94bStatus';
//import {imageLocators} from '../../fixtures/imageLocators';
//import {CreateCaseSummary} from "../../flows/events/createCaseSummary";
//import {GenerateHearingBundle} from "../../flows/events/generateHearingBundle";
//import {StartDecisionAndReasons} from "../../flows/events/startDecisionAndReasons";
//import {PrepareDecisionAndReasons} from "../../flows/events/prepareDecisionAndReasons";
//import {CompleteDecisionAndReasons} from "../../flows/events/completeDecisionAndReasons";
//import {ListTheCase} from "../../flows/events/listTheCase";

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
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + ' Rehydrated Case ' + (inTime ? 'In Time' : 'Out of Time'), { tag: '@LegalAdminCreatesDetainedRepresentedRehydratedCase' }, () => {

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

    test('Create Rehydrated case',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await createAppeal.setSourceOfAppeal('rehydratedAppeal');
        await buttonHelper.continueButton.click(); // Before you start screen
        await createAppeal.enterAriaReferenceNumber();
        await createAppeal.isAppealOutOfTime(inTime ? 'No' : 'Yes');
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('No', 'Yes');
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

        await createAppeal.appellantDetails();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setHomeOfficeDecisionDate(inTime);
        await createAppeal.uploadNoticeOfDecision('RehydratedNod');
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

        await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.notifications.locator, imageLocators.rehydrated.notifications.name);

        await new SubmitYourAppeal(page).submit(false, inTime);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            if (feeRemission === 'Yes') {
                await new RecordRemissionDecision(page).submit('approved');
            } else {
                await new MarkAppealAsPaid(page).recordPayment();
            }
        }

        await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.representedManual.locator, imageLocators.rehydrated.representedManual.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');


        await linkHelper.signOut.click();
    });

    test('Legal Officer' + (!inTime ? ' records Out of Time decision, ': ' ') + 'creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);

        if (!inTime) {
            await new RecordOutOfTimeDecision(page).submit('approved');
        }

        await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.representedManual.locator, imageLocators.rehydrated.representedManual.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new S94b(page).setStatus('Yes');
        await validationHelper.validateLabelDisplayed(imageLocators.rehydrated.representedManualS94b.locator, imageLocators.rehydrated.representedManualS94b.name);

        if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
            await new RequestHomeOfficeData(page).matchAppellantDetails();
        }

        if (cmrHearing) {
            await new GenerateListCMR(page).createTask();
        }

        await new RespondentEvidenceDirection(page).submit();

        await linkHelper.signOut.click();

    });
});
