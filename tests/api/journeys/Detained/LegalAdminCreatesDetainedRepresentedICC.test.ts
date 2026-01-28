import {expect, test} from '@playwright/test';
import {
    envUrl, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials, legalOfficerCredentials, listingOfficerCredentials, runningEnv,
} from '../../../e2e/iacConfig';
import {TokensHelper} from "../../../e2e/helpers/TokensHelper";
import {ariaReferenceNumber} from "../../../e2e/fixtures/ariaReferenceNumber";
import {CcdApiHelper} from "../../../e2e/helpers/CcdApiHelper";

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
        const ariaRefNumberExistsMessage: string = 'The reference number already exists. Please enter a different reference number.';
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
            const response: string =  (await ccdApiHelper.validatePageData(`${event}appealReferenceNumber`, caseData, uid, accessToken, s2sToken))[0];

            if ( response === 'SUCCESS') {
                console.log(`Aria reference number: ${ariaRefNumber} is valid and not assigned to an existing appeal.`);
                //return ariaRefNumber;
                break;
            }

            if (response === ariaRefNumberExistsMessage) {
                continue;
            } else {
                throw new Error(`An unknown error was returned when validating the Aria Reference number using the CCD API: ${response}`);
            }
        }

    });

    test('Create detained' + (isRehydrated ? 'Rehydrated ' : 'Paper ') + 'ICC Appeal',   async ({ page }) => {
        // Create a Rehydrated, LR-manual, detained DRAFT case
        const caseData = {
        data:{"isAdmin":"Yes","sourceOfAppeal":"rehydratedAppeal","appealReferenceNumber":ariaRefNumber,"tribunalReceivedDate":"2026-01-30","submissionOutOfTime":"No","appellantsRepresentation":"No","appealWasNotSubmittedReason":"test","appealNotSubmittedReasonDocuments":[],"legalRepCompanyPaperJ":"fsdsfd","legalRepGivenName":"sfdfds","legalRepFamilyNamePaperJ":"fdsfd","legalRepEmail":"def1lit@hnl.com","legalRepRefNumberPaperJ":null,"letterSentOrReceived":"Sent","legalRepHasAddress":"Yes","legalRepAddressUK":{"AddressLine1":"66 Pall Mall","AddressLine2":"","AddressLine3":"","PostTown":"London","County":"","PostCode":"SW1A 1AB","Country":"United Kingdom"},"appellantInUk":"Yes","appellantInDetention":"Yes","detentionFacility":"prison","detentionBuilding":"HMP Addiewell","detentionAddressLines":"9 Station Road, Addiewell, West Lothian","prisonNOMSNumber":{"prison":"12345"},"detentionPostcode":"EH55 8QA","prisonName":"Addiewell","releaseDateProvided":"No","hasPendingBailApplications":"No","homeOfficeReferenceNumber":"233","appellantGivenNames":"ffg","appellantFamilyName":"gffggf","appellantDateOfBirth":"2000-01-01","appellantStateless":"hasNationality","appellantNationalities":[{"value":{"code":"AL"},"id":"d67fb56c-7be1-4002-a130-189389e573b1"}],"internalAppellantMobileNumber":null,"internalAppellantEmail":null,"appealType":"euSettlementScheme","homeOfficeDecisionDate":"2026-01-27","uploadRehydratedNod":[],"hasSponsor":"No","deportationOrderOptions":"No","removalOrderOptions":"No","hasOtherAppeals":"No","hearingTypeResult":"No","decisionHearingFeeOption":"decisionWithHearing","remissionType":"noRemission","feeWithHearing":null,"feeWithoutHearing":null},
            event:{"id":event,"summary":"","description":""},
            event_token:eventToken,
            ignore_warning:false,
            draft_id:null
        };

        const response = await  ccdApiHelper.createDraftAppeal(event,caseData,uid,accessToken,s2sToken);
        console.log('caseId>>>>>>>>>>>>>>' + response.id + '<<<<<<<<<<<<<<');

        // const caseData = {
        //     data: {
        //         appealReferenceNumber: ariaRefNumber,
        //     },
        //     event: {
        //         id: `${event}`,
        //         summary: '',
        //         description: '',
        //     },
        //     event_token: `${eventToken}`,
        //     ignore_warning: 'false'
        // };
    });


 });
