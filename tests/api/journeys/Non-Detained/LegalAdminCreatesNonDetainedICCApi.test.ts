import {expect, test} from '@playwright/test';
import {
    envUrl,
    homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials,
} from '../../../iacConfig';
import {CcdApiHelper} from "../../../helpers/CcdApiHelper";
import {LegalAdminNonDetained} from "./CaseData/LegalAdminNonDetained";
import {CommonData} from "../../CaseData/CommonData";
import {WaitUtils} from "../../../e2e/utils/wait.utils";
import {IdamPage} from "../../../e2e/page-objects/pages/idam.po";
import {LinkHelper} from "../../../helpers/LinkHelper";
import {PageHelper} from "../../../helpers/PageHelper";
import {CompleteDecisionAndReasons} from "../../../e2e/flows/events/completeDecisionAndReasons";


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
let eventName: string;
let ccdApiHelper: CcdApiHelper;
let legalAdminNonDetained: LegalAdminNonDetained;
let commonData: CommonData;
let uploadedDocUrl: string;
let caseId: string = '';
let ariaReferenceNumber: string = '';
let eventData;
let caseData;
let savedDataResponse;

test.describe.configure({ mode: 'serial'});
test.describe('Legal Admin creates ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') + typeOfAppeal +', ' + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + (inTime ? 'In Time, ' : 'Out of Time, ')  + 'ICC DRAFT Appeal.', { tag: '@LrManualNonDetainedApi' }, () => {

    test.beforeAll(async ({ }) => {
        ccdApiHelper = new CcdApiHelper();
        commonData = new CommonData();
        legalAdminNonDetained = new LegalAdminNonDetained();
      });

    test('Create ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + 'ICC DRAFT Appeal',   async ({ page }) => {
        eventName = 'startAppeal';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, null);

        eventData = await new LegalAdminNonDetained().generateDraftData();
        // we now inject info about document created in test startup into the caseData
        if (appellantInUK === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument('TEST_DOCUMENT_1.pdf');
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_url = uploadedDocUrl;
            eventData.uploadTheNoticeOfDecisionDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        }

        if (isRehydrated) {
            eventData.appealReferenceNumber = await ccdApiHelper.getAriaReferenceNumber(eventName);
        }

        uploadedDocUrl = await ccdApiHelper.uploadDocument('TEST_DOCUMENT_2.pdf');
        eventData.uploadTheAppealFormDocs[0].value.document.document_url = uploadedDocUrl;
        eventData.uploadTheAppealFormDocs[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

        // If fee remission, inject section 17 document
        if (feeRemission === 'Yes') {
            uploadedDocUrl = await ccdApiHelper.uploadDocument('TEST_DOCUMENT_3.pdf');
            eventData.section17Document.document_url = uploadedDocUrl;
            eventData.section17Document.document_binary_url = uploadedDocUrl + '/binary';
        }

        const response = await  ccdApiHelper.saveDataToDataStore(eventName, null, eventData);
        caseId = response.id;
        console.log('caseId>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<');
    });

    test('Submit ' + (appellantInUK === 'Yes' ? 'Non-Detained, ' : 'Out of Country, ') + (isRehydrated ? 'Rehydrated, ' : 'Paper, ') + 'ICC DRAFT Appeal',   async ({  }) => {
        eventName = 'submitAppeal';

        await ccdApiHelper.startEvent(eventName, caseId);
        eventData = await commonData.generateSubmitData();

        // If Out of Time appeal, inject the Out of Time document
        if (!inTime) {
            uploadedDocUrl = await ccdApiHelper.uploadDocument();
            eventData.applicationOutOfTimeDocument.document_url = uploadedDocUrl;
            eventData.applicationOutOfTimeDocument.document_binary_url = uploadedDocUrl + '/binary';
        }

        caseData = {...caseData, ...eventData};
        const response = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(response.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);

        if (!isRehydrated) {
            ariaReferenceNumber = await response.case_data.appealReferenceNumber;
        }
    });

    // This is an additional step/test ONLY run if fee remission has been undertaken, as we need to make a decision on the fee remission
    if (feeRemission === 'Yes') {
        test('Submit: Record Remission Decision event', async ({page}) => {
            eventName = 'recordRemissionDecision';

            await ccdApiHelper.startEvent(eventName, caseId);
            eventData = await commonData.generateRecordRemissionDecisionData();

            // validate the data before submitting
            let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
            expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

            caseData = {...caseData, ...eventData};

            savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
            expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
        });
    }

    // Only mark as paid if payment is required
    if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
        test('Submit: Mark as Paid event', async ({}) => {
            eventName = 'markAppealPaid';

            await ccdApiHelper.startEvent(eventName, caseId);
            eventData = await commonData.generateMarkAsPaidData();

            // validate the data before submitting
            let response = await ccdApiHelper.validatePageData(eventName + 'remissionDecisionDetails', eventName, eventData);
            expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

            caseData = {...caseData, ...eventData};

            savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
            expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
        });
    }

    test('Submit: Request Respondent Evidence event', async ({}) => {
        eventName = 'requestRespondentEvidence';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateRequestRespondentEvidenceData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['uploadTheAppealFormDocs'];
        delete caseData['paymentStatus'];
        delete caseData['paAppealTypePaymentOption'];
        delete caseData['feeWithoutHearing'];
        delete caseData['remissionRejectedDatePlus14days'];
        delete caseData['remissionClaim'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Upload Home Office Bundle event', async ({}) => {
        eventName = 'uploadHomeOfficeBundle';

        await ccdApiHelper.getNonEventTokens(homeOfficeOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generateUploadedHomeOfficeBundleDocsData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.homeOfficeBundle[0].value.document.document_url = uploadedDocUrl;
        eventData.homeOfficeBundle[0].value.document.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(await response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['sendDirectionExplanation'];
        delete caseData['sendDirectionParties'];
        delete caseData['sendDirectionDateDue'];

        if (!isRehydrated) {
            delete caseData['uploadTheNoticeOfDecisionDocs'];
        }

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Request Case Building event', async ({}) => {
        eventName = 'requestCaseBuilding';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateRequestCaseBuildingData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['homeOfficeBundle'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Build Your Case event', async ({}) => {
        eventName = 'buildCase';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generateBuildYourCaseData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.caseArgumentDocument.document_url = uploadedDocUrl;
        eventData.caseArgumentDocument.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['sendDirectionExplanation'];
        delete caseData['sendDirectionParties'];
        delete caseData['sendDirectionDateDue'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Request Respondent Review event', async ({}) => {
        eventName = 'requestRespondentReview';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);
        eventData = await commonData.generateRespondentReviewData();

        let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Upload The Appeal Response event', async ({}) => {
        eventName = 'uploadHomeOfficeAppealResponse';

        await ccdApiHelper.getNonEventTokens(homeOfficeOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generateUploadTheAppealResponseData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.homeOfficeAppealResponseDocument.document_url = uploadedDocUrl;
        eventData.homeOfficeAppealResponseDocument.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData('uploadHomeOfficeAppealResponse' + eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['sendDirectionExplanation'];
        delete caseData['sendDirectionParties'];
        delete caseData['sendDirectionDateDue'];
        delete caseData['lastModifiedDirection'];
        delete caseData['SearchCriteria'];
        delete caseData['directions'];
        delete caseData['currentCaseStateVisibleToAdminOfficer'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Force Case - Hearing Reqs event', async ({}) => {
        eventName = 'forceCaseToSubmitHearingRequirements';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateForceCaseHearingsReqsData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName + 'forceCase', eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['homeOfficeAppealResponseDocument'];
        delete caseData['uploadedHomeOfficeAppealResponseDocs'];
        delete caseData['homeOfficeAppealResponseDescription'];
        delete caseData['homeOfficeAppealResponseEvidence'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Hearing Requirements event', async ({}) => {
        eventName = 'draftHearingRequirements';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateDraftHearingRequirementsData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['reasonToForceCaseToSubmitHearingRequirements'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Review Hearing Requirements event', async ({}) => {
        eventName = 'reviewHearingRequirements';

        await ccdApiHelper.getNonEventTokens(legalOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateReviewHearingRequirementsData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    // This is not the route the caseworker would use, however, we use it in the tests to get to the state of: Prepare for hearing
    // This state is only available when the hearing is listed - this event mimics the List Assist integration for us and thus allows us to complete the journey
    test('Submit: List The Case event', async ({}) => {
        eventName = 'listCase';

        await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateListTheCaseData();

        // Inject Aria ref number
        eventData.ariaListingReference = ariaReferenceNumber;

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['appellantLevelFlags'];
        delete caseData['witnessDetailsReadonly'];
        delete caseData['interpreterLanguageReadonly'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    // If rehydrated then turn notifications/WA tasks on so that we generate the hearing bundle
    // This can be changed later to not turn them on and go down the "Send to pre-hearing route"
    if (isRehydrated) {
        test('Submit: Turn on Notifications/WA Tasks event', async ({}) => {
            eventName = 'turnOnNotificationsWATasks';

            await ccdApiHelper.getNonEventTokens(legalOfficerAdminCredentials);
            await ccdApiHelper.startEvent(eventName, caseId);

            eventData = await legalAdminNonDetained.generateTurnOnNotificationsWaTasksData();

            // validate the data before submitting
            let response = await ccdApiHelper.validatePageData(eventName+eventName, eventName, eventData);
            expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

            delete caseData['hearingCentre'];
            delete caseData['caseManagementLocationRefData'];
            delete caseData['hearingCentreDynamicList'];


            caseData = {...caseData, ...eventData};

            savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
            expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
        });
    }

    test('Submit: Create Case Summary event', async ({}) => {
        eventName = 'createCaseSummary';

        await ccdApiHelper.getNonEventTokens(listingOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generateCreateCaseSummaryData();

        // we now inject info about document uploaded to document store into the eventData
        eventData.caseSummaryDocument.document_url = uploadedDocUrl;
        eventData.caseSummaryDocument.document_binary_url = uploadedDocUrl + '/binary';

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName+eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['haveHearingAttendeesAndDurationBeenRecorded'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });


    test('Submit: Generate Hearing Bundle event', async ({}) => {
        eventName = 'generateHearingBundle';

        await ccdApiHelper.getNonEventTokens(listingOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateHearingBundleData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName+eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['uploadAdditionalEvidenceActionAvailable'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Start Decision And Reasons event', async ({}) => {
        eventName = 'decisionAndReasonsStarted';

        // The hearing bundle can take some time to generate, so we need to check that the event "asyncStitchingComplete"
        // is available to the case and when it is we can progress
        let asyncStitchingComplete: boolean = false;
        const waitUtils: WaitUtils = new WaitUtils();
        const maxRetries: number = 10;

        for (let i=0; i < maxRetries; i++) {
            let availableEvents = await ccdApiHelper.getAvailableEvents(caseId);

            // Loop through the returned array and check if the event asyncStitchingComplete exists
            // if not then wait 5 secs before trying again
            for (const element in availableEvents) {
                if (availableEvents[element].id === 'asyncStitchingComplete') {
                    console.log('Hearing Bundle generation COMPLETED.');
                    asyncStitchingComplete = true;
                } else {
                    console.log(`Hearing Bundle generation NOT completed. Waiting to retry: ${i+1} of ${maxRetries}`);
                    asyncStitchingComplete = false;
                    await waitUtils.wait(5000);
                }
                break;
            }

            if (asyncStitchingComplete) {
                break;
            }
        }

        await ccdApiHelper.getNonEventTokens(listingOfficerCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generateStartDecisionAndReasonsData();
        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName+'scheduleOfIssues', eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['uploadAddendumEvidenceAdminOfficerActionAvailable'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    test('Submit: Prepare Decision And Reasons event', async ({}) => {
        eventName = 'generateDecisionAndReasons';

        await ccdApiHelper.getNonEventTokens(judgeCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        eventData = await commonData.generatePrepareDecisionAndReasonsData();

        // validate the data before submitting
        let response = await ccdApiHelper.validatePageData(eventName, eventName, eventData);
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['listCaseHearingCentreAddress'];
        delete caseData['agreedImmigrationHistoryDescription'];
        delete caseData['appellantsAgreedScheduleOfIssuesDescription'];
        delete caseData['changeDirectionDueDateActionAvailable'];
        delete caseData['isDecisionWithoutHearing'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });

    // // Gives a callback error - but no info in logs to say what the issue is - thus using the e2e step to complete this task
    // test.skip('Submit: Complete Decision And Reasons event', async ({}) => {
    //     eventName = 'sendDecisionAndReasons';
    //
    //     await ccdApiHelper.getNonEventTokens(judgeCredentials);
    //     await ccdApiHelper.startEvent(eventName, caseId);
    //
    //     uploadedDocUrl = await ccdApiHelper.uploadDocument();
    //     eventData = await commonDetained.generateCompleteDecisionAndReasonsData();
    //
    //     // we now inject info about document uploaded to document store into the eventData
    //     eventData.finalDecisionAndReasonsDocument.document_url = uploadedDocUrl;
    //     eventData.finalDecisionAndReasonsDocument.document_binary_url = uploadedDocUrl + '/binary';
    //
    //     // validate the data before submitting
    //     let response = await ccdApiHelper.validatePageData(eventName + eventName, eventName, eventData);
    //     expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);
    //
    //     caseData = {...caseData, ...eventData};
    //
    //     // console.log('caseData>>>> ',caseData);
    //
    //     savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
    //     expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    // });

    test('Submit: Complete decision and reasons event',   async ({ page }) => {
        const idamPage: IdamPage = new IdamPage(page);
        const linkHelper: LinkHelper = new LinkHelper(page);
        const pageHelper: PageHelper = new PageHelper(page);
        await page.goto(envUrl);
        await idamPage.login(judgeCredentials);
        await pageHelper.getCase(caseId, false);
        await new CompleteDecisionAndReasons(page).upload(judgeDecision);
        await linkHelper.signOut.click();
    });

    test(`Appeal the judge's decision as ` + (judgeDecision == 'allowed' ? 'Home Office' : 'Legal Admin as Appellant') , async ({}) => {
        eventName = (judgeDecision == 'allowed' ? 'applyForFTPARespondent' : 'applyForFTPAAppellant');
        let response;

        await ccdApiHelper.getNonEventTokens(judgeDecision == 'allowed' ? homeOfficeOfficerCredentials : legalOfficerAdminCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generatePermissionToAppealData();

        // we now inject info about document uploaded to document store into the eventData
        if (judgeDecision === 'allowed') {
            eventData.ftpaRespondentGroundsDocuments[0].value.document.document_url = uploadedDocUrl;
            eventData.ftpaRespondentGroundsDocuments[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        } else {
            eventData.ftpaAppellantGroundsDocuments[0].value.document.document_url = uploadedDocUrl;
            eventData.ftpaAppellantGroundsDocuments[0].value.document.document_binary_url = uploadedDocUrl + '/binary';
        }

        // validate the data before submitting
        if (judgeDecision === 'allowed') {
            response = await ccdApiHelper.validatePageData(eventName + 'ftpaRespondentSubmissionPage', eventName, eventData);
        } else {
            response = await ccdApiHelper.validatePageData(eventName + 'ftpaAppellantSubmissionPage', eventName, eventData);
        }
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['sendDirectionActionAvailable'];
        delete caseData['isAnyWitnessInterpreterRequired'];
        delete caseData['remoteVideoCallDescription'];
        delete caseData['physicalOrMentalHealthIssuesDescription'];
        delete caseData['multimediaEvidenceDescription'];
        delete caseData['singleSexCourtType'];
        delete caseData['singleSexCourtTypeDescription'];
        delete caseData['inCameraCourtDescription'];
        delete caseData['additionalRequestsDescription'];
        delete caseData['appellantRepresentative'];
        delete caseData['respondentRepresentative'];

        for (let i=1; i<=10; i++) {
            delete caseData[`witness${i}InterpreterLanguageCategory`];
        }

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });


    test('Judge decides FTPA application for ' + (judgeDecision == 'allowed' ? 'Home Office' : 'Legal Admin as Appellant') , async ({}) => {
        eventName = 'decideFtpaApplication';
        let response;

        await ccdApiHelper.getNonEventTokens(judgeCredentials);
        await ccdApiHelper.startEvent(eventName, caseId);

        uploadedDocUrl = await ccdApiHelper.uploadDocument();
        eventData = await commonData.generateDecideFtpaApplicationData();

        // we now inject info about document uploaded to document store into the eventData
        if (judgeDecision === 'allowed') {
            eventData.ftpaApplicationRespondentDocument.document_url = uploadedDocUrl;
            eventData.ftpaApplicationRespondentDocument.document_binary_url = uploadedDocUrl + '/binary';
        } else {
            eventData.ftpaApplicationAppellantDocument.document_url = uploadedDocUrl;
            eventData.ftpaApplicationAppellantDocument.document_binary_url = uploadedDocUrl + '/binary';
        }

        // validate the data before submitting
        if (judgeDecision === 'allowed') {
            response = await ccdApiHelper.validatePageData(eventName + 'ftpaRespondentDecisionReasonsNotes', eventName, eventData);
        } else {
            response = await ccdApiHelper.validatePageData(eventName + 'ftpaAppellantDecisionReasonsNotes', eventName, eventData);
        }
        expect(response.status(), `Validation failed for event: ${eventName}`).toEqual(200);

        delete caseData['ftpaRespondentGroundsDocuments'];
        delete caseData['ftpaAppellantGroundsDocuments'];

        caseData = {...caseData, ...eventData};

        savedDataResponse = await ccdApiHelper.saveDataToDataStore(eventName, caseId, caseData);
        expect(savedDataResponse.httpResponse, `Saving of case data to CCD failed for event: ${eventName}`).toEqual(201);
    });
});
