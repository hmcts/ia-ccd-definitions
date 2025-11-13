import {test} from '@playwright/test';
import {
    envUrl,
//    homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials,
//    legalOfficerCredentials,
//    listingOfficerCredentials
} from '../../detainedConfig';
import {IdamPage} from '../../page-objects/pages/idam.po';
//import {LinkHelper} from '../../helpers/LinkHelper';
//import {PageHelper} from '../../helpers/PageHelper';
import {ButtonHelper} from '../../helpers/ButtonHelper';
//import {ValidationHelper} from '../../helpers/ValidationHelper'
import {CreateAppeal} from '../../flows/createAppeal';
import {CreateCasePage} from '../../page-objects/pages/createCase_page';
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

const inTime: boolean = true;
let idamPage: IdamPage;
//let linkHelper: LinkHelper;
//let pageHelper: PageHelper;
let buttonHelper: ButtonHelper;
//let validationHelper: ValidationHelper;
let createAppeal: CreateAppeal;
let createCasePage: CreateCasePage;
//let caseId: string;


//const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Rehydrated Case ' + (inTime ? 'In Time' : 'Out of Time'), { tag: '@LegalAdminCreatesRehydratedCase' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        idamPage = new IdamPage(page);
//        linkHelper = new LinkHelper(page);
//        pageHelper = new PageHelper(page);
        buttonHelper = new ButtonHelper(page);
//        validationHelper = new ValidationHelper(page);
        createAppeal = new CreateAppeal(page);
        createCasePage = new CreateCasePage(page);

        await page.goto(envUrl);
    });

    test('Create Rehydrated case',   async ({ page }) => {
        // const detentionLocation: string = 'immigrationRemovalCentre';
       //  const detentionLocation: string = 'prison';
        // const detentionLocation: string = 'other';


        await idamPage.login(legalOfficerAdminCredentials);
        await createCasePage.createCase();
        await createAppeal.setSourceOfAppeal('rehydratedAppeal');
        await buttonHelper.continueButton.click(); // Before you start page
    });
});
