import {expect, test} from '@playwright/test';
import {
    envUrl, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {ariaReferenceNumber} from "../../../fixtures/ariaReferenceNumber";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {APIResponse} from "playwright";
import {Represented} from "./CaseData/Represented";
import {stringify} from "node:querystring";
import {DetainedRepresented} from "../Detained/CaseData/DetainedRepresented";

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
let uploadedAppealFormDocUrl: string;
let uploadedNoticeOfDecisionDocUrl: string;
let caseId: string = '';
let caseData;
let eventData;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Out of Country ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@LrManualOutOfCountryApi' }, () => {

    test.beforeAll(async ({ }) => {
        // Go to the starting url before each test.
        tokensHelper = new TokensHelper();
        ccdApiHelper = new CcdApiHelper();
        accessToken = await tokensHelper.getAccessToken('', legalOfficerAdminCredentials.username, legalOfficerCredentials.password);
        uid = await tokensHelper.getUserId(accessToken);
        s2sToken = await tokensHelper.getS2SToken();
      });

    test('Create Out of Country ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + 'ICC DRAFT Appeal',   async ({ page }) => {
        event = 'startAppeal';
        eventToken = await tokensHelper.getEventToken(event, null, uid, accessToken, s2sToken);

        eventData = await new Represented().generateDraftData();
        // we now inject info about document created in test startup into the caseData
        if (appellantInUK === 'Yes') {
            uploadedNoticeOfDecisionDocUrl = await ccdApiHelper.uploadDocument(accessToken, s2sToken, 'TEST_DOCUMENT_1.pdf');
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedNoticeOfDecisionDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedNoticeOfDecisionDocUrl + '/binary';
        }

        if (isRehydrated) {
            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(event, uid, accessToken, eventToken, s2sToken);
        }

        uploadedAppealFormDocUrl = await ccdApiHelper.uploadDocument(accessToken, s2sToken, 'TEST_DOCUMENT_2.pdf');
        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedAppealFormDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedAppealFormDocUrl + '/binary';
        //console.log(eventData);

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
        caseData = await response.case_data;
    });

    test('Submit Out of Country ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + 'ICC DRAFT Appeal',   async ({  }) => {
        event = 'submitAppeal';

        eventToken = await tokensHelper.getEventToken(event, caseId, uid, accessToken, s2sToken);
        eventData = await new Represented().generateSubmitData();

        //merge case data into event data
        caseData = { ...eventData, ...caseData };

        const appealData = {
            data:caseData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }

         const response = await  ccdApiHelper.saveDataToDataStore(event, caseId, appealData, uid, accessToken, s2sToken);
        // console.log('submit>>> ', response);
    });
 });
