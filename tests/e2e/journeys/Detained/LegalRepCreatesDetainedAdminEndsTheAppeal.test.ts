import {
    envUrl,
    legalRepresentativeCredentials,
    legalOfficerAdminCredentials,
} from '../../detainedConfig';
import { IdamPage } from '../../page-objects/pages/idam.po';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { CreateAppeal } from '../../flows/createAppeal';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { ValidationHelper } from '../../helpers/ValidationHelper';
import { SubmitYourAppeal } from '../../flows/events/submitYourAppeal';
import { CreateServiceRequest } from '../../flows/events/createServiceRequest';
import { PaymentPage } from '../../page-objects/pages/payment_page';
import { imageLocators } from '../../fixtures/imageLocators';
import { EndTheAppeal } from "../../flows/events/endTheAppeal";
import { test } from '../../fixtures/myFixture';

const inTime: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';
const typeOfAppeal:string = 'protection'; // Refusal of protection claim (payment required)

let idamPage: IdamPage;
let linkHelper: LinkHelper;
let pageHelper: PageHelper;
let validationHelper: ValidationHelper;
let caseId: string;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Rep creates Detained Appeal ' + (inTime ? 'In Time' : 'Out of Time' + ' Admin then ends the appeal'), { tag: '@LegalRepCreatesRepresentedAdminEndsTheAppeal' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        validationHelper = new ValidationHelper(page);
        await page.goto(envUrl);
    });

    test('Create Detained Appeal', async ({ page } ) => {
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

        if (typeOfAppeal !== 'euSettlementScheme') {
            await createAppeal.setGroundsOfAppeal(typeOfAppeal);
        }

        await createAppeal.setAppellantBasicDetails(false);



        await createAppeal.setNationality(true);

        if (detentionLocation === 'other') {
            await createAppeal.setAppellantAddress('detained', 'Yes');
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

        await createAppeal.checkMyAnswers(true);

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

    test('Legal Officer Admin ends the appeal', async ({ page }) => {
        await idamPage.login(legalOfficerAdminCredentials);
        await pageHelper.getCase(caseId);

        await validationHelper.validateLabelDisplayed(imageLocators.detained.represented.locator, imageLocators.detained.represented.name);
        await validationHelper.validateCaseFlagExists('Detained individual', 'Active');

        await new EndTheAppeal(page).end('No valid appeal', 'Case Worker');
        await linkHelper.signOut.click();
    });

});