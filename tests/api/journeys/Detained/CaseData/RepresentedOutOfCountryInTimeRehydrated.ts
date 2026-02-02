import moment from "moment";
import {appellant, legalRepresentative} from "../../../../e2e/iacConfig";
const yesterday = moment().subtract(1, 'days');
const homeOfficeDecisionDate = moment().subtract(5, 'days');

export class RepresentedOutOfCountryInTimeRehydrated {


  async generateDraftData() {
    const data = {
        isAdmin: "Yes",
        sourceOfAppeal: "rehydratedAppeal",
        appealReferenceNumber: "INJECTED_VALUE",
        tribunalReceivedDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString()).padStart(2,'0'),
        submissionOutOfTime: "No",
        appellantsRepresentation: "No",
        appealWasNotSubmittedReason: "test appeal not submitted reason text",
        appealNotSubmittedReasonDocuments: [],
        legalRepCompanyPaperJ: legalRepresentative.company,
        legalRepGivenName: legalRepresentative.name,
        legalRepFamilyNamePaperJ: legalRepresentative.familyName,
        legalRepEmail: legalRepresentative.email,
        legalRepRefNumberPaperJ: legalRepresentative.reference,
        letterSentOrReceived: "Received",
        legalRepHasAddress: "Yes",
        legalRepAddressUK: {
          AddressLine1: legalRepresentative.address.addressLine1,
          AddressLine2: null,
          AddressLine3: null,
          PostTown: legalRepresentative.address.postTown,
          County: null,
          PostCode: legalRepresentative.address.postcode,
          Country: legalRepresentative.address.country
        },
        appellantInUk: "No",
        oocAppealAdminJ: "entryClearanceDecision",
        gwfReferenceNumber: "123456",
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
        appellantHasFixedAddressAdminJ: "Yes",
        addressLine1AdminJ: appellant.outsideUKAddress.addressLine1,
        addressLine2AdminJ: appellant.outsideUKAddress.addressLine2,
        addressLine3AdminJ: appellant.outsideUKAddress.addressLine3,
        addressLine4AdminJ: appellant.outsideUKAddress.addressLine4,
        countryGovUkOocAdminJ: appellant.outsideUKAddress.country.slice(0, -1),
        internalAppellantMobileNumber: appellant.mobile,
        internalAppellantEmail: appellant.email,
        appealType: "euSettlementScheme",
        dateEntryClearanceDecision: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + yesterday.date().toString(),
        uploadRehydratedNod: [],
        hasSponsor: "No",
        hasOtherAppeals: "No",
        hearingTypeResult: "No",
        decisionHearingFeeOption: "decisionWithHearing",
        remissionType: "noRemission",
        feeWithHearing: null,
        feeWithoutHearing: null,
        uploadTheAppealFormDocs: [
          {
            value: {
              description: "appeal form upload description",
              document: {
                document_url: "INJECTED_VALUE",
                document_binary_url: "INJECTED_VALUE",
                document_filename: "TEST DOCUMENT 1.pdf"
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
          remissionType: "noRemission",
          remissionOption: null,
          paAppealTypePaymentOption: null,
          helpWithFeesOption: null,
          appealType: "euSettlementScheme",
          feeAmountGbp: "14000",
          appellantInDetention: "No",
          isNotificationTurnedOff: "Yes"
      }
      return data;
  }
}
