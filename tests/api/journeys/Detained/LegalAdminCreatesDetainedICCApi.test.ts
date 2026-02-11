import {expect, test} from '@playwright/test';
import {
    envUrl, legalRepresentativeCredentials, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {LegalAdminDetained} from "./CaseData/LegalAdminDetained";

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
let caseData;
let eventData;
let legalOfficerAdminAccessToken: string;
let legalOfficerAdminUid: string;
let legalOfficerAdminS2sToken: string;
let legalOfficerAccessToken: string;
let legalOfficerUid: string;
let legalOfficerS2sToken: string;
let homeOfficeOfficerAccessToken: string;
let homeOfficeOfficerUid: string;
let homeOfficeOfficerS2sToken: string;


test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@LrManualDetainedApi' }, () => {

    test.beforeAll(async ({  }) => {
        // Go to the starting url before each test.
        tokensHelper = new TokensHelper();
        ccdApiHelper = new CcdApiHelper();
       // accessToken = await tokensHelper.getAccessToken('', legalOfficerAdminCredentials.username, legalOfficerCredentials.password);
       // uid = await tokensHelper.getUserId(accessToken);
       // s2sToken = await tokensHelper.getS2SToken();
     });

    test('Create detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal',   async ({ page }) => {
        event = 'startAppeal';
        legalOfficerAdminAccessToken = await tokensHelper.getAccessToken('', legalOfficerAdminCredentials.username, legalOfficerAdminCredentials.password);
        legalOfficerAdminUid = await tokensHelper.getUserId(legalOfficerAdminAccessToken);
        legalOfficerAdminS2sToken = await tokensHelper.getS2SToken();

        eventToken = await tokensHelper.getEventToken(event, null, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);

        uploadedDocUrl = await ccdApiHelper.uploadDocument(legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
        eventData = await new LegalAdminDetained().generateDraftData();
        //console.log('pre inject>>>',eventData);
        // we now inject info about document uploaded to document store into the eventData

        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';


        // If rehydrate then inject the Aria ref number / If paper appeal inject the Notice of decision document
        if (isRehydrated){
            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(event, legalOfficerAdminUid, legalOfficerAdminAccessToken, eventToken, legalOfficerAdminS2sToken);
        } else {
            uploadedDocUrl = await ccdApiHelper.uploadDocument(legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        }

        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument(legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
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
        //console.log(eventData);
        const response = await  ccdApiHelper.saveDataToDataStore(event, null, appealData, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
        caseId = response.id;
        console.log('caseId>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<');
        //caseData = await response.case_data;
    });

    test('Submit detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal',   async ({  }) => {
        event = 'submitAppeal';

        eventToken = await tokensHelper.getEventToken(event, caseId, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
        eventData = await new LegalAdminDetained().generateSubmitData();

        const appealData = {
            data:caseData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }

        const response = await ccdApiHelper.saveDataToDataStore(event, caseId, appealData, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
    });

    test('Submit: Mark as Paid event',   async ({  }) => {
        event = 'markAppealPaid';

        eventToken = await tokensHelper.getEventToken(event, caseId, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
        eventData = await new LegalAdminDetained().generateMarkAsPaidData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(event+event, event, eventData, legalOfficerAdminUid, eventToken, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
        expect(await response.status(), `Validation failed for event: ${event}`).toEqual(200);
            const dataToSubmit = {
                data:eventData,
                event:{"id": event,"summary":"","description":""},
                event_token:eventToken,
                ignore_warning:false
            }

            response = await  ccdApiHelper.saveDataToDataStore(event, caseId, dataToSubmit, legalOfficerAdminUid, legalOfficerAdminAccessToken, legalOfficerAdminS2sToken);
    });


    test('Submit: Request Respondent Evidence event',   async ({  }) => {
        event = 'requestRespondentEvidence';
        legalOfficerAccessToken = await tokensHelper.getAccessToken('', legalOfficerCredentials.username, legalOfficerCredentials.password);
        legalOfficerUid = await tokensHelper.getUserId(legalOfficerAccessToken);
        legalOfficerS2sToken = await tokensHelper.getS2SToken();

        eventToken = await tokensHelper.getEventToken(event, caseId, legalOfficerUid, legalOfficerAccessToken, legalOfficerS2sToken);
        eventData = await new LegalAdminDetained().generateRequestRespondentEvidenceData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(event+event, event, eventData, legalOfficerUid, eventToken, legalOfficerAccessToken, legalOfficerS2sToken);
        expect(await response.status(), `Validation failed for event: ${event}`).toEqual(200);
        const dataToSubmit = {
            data:eventData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }

        response = await  ccdApiHelper.saveDataToDataStore(event, caseId, dataToSubmit, legalOfficerUid, legalOfficerAccessToken, legalOfficerS2sToken);
    });

    test('Submit: Upload Home Office Bundle event',   async ({  }) => {
        event = 'uploadHomeOfficeBundle';
        homeOfficeOfficerAccessToken = await tokensHelper.getAccessToken('', homeOfficeOfficerCredentials.username, homeOfficeOfficerCredentials.password);
        homeOfficeOfficerUid = await tokensHelper.getUserId(homeOfficeOfficerAccessToken);
        homeOfficeOfficerS2sToken = await tokensHelper.getS2SToken();

        eventToken = await tokensHelper.getEventToken(event, caseId, homeOfficeOfficerUid, homeOfficeOfficerAccessToken, homeOfficeOfficerS2sToken);

        uploadedDocUrl = await ccdApiHelper.uploadDocument(homeOfficeOfficerAccessToken, homeOfficeOfficerS2sToken);
        eventData = await new LegalAdminDetained().generateUploadedHomeOfficeBundleDocsData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.homeOfficeBundle[0].value.document.document_url = uploadedDocUrl;
        eventData.homeOfficeBundle[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(event+event, event, eventData, homeOfficeOfficerUid, eventToken, homeOfficeOfficerAccessToken, homeOfficeOfficerS2sToken);
        expect(await response.status(), `Validation failed for event: ${event}`).toEqual(200);
        const dataToSubmit = {
            data:eventData,
            event:{"id": event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false
        }

        response = await  ccdApiHelper.saveDataToDataStore(event, caseId, dataToSubmit, homeOfficeOfficerUid, homeOfficeOfficerAccessToken, homeOfficeOfficerS2sToken);

    });

 });
