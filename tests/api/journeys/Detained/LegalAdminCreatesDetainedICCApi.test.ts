import {expect, test} from '@playwright/test';
import {
    envUrl, legalRepresentativeCredentials, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {Detained} from "./CaseData/Detained";

const inTime: boolean = !['false'].includes(process.env.IN_TIME);
const cmrHearing: boolean = ['true'].includes(process.env.CMR_HEARING);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'Prison';
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const isAdmin: boolean = ['false'].includes(process.env.IS_ADMIN) ? false : true;
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
let caseData;
let eventData;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@LrManualDetainedApi' }, () => {

    test.beforeAll(async ({  }) => {
        // Go to the starting url before each test.
        tokensHelper = new TokensHelper();
        ccdApiHelper = new CcdApiHelper();
        if (isAdmin) {
            accessToken = await tokensHelper.getAccessToken('', legalOfficerAdminCredentials.username, legalOfficerCredentials.password);
            uid = await tokensHelper.getUserId(accessToken);
        } else {
            console.log('legal rep');
            accessToken = await tokensHelper.getAccessToken('', legalRepresentativeCredentials.username, legalRepresentativeCredentials.password);
            uid = await tokensHelper.getUserId(accessToken);
        }

        s2sToken = await tokensHelper.getS2SToken();
     });

    test('Create detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal',   async ({ page }) => {
        event = 'startAppeal';
        eventToken = await tokensHelper.getEventToken(event, null, uid, accessToken,s2sToken);

        uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken,s2sToken);
        eventData = await new Detained().generateDraftData();
        //console.log('pre inject>>>',eventData);
        // we now inject info about document uploaded to document store into the caseData

        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';


        // If rehydrate then inject the Aria ref number / If paper appeal inject the Notice of decision document
        if (isRehydrated){
            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(event, uid, accessToken, eventToken, s2sToken);
        } else {
            uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken,s2sToken);
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        }

        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument(accessToken,s2sToken);
            eventData.section17Document.document_url = uploadedDocUrl;
            eventData.section17Document.document_binary_url = uploadedDocUrl + '/binary';
        }

        console.log(eventData);

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

    test('Submit detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal',   async ({  }) => {
        event = 'submitAppeal';

        eventToken = await tokensHelper.getEventToken(event, caseId, uid, accessToken, s2sToken);
        eventData = await new Detained().generateSubmitData();

        //merge case data into event data
        caseData = { ...eventData, ...caseData };

        const appealData = {
            data:caseData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }

        const response = await  ccdApiHelper.saveDataToDataStore(event, caseId, appealData, uid, accessToken, s2sToken);

    });
 });
