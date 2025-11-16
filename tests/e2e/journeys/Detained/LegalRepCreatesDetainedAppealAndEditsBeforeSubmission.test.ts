import { test } from '@playwright/test';
import {
    envUrl,
    legalRepresentativeCredentials,
} from '../../detainedConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
import { CreateCasePage } from '../../page-objects/pages/createCase_page';
import { CreateAppeal } from '../../flows/createAppeal';
import { LinkHelper } from '../../helpers/LinkHelper';
import { PageHelper } from '../../helpers/PageHelper';
import { EditAppeal } from '../../flows/events/editAppeal';
import {ButtonHelper} from "../../helpers/ButtonHelper";


//await this.page.waitForTimeout(10000); // waits for 2 seconds
const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
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

test.describe.configure({ mode: 'serial' });
test.describe('Create Detained Appeal as Legal Representative with detention location: ' + detentionLocation + ', ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + (cmrHearing ? 'with' : 'without') + ' CMR listing', { tag: '@LegalRepEditsDetainedAppealBeforeSubmission' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
        linkHelper = new LinkHelper(page);
        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);

        await page.goto(envUrl);
    });

    test('Create Detained Appeal', async ({ page }) => {
        const createAppeal = new CreateAppeal(page);
        await idamPage.login(legalRepresentativeCredentials);
        await new CreateCasePage(page).createCase();

        await buildAppeal('create');

        caseId = await pageHelper.grabCaseNumber();
        console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

        await new EditAppeal(page).edit();
        detentionLocation = 'other';
        await buildAppeal('edit');

        await linkHelper.signOut.click();

        /*************************/
        async function buildAppeal(stage: string = 'create') {
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

            if (stage === 'create') {
                await createAppeal.uploadNoticeOfDecision();
            } else {
                 await buttonHelper.continueButton.click(); // Upload Notice of Decision - no need to load another document
            }
            await createAppeal.setTypeOfAppeal(typeOfAppeal);

            if (typeOfAppeal !== 'euSettlementScheme') {
                await createAppeal.setGroundsOfAppeal(typeOfAppeal);
            }

            await createAppeal.setAppellantBasicDetails(false);

            if (stage === 'create') {
                await createAppeal.setNationality(true);
            } else {
                await buttonHelper.continueButton.click(); // Nationality - no need to load another one
            }

            if (detentionLocation === 'other') {
                await createAppeal.setAppellantAddress('detained', 'Yes');
            }

            if (stage === 'create') {
                await createAppeal.hasSponsor('Yes');
            } else {
                await createAppeal.hasSponsor('No');
            }
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

        }

    });
});



