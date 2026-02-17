import moment from "moment";
import {appellant, legalRepresentative} from "../../../../iacConfig";
import {detentionFacility} from "../../../../fixtures/detentionFacilities";

const yesterday = moment().subtract(1, 'days');
const homeOfficeDecisionDate = moment().subtract(5, 'days');
const outOfTime: string = !['false'].includes(process.env.IN_TIME) ? 'No' : 'Yes';
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const aip: string = ['Yes'].includes(process.env.AIP) ? 'Yes' : 'No';
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'prison';
const detentionBuilding : string = detentionLocation === 'prison' ? detentionFacility.prison.building : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.building : detentionFacility.other.building);
const detentionAddressLines: string = detentionLocation === 'prison' ? detentionFacility.prison.address : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.address : detentionFacility.other.address);
const detentionPostcode : string = detentionLocation === 'prison' ? detentionFacility.prison.postcode : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.postcode : detentionFacility.other.postcode);
const detentionNamekey: string = (detentionLocation === 'prison' ? 'prison' : (detentionLocation === 'immigrationRemovalCentre' ? 'irc' : 'otherDetentionFacility')) + 'Name';
const detentionName : string = detentionLocation === 'prison' ? detentionFacility.prison.shortName : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.shortName : detentionFacility.other.name);
const typeOfAppeal: string = ['refusalOfEu', 'refusalOfHumanRights', 'deprivation', 'euSettlementScheme', 'revocationOfProtection', 'protection'].includes(process.env.APPEAL_TYPE) ? process.env.APPEAL_TYPE : 'deprivation';

let data;

export class LegalRepDetained {


  async generateDraftData() {
    data = {
        appellantInUk: "Yes",
        appellantInDetention: "Yes",
        detentionFacility: detentionLocation,
        detentionBuilding: detentionBuilding,
        ...detentionLocation === 'prison' ? {prisonNOMSNumber: {prison: appellant.NOMSNumber}} : {},
        detentionAddressLines: detentionAddressLines,
        detentionPostcode: detentionPostcode,
        ...detentionLocation === 'prison' ? {prisonName: detentionName} : detentionLocation === 'immigrationRemovalCentre' ? { [detentionNamekey]: detentionName} : {  [detentionNamekey]: {other: detentionName}},
        releaseDateProvided: "No",
        hasPendingBailApplications: "No",
        homeOfficeReferenceNumber: "000012345",
        appellantTitle: appellant.title,
        appellantGivenNames: appellant.givenNames,
        appellantFamilyName: appellant.familyName,
        appellantDateOfBirth: appellant.dob.year.toString() + '-' + appellant.dob.month.toString().padStart(2, '0') + '-' + appellant.dob.day.toString().padStart(2, '0'),
        appellantStateless: "hasNationality",
        appellantNationalities: [
            {
                value:
                    {code: "FI"},
                id: "4a33b3d4-291c-4efe-a8ed-4b3535167b39"
            }
        ],
        appealType: typeOfAppeal,
        homeOfficeDecisionDate: homeOfficeDecisionDate.year().toString() + '-' + (homeOfficeDecisionDate.month() + 1).toString().padStart(2, '0') + '-' + homeOfficeDecisionDate.date().toString().padStart(2, '0'),
        uploadTheNoticeOfDecisionDocs: [
            {
                value: {
                    description: "Notice of decision document upload description",
                    document: {
                        document_url: "INJECTED_VALUE",
                        document_binary_url: "INJECTED_VALUE",
                        document_filename: "TEST DOCUMENT 2.pdf"
                    }
                },
                id: null
            }
        ],
        hasSponsor: "No",
        deportationOrderOptions: "No",
        removalOrderOptions: "No",
        hasNewMatters: "No",
        hasOtherAppeals: "No",
        hearingTypeResult: "No",
        legalRepCompany: legalRepresentative.company,
        legalRepName: legalRepresentative.name,
        legalRepFamilyName: legalRepresentative.familyName,
        legalRepMobilePhoneNumber: legalRepresentative.mobile,
        legalRepReferenceNumber: legalRepresentative.reference,
        isFeePaymentEnabled: "Yes",
        isRemissionsEnabled: "Yes",
        decisionHearingFeeOption: "decisionWithHearing",
        ...feeRemission === 'Yes' ? {remissionType: "hoWaiverRemission"} : {remissionType: "noRemission"},
        feeWithHearing: null,
        feeWithoutHearing: null,
        ...feeRemission === 'Yes' ? {remissionClaim: "section17"} : {},
        ...feeRemission === 'Yes' ? {section17Document: {
                    document_url: "INJECTED VALUE",
                    document_binary_url: "INJECTED_VALUE",
                    document_filename: "TEST DOCUMENT 3.pdf"
                }}
            : {},
    };

    return data;
  }

  async generateSubmitData() {
      const data = {
          isAdmin: "No",
          legalRepDeclaration: ["hasDeclared"],
          remissionClaim: null,
          remissionOption: null,
          paAppealTypePaymentOption: null,
          helpWithFeesOption: null,
          appealType: typeOfAppeal,
          feeAmountGbp: "14000",
          appellantInDetention: "Yes",
          isNotificationTurnedOff: "Yes"
      };
      return data;
  }

}
