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

//await this.page.waitForTimeout(10000); // waits for 2 seconds

const inTime: boolean = ['false'].includes(process.env.IN_TIME) ? false : true;
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING) ? true : false;
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
test.describe('Create Detained Appeal as Legal Representative with detention location: ' + detentionLocation + ', ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + (cmrHearing ? 'with' : 'without') + ' CMR listing', { tag: '@LegalRepCreatesDetainedAppealEditBeforeSubmission' }, () => {

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

});