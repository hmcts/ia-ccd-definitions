import { test } from '@playwright/test';
import { envUrl, legalRepresentativeCredentials, legalOfficerCredentials } from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';
import { CreateCasePage } from '../page-objects/pages/createCase_page';
import { CreateAppeal } from '../flows/createAppealPlaywright';
import { LinkHelper } from'../helpers/LinkHelper';
import { PageHelper } from '../helpers/PageHelper';
import { ValidationHelper } from '../helpers/ValidationHelper';
import { SubmitYourAppeal } from '../flows/events/submitYourAppealPlaywright';
import { CreateServiceRequest } from '../flows/events/createServiceRequestPlaywright';
import { PaymentPage } from '../page-objects/pages/payment_page';
import { S94b } from "../flows/events/setS94bStatusPlaywright";

//await this.page.waitForTimeout(10000); // waits for 2 seconds


let caseId: string = '1754305894509453';
const inTime: boolean = true;
//const cmrListing: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';
//const typeOfAppeal: string = 'refusalOfEu'; // Refusal under EEA regulations (payment required)
//const typeOfAppeal: string = 'refusalOfHumanRights'; // Refusal human rights (payment required)
//const typeOfAppeal: string  = 'deprivation'; // Deprivation of citizenship (no payment required)
//const typeOfAppeal: string  = 'euSettlementScheme'; // Refusal of application under the EU Settlement Scheme (payment required)
//const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)
const typeOfAppeal:string = 'protection'; // Refusal of protection claim (payment required)

const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
const detainedRepresentedS94bImageLocator: string = '//*[@id="journey_type_legal_rep_detained_s9"]/dt/ccd-markdown/div/markdown/p/img';
let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let validationHelper: ValidationHelper;

test.describe('Create Detained Appeal as Legal Representative ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + '@LegalRepCreatesDetainedRepresentedPlaywright', () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        validationHelper = new ValidationHelper(page);
        await page.goto(envUrl);
    });

    test('Create Detained Appeal', async ({ page }) => {
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

        await createAppeal.setHomeOfficeDetails(inTime);
        await createAppeal.uploadNoticeOfDecision();
        await createAppeal.setTypeOfAppeal(typeOfAppeal);
        await createAppeal.setAppellantBasicDetails(false);
        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellentsAddress('detained', 'Yes');
        }

        await createAppeal.hasSponsor('Yes');
        await createAppeal.hasDeportationOrder('Yes');
        await createAppeal.hasRemovalDirections('Yes');
        await createAppeal.hasNewMatters('Yes');
        await createAppeal.hasOtherAppeals('No');
        await createAppeal.setLegalRepresentativeDetails();
        await createAppeal.isHearingRequired(true);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            await createAppeal.hasFeeRemission('No');
        }

        if (typeOfAppeal === 'protection') {
            await createAppeal.setPayNowLater('Now');
        }

        await createAppeal.checkMyAnswers();

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');
        await new SubmitYourAppeal(page).submit(true, inTime);

        if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
            // create service request
            await new CreateServiceRequest(page).submit();

            // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
            await new PaymentPage(page).makePayment('CC', caseId);
        }

        await linkHelper.signOut.click();
    });

    test('Legal Officer adds s94b appeal status, updates detention location and creates Respondent Direction', async ({ page }) => {
        await idamPage.login(legalOfficerCredentials);
        await pageHelper.getCase(caseId);
        await new S94b(page).setStatus('Yes');

        await validationHelper.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
        await validationHelper.validateCorrectLabelDisplayed(detainedRepresentedS94bImageLocator, 'legalRep_detained_s9');
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        // TODO - still to convert
        // await updateDetentionLocation.changeLocation(detentionLocation === 'prison' ? 'other' : (detentionLocation === 'other' ? 'immigrationRemovalCentre' : 'prison'), detentionLocation === 'prison' ? false:  (detentionLocation === 'other' ? true : false));
        // await updateDetentionLocation.validateDataUpdated(detentionLocation);
        //
        // if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
        //     await requestHomeOfficeData.matchAppellantDetails();
        // }
        //
        // await generateListCMR.createTask();
        // await respondentEvidenceDirection.submit();

        await linkHelper.signOut.click();
    });
});