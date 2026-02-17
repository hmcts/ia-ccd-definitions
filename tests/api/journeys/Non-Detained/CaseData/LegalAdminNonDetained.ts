import moment from "moment";
import {appellant, legalRepresentative} from "../../../../iacConfig";
const yesterday = moment().subtract(1, 'days');
const isRehydrated: boolean = ['true'].includes(process.env.IS_REHYDRATED);
const outOfTime: string = !['false'].includes(process.env.IN_TIME) ? 'No' : 'Yes';
const typeOfAppeal: string = ['refusalOfEu', 'refusalOfHumanRights', 'deprivation', 'euSettlementScheme', 'revocationOfProtection', 'protection'].includes(process.env.APPEAL_TYPE) ? process.env.APPEAL_TYPE : 'deprivation';
const appellantInUK: string = ['Yes', 'No'].includes(process.env.IN_UK) ? process.env.IN_UK : 'Yes';
const feeRemission: string = ['Yes'].includes(process.env.FEE_REMISSION) ? 'Yes' : 'No';
const aip: string = ['Yes'].includes(process.env.AIP) ? 'Yes' : 'No';
export class LegalAdminNonDetained {


  async generateDraftData() {
    const data = {
        isAdmin: "Yes",
        sourceOfAppeal: isRehydrated ? 'rehydratedAppeal' : 'paperForm',
        ...isRehydrated ? {appealReferenceNumber: "INJECTED_VALUE"} : {},
        tribunalReceivedDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0'),
        ...isRehydrated ? {submissionOutOfTime: outOfTime} : {},
        appellantsRepresentation: aip,  //No = LR, Yes = AIP
        ...aip === "No" ? {
                appealWasNotSubmittedReason: "test appeal not submitted reason text",
                appealNotSubmittedReasonDocuments: [],
                legalRepCompanyPaperJ: legalRepresentative.company,
                legalRepGivenName: legalRepresentative.name,
                legalRepFamilyNamePaperJ: legalRepresentative.familyName,
                legalRepEmail: legalRepresentative.email,
                legalRepRefNumberPaperJ: legalRepresentative.reference
            } : {},
        letterSentOrReceived: appellantInUK === 'Yes' ? "Sent" : "Received",
        ...aip === "No" ? {
                legalRepHasAddress: "Yes",
                legalRepAddressUK: {
                    AddressLine1: legalRepresentative.address.addressLine1,
                    AddressLine2: null,
                    AddressLine3: null,
                    PostTown: legalRepresentative.address.postTown,
                    County: null,
                    PostCode: legalRepresentative.address.postcode,
                    Country: legalRepresentative.address.country
                }
            } : {},
        appellantInUk: appellantInUK,
        ...appellantInUK !== 'Yes' ? {oocAppealAdminJ: "entryClearanceDecision"} : {},
        ...appellantInUK !== 'Yes' ? {gwfReferenceNumber: "123456"} : {},
        ...appellantInUK === 'Yes' ? {appellantInDetention: "No"} : {},
        ...appellantInUK === 'Yes' ? {homeOfficeReferenceNumber: "000012345"} : {},
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
        ...appellantInUK==='Yes' ? {appellantHasFixedAddress: "Yes"} : {appellantHasFixedAddressAdminJ: "Yes"},
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
                                            addressLine1AdminJ: appellant.outsideUKAddress.addressLine1,
                                            addressLine2AdminJ: appellant.outsideUKAddress.addressLine2,
                                            addressLine3AdminJ: appellant.outsideUKAddress.addressLine3,
                                            addressLine4AdminJ: appellant.outsideUKAddress.addressLine4,
                                            countryGovUkOocAdminJ: appellant.outsideUKAddress.country.slice(0, -1)
                                        },
        internalAppellantMobileNumber: appellant.mobile,
        internalAppellantEmail: appellant.email,
        appealType: typeOfAppeal,
        ...appellantInUK === 'Yes' ? {homeOfficeDecisionDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0')} : {},
        ...appellantInUK !== 'Yes' ? {dateEntryClearanceDecision: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0')} : {},
        uploadRehydratedNod: [],
        hasSponsor: "No",
        ...appellantInUK === 'Yes' ? {deportationOrderOptions: "No"} : {},
        hasOtherAppeals: "No",
        hearingTypeResult: "No",
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
        ...appellantInUK === 'Yes' ? {uploadTheNoticeOfDecisionDocs: [
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
                                    ]}
        : {},
        uploadTheAppealFormDocs: [
          {
            value: {
              description: "appeal form upload description",
              document: {
                document_url: "INJECTED_VALUE",
                document_binary_url: "INJECTED_VALUE",
                document_filename: "TEST DOCUMENT 2.pdf"
              }
            },
            id: null
          }
        ]
    }

    return data;
  }

  async generateSubmitData() {
      const data = {
          adminDeclaration1: ["hasDeclared"],
          isAdmin: "Yes",
          remissionClaim: null,
          remissionOption: null,
          paAppealTypePaymentOption: null,
          helpWithFeesOption: null,
          appealType: typeOfAppeal,
          feeAmountGbp: "14000",
          appellantInDetention: "No",
          isNotificationTurnedOff: "Yes"
      }
      return data;
  }
}
