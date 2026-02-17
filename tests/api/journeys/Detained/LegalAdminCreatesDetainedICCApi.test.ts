import {expect, test} from '@playwright/test';
import {
    envUrl, legalRepresentativeCredentials, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {LegalAdminDetained} from "./CaseData/LegalAdminDetained";
import {RecordRemissionDecision} from "../../../e2e/flows/events/recordRemissionDecision";

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
let eventName: string;
let ccdApiHelper: CcdApiHelper;
let uploadedDocUrl: string;
let eventData;



test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@LrManualDetainedApi' }, () => {

    test.beforeAll(async ({}) => {
        ccdApiHelper = new CcdApiHelper();

    });

    test('Create detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal', async ({page}) => {
        eventName = 'startAppeal';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, null);
        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await new LegalAdminDetained().generateDraftData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';


        // If rehydrate then inject the Aria ref number / If paper appeal inject the Notice of decision document
        if (isRehydrated) {
            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(eventName);
        } else {
            uploadedDocUrl = await ccdApiHelper.uploadDocument();
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        }

        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument();
            eventData.section17Document.document_url = uploadedDocUrl;
            eventData.section17Document.document_binary_url = uploadedDocUrl + '/binary';
        }

        //console.log(eventData);
        const response = await ccdApiHelper.saveDataToDataStore(eventName, null, eventData);
        caseId = response.id;
        console.log('caseId>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<');
    });

    test('Submit detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal', async ({}) => {
        eventName = 'submitAppeal';

        await ccdApiHelper.startEvent(eventName, caseId);
        eventData = await new LegalAdminDetained().generateSubmitData();

        const response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    // This is an additional step/test ONLY run if fee remission has been undertaken, as we need to make a decision on the fee remission
    if (feeRemission === 'Yes') {
        test('Submit: Record Remission Decision event', async ({page}) => {
            eventName = 'recordRemissionDecision';
            await ccdApiHelper.startEvent(eventName, caseId);

            eventData = await new LegalAdminDetained().generateRecordRemissionDecisionData();

            // validate the data before submitting
            let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
            expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);
            response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
        });
    }

    test('Submit: Mark as Paid event', async ({}) => {
        eventName = 'markAppealPaid';
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await new LegalAdminDetained().generateMarkAsPaidData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + 'remissionDecisionDetails', eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);
        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });


    test('Submit: Request Respondent Evidence event', async ({}) => {
        eventName = 'requestRespondentEvidence';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await new LegalAdminDetained().generateRequestRespondentEvidenceData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: Upload Home Office Bundle event', async ({}) => {
        eventName = 'uploadHomeOfficeBundle';

        await ccdApiHelper.getNonEventTokens(homeOfficeOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await new LegalAdminDetained().generateUploadedHomeOfficeBundleDocsData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.homeOfficeBundle[0].value.document.document_url = uploadedDocUrl;
        eventData.homeOfficeBundle[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(await response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: Request Case Building event', async ({}) => {
        eventName = 'requestCaseBuilding';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await new LegalAdminDetained().generateRequestCaseBuildingData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: Build Your Case event', async ({}) => {
        eventName = 'buildCase';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await new LegalAdminDetained().generateBuildYourCaseData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.caseArgumentDocument.document_url = uploadedDocUrl;
        eventData.caseArgumentDocument.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: Request Respondent Review event', async ({}) => {
        eventName = 'requestRespondentReview';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);
        eventData = await new LegalAdminDetained().generateRespondentReviewData();

        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: Upload The Appeal Response event', async ({}) => {
        eventName = 'uploadHomeOfficeAppealResponse';

        await ccdApiHelper.getNonEventTokens(homeOfficeOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await new LegalAdminDetained().generateUploadTheAppealResponseData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.homeOfficeAppealResponseDocument.document_url = uploadedDocUrl;
        eventData.homeOfficeAppealResponseDocument.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData('uploadHomeOfficeAppealResponse' + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

    test('Submit: For Case - Hearing Reqs event', async ({}) => {
        eventName = 'draftHearingRequirements';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await new LegalAdminDetained().generateDraftHearingRequirementsData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, eventData);
    });

});