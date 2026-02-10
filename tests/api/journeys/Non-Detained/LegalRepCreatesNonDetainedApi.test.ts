import {expect, test} from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials,
    judgeCredentials,
    legalOfficerAdminCredentials,
    legalOfficerCredentials,
    legalRepresentativeCredentials,
    listingOfficerCredentials,
    runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {LegalRepNonDetained} from "./CaseData/LegalRepNonDetained";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const appellantInUK: string = ['Yes', 'No'].includes(process.env.IN_UK) ? process.env.IN_UK : 'Yes';
const judgeDecision: string = ['allowed'].includes(process.env.JUDGE_DECISION) ? 'allowed' : 'dismissed'; // allowed or dismissed



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
let caseId: string = '';
let caseData;
let eventData;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Representative creates ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') + typeOfAppeal +', ' + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'DRAFT Appeal.', { tag: '@LrNonDetainedApi' }, () => {

    test.beforeAll(async ({ }) => {
        // Go to the starting url before each test.
        tokensHelper = new TokensHelper();
        ccdApiHelper = new CcdApiHelper();
        accessToken = await tokensHelper.getAccessToken('', legalRepresentativeCredentials.username, legalRepresentativeCredentials.password);
        uid = await tokensHelper.getUserId(accessToken);
        s2sToken = await tokensHelper.getS2SToken();
      });

    test('Create ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') +  + 'DRAFT Appeal',   async ({ page }) => {
        event = 'startAppeal';
        eventToken = await tokensHelper.getEventToken(event, null, uid, accessToken, s2sToken);

        eventData = await new LegalRepNonDetained().generateDraftData();
        // we now inject info about document created in test startup into the caseData
        uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken, s2sToken, 'TEST_DOCUMENT_1.pdf');
        eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken,s2sToken);
            eventData.section17Document.document_url = uploadedDocUrl;
            eventData.section17Document.document_binary_url = uploadedDocUrl + '/binary';
        }

        const appealData = {
            data:eventData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false,
            draft_id:null
        }

        const response = await  ccdApiHelper.saveDataToDataStore(event, null, appealData, uid, accessToken, s2sToken);
        caseId = response.id;
        console.log('caseId>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<');
      //  caseData = await response.case_data;
      //  console.log(caseData);
    });

    test('Submit ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') + 'DRAFT Appeal',   async ({  }) => {
        event = 'submitAppeal';

        eventToken = await tokensHelper.getEventToken(event, caseId, uid, accessToken, s2sToken);
        eventData = await new LegalRepNonDetained().generateSubmitData();

        const appealData = {
            data:eventData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }
        //console.log(appealData);
         const response = await  ccdApiHelper.saveDataToDataStore(event, caseId, appealData, uid, accessToken, s2sToken);
    });
 });
