import moment from "moment";
import {appellant, legalRepresentative} from "../../../../e2e/iacConfig";
const yesterday = moment().subtract(1, 'days');
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const outOfTime: string = !['false'].includes(process.env.IN_TIME) ? 'No' : 'Yes';
const typeOfAppeal: string = ['refusalOfEu', 'refusalOfHumanRights', 'deprivation', 'euSettlementScheme', 'revocationOfProtection', 'protection'].includes(process.env.APPEAL_TYPE) ? process.env.APPEAL_TYPE : 'deprivation';
const appellantInUK: string = ['Yes', 'No'].includes(process.env.IN_UK) ? process.env.IN_UK : 'Yes';
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const aip: string = ['Yes'].includes(process.env.AIP) ? 'Yes' : 'No';


export class LegalRepNonDetained {

  async generateDraftData() {
    const data = {
        appellantInUk: appellantInUK,
        ...appellantInUK !== 'Yes' ? {outOfCountryDecisionType: "refusalOfHumanRights"} : {},
        ...appellantInUK !== 'Yes' ? {gwfReferenceNumber: "123456"} : {},
        ...appellantInUK === 'Yes' ? {appellantInDetention: "No"} : {},
        ...appellantInUK === 'Yes' ? {homeOfficeReferenceNumber: "000012345"} : {},
        appellantTitle: appellant.title,
        appellantGivenNames: appellant.givenNames,
        appellantFamilyName: appellant.familyName,
        appellantDateOfBirth: appellant.dob.year.toString() + '-' + appellant.dob.month.toString().padStart(2, '0') + '-' + appellant.dob.day.toString().padStart(2, '0'),
        appellantStateless: "hasNationality",
        appellantNationalities: [
            {
                value:
                    {code: "FI"},
                id: "210b53f9-6c8a-4b48-a184-195b78d06ad4"
            }
        ],
        ...appellantInUK==='Yes' ? {appellantHasFixedAddress: "Yes"} : {hasCorrespondenceAddress: "Yes"},
        contactPreference: "wantsEmail",
        email: "appEmail@test.com",
        ...appellantInUK==='Yes' ? { appellantAddress: {
                AddressLine1: appellant.address.addressLine1,
                AddressLine2: "",
                AddressLine3: "",
                PostTown: appellant.address.postTown,
                County: "",
                PostCode: appellant.address.postcode,
                Country: appellant.address.country
            }
        } : {
            appellantOutOfCountryAddress: 'Appellant Out of Country Address'
        },
        appealType: typeOfAppeal,
        ...appellantInUK !== 'Yes' ? {dateEntryClearanceDecision: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0')} : {},
        hasSponsor: "No",
        deportationOrderOptions: "No",
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
        ...appellantInUK === 'Yes' ? {homeOfficeDecisionDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0')} : {},
        uploadTheNoticeOfDecisionDocs: [
                    {
                        value: {
                            description: "notice of decision upload description",
                            document: {
                                document_url: "INJECTED_VALUE",
                                document_binary_url: "INJECTED_VALUE",
                                document_filename: "TEST DOCUMENT 1.pdf"
                            }
                        },
                        id: null
                    }
                ],
    }

    return data;
  }

  async generateSubmitData() {
      const data = {
          isAdmin: "No",
          legalRepDeclaration: [
              "hasDeclared"
          ],
          remissionClaim: null,
          remissionOption: null,
          paAppealTypePaymentOption: null,
          helpWithFeesOption: null,
          feeAmountGbp: "14000",
          isNotificationTurnedOff: null
      }
      return data;
  }
}
