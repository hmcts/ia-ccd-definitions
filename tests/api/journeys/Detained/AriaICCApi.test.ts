import {expect, test} from '@playwright/test';
import {superUserCredentials,
    envUrl, legalRepresentativeCredentials, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";
import {AriaCaseData} from "./CaseData/AriaCaseData";

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
test.describe('Legal Admin creates Detained Represented ' + typeOfAppeal + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@AriaApi' }, () => {

    test.beforeAll(async ({  }) => {
        ccdApiHelper = new CcdApiHelper();

     });

    test('Create detained ' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + ' ICC DRAFT Appeal',   async ({ page }) => {
        eventName = 'ariaCreateCase';

        await ccdApiHelper.getNonEventTokens(superUserCredentials);
        await ccdApiHelper.startEvent(eventName, null);
        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await new AriaCaseData().generateDraftData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';


            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(eventName);

            uploadedDocUrl = await ccdApiHelper.uploadDocument();
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';


        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument();
            eventData.section17Document.document_url = uploadedDocUrl;
            eventData.section17Document.document_binary_url = uploadedDocUrl + '/binary';
        }

        console.log(eventData);
        const response = await  ccdApiHelper.saveDataToDataStore(eventName, null, eventData);
        caseId = response.id;
        console.log('caseId>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<');
    });

 });
