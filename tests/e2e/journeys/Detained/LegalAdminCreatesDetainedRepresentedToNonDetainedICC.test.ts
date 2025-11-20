import { test } from '@playwright/test';
import { envUrl, legalOfficerAdminCredentials } from '../../detainedConfig';
import { IdamPage } from '../../page-objects/pages/idam.po';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { ValidationHelper } from '../../helpers/ValidationHelper';
import { CreateAppeal } from '../../flows/createAppeal';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { SubmitYourAppeal } from '../../flows/events/submitYourAppeal';
import { RemoveDetainedStatus } from '../../flows/events/removeDetainedStatus';
import { imageLocators } from '../../fixtures/imageLocators';

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
let validationHelper: ValidationHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;
let submitYourAppeal: SubmitYourAppeal;
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
let caseId: string;

//refusalOfEu - Refusal under EEA regulations (EA) (payment required)
//refusalOfHumanRights - Refusal human rights (HU) (payment required)
//deprivation -  Deprivation of citizenship (DC) (no payment required)
//euSettlementScheme - Refusal of application under the EU Settlement Scheme (EU) (payment required)
//revocationOfProtection - Revocation of a protection status (RP) (no payment required)
//protection - Refusal of protection claim (PA) (payment required)
const typeOfAppeal: string = ['refusalOfEu', 'refusalOfHumanRights', 'deprivation', 'euSettlementScheme', 'revocationOfProtection', 'protection'].includes(process.env.APPEAL_TYPE) ? process.env.APPEAL_TYPE : 'revocationOfProtection';


test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Represented Detained ' + typeOfAppeal + ' Appeal (ICC) with detention location: ' + detentionLocation + ', ' + (inTime ? 'In Time' : 'Out of Time') + (feeRemission === 'Yes' ? ' with fee remission.':  '.'), { tag: '@LegalAdminCreatesDetainedRepresentedToNonDetainedICC' }, () => {

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

    test('Create LR-manual Detained Appeal, then convert to Non-Detained',   async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await buttonHelper.continueButton.click(); // Before you start page
        await createAppeal.setTribunalAppealReceived();
        await createAppeal.appellantInPerson('No', 'Yes');
        await createAppeal.locationInUK('Yes');
        await createAppeal.inDetention('Yes');
        await createAppeal.setDetentionLocation(detentionLocation);
        await createAppeal.setCustodialSentence('Yes');
        await createAppeal.setHomeOfficeReferenceNumber();
        await createAppeal.setAppellantBasicDetails(true);
        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellantAddress('detained', 'Yes');
        }

        await createAppeal.appellantDetails();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setHomeOfficeDecisionDate(inTime);
        await createAppeal.uploadNoticeOfDecision();
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
        await buttonHelper.closeAndReturnToCaseDetailsButton.click();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
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
