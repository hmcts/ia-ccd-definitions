import {expect, test} from '@playwright/test';
import {
    envUrl, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {ariaReferenceNumber} from "../../../e2e/fixtures/ariaReferenceNumber";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {APIResponse} from "playwright";
import {DetainedPrisonInTimeRehydrated} from "./CaseData/DetainedPrisonInTimeRehydrated";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
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
let accessToken: string;
let uid: string;
let s2sToken: string
let ariaRefNumber: string;
let eventToken: string;
let event: string;
let ccdApiHelper: CcdApiHelper;
let tokensHelper: TokensHelper;
let uploadedDocUrl: string;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC Appeal.', { tag: '@LrManualDetainedApi' }, () => {

    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        tokensHelper = new TokensHelper();
        ccdApiHelper = new CcdApiHelper();
        accessToken = await tokensHelper.getAccessToken('', legalOfficerAdminCredentials.username, legalOfficerCredentials.password);
        uid = await tokensHelper.getUserId(accessToken);
        s2sToken = await tokensHelper.getS2SToken();
        event = 'startAppeal';
        eventToken = await tokensHelper.getEventToken(event, uid,accessToken,s2sToken);

        const maxRetries: number = 10;
        ariaRefNumber = ariaReferenceNumber.valid;

        const caseData = {
            data: {
                appealReferenceNumber: ariaRefNumber,
            },
            event: {
                id: `${event}`,
                summary: '',
                description: '',
            },
            event_token: `${eventToken}`,
            ignore_warning: 'false'
        };


        for (let retry=0; retry < maxRetries; retry++)
        {
            const response: APIResponse =  (await ccdApiHelper.validatePageData(`${event}appealReferenceNumber`, caseData, uid, accessToken, s2sToken));
            if (await response.status() === 200) {
                console.log(`Aria reference number: ${ariaRefNumber} is valid and not assigned to an existing appeal.`);
                break;
            }

            if (await response.status() === 422) {
                console.log(`Aria reference number: ${ariaRefNumber} cannot be used: ${(await response.json()).callbackErrors[0]} Generating a new Aria reference number for retry.`);
                continue;
            } else {
                throw new Error(`An unknown error was returned when validating the Aria Reference number using the CCD API: ${response}`);
            }
        }


        // Now to save a document to dm_store
        uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken,s2sToken);


    });

    test('Create detained' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + 'ICC Appeal',   async ({ page }) => {

    let caseData = await new DetainedPrisonInTimeRehydrated().generateTestData();

    // we now inject info about document created in test startup into the caseData
        caseData.appealReferenceNumber = ariaRefNumber;
        caseData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        caseData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

    const appealData = {
        data:caseData,
        event:{"id": event,"summary":"","description":""},
        event_token:eventToken,
        ignore_warning:false,
        draft_id:null
    }

    const response = await  ccdApiHelper.createDraftAppeal(event,appealData,uid,accessToken,s2sToken);
    console.log('caseId>>>>>>>>>>>>>>' + response.id + '<<<<<<<<<<<<<<');

    });


 });
