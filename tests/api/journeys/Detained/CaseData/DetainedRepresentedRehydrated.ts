import moment from "moment";
import {appellant, legalRepresentative} from "../../../../e2e/iacConfig";
import {detentionFacility} from "../../../../fixtures/detentionFacilities";
const yesterday = moment().subtract(1, 'days');
const homeOfficeDecisionDate = moment().subtract(5, 'days');
const outOfTime: string = !['false'].includes(process.env.IN_TIME) ? 'No' : 'Yes';
const detentionLocation: string = ['immigrationRemovalCentre', 'prison', 'other'].includes(process.env.DETENTION_LOCATION) ? process.env.DETENTION_LOCATION : 'prison';
const detentionBuilding : string = detentionLocation === 'prison' ? detentionFacility.prison.building : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.building : detentionFacility.other.building);
const detentionAddressLines: string = detentionLocation === 'prison' ? detentionFacility.prison.address : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.address : detentionFacility.other.address);
const detentionPostcode : string = detentionLocation === 'prison' ? detentionFacility.prison.postcode : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.postcode : detentionFacility.other.postcode);
const detentionNamekey: string = (detentionLocation === 'prison' ? 'prison' : (detentionLocation === 'immigrationRemovalCentre' ? 'irc' : 'otherDetentionFacility')) + 'Name';
const detentionName : string = detentionLocation === 'prison' ? detentionFacility.prison.shortName : (detentionLocation === 'immigrationRemovalCentre' ? detentionFacility.immigrationRemovalCentre.shortName : detentionFacility.other.name);
let data;
let detentionNameData;

export class DetainedRepresentedRehydrated {


  async generateDraftData() {
    data = {
          isAdmin: "Yes",
          sourceOfAppeal: "rehydratedAppeal",
          appealReferenceNumber: "INJECTED_VALUE",
          tribunalReceivedDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString().padStart(2,'0')),
          submissionOutOfTime: outOfTime,
          appellantsRepresentation: "No",
          appealWasNotSubmittedReason: "test appeal not submitted reason text",
          appealNotSubmittedReasonDocuments: [],
          legalRepCompanyPaperJ: legalRepresentative.company,
          legalRepGivenName: legalRepresentative.name,
          legalRepFamilyNamePaperJ: legalRepresentative.familyName,
          legalRepEmail: legalRepresentative.email,
          legalRepRefNumberPaperJ: legalRepresentative.reference,
          letterSentOrReceived: "Sent",
          legalRepHasAddress: "Yes",
          appellantInUk: "Yes",
          legalRepAddressUK: {
            AddressLine1: legalRepresentative.address.addressLine1,
            AddressLine2: null,
            AddressLine3: null,
            PostTown: legalRepresentative.address.postTown,
            County: null,
            PostCode: legalRepresentative.address.postcode,
            Country: legalRepresentative.address.country
          },
          appellantInDetention: "Yes",
          detentionBuilding: detentionBuilding,
          detentionFacility: detentionLocation,
          detentionAddressLines: detentionAddressLines,
          detentionPostcode: detentionPostcode,
         // [detentionNamekey]: detentionName,
          releaseDateProvided: "No",
          hasPendingBailApplications: "No",
          homeOfficeReferenceNumber: "000012345",
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
          internalAppellantMobileNumber: appellant.mobile,
          internalAppellantEmail: appellant.email,
          appealType: "euSettlementScheme",
          homeOfficeDecisionDate: homeOfficeDecisionDate.year().toString() + '-' + (homeOfficeDecisionDate.month() + 1).toString().padStart(2, '0') + '-' + homeOfficeDecisionDate.date().toString().padStart(2, '0'),
          uploadRehydratedNod: [],
          hasSponsor: "No",
          deportationOrderOptions: "No",
          removalOrderOptions: "No",
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
        };

    if (detentionLocation === 'prison') {
        const nomsData = {
            prisonNOMSNumber:
                {
                    prison: appellant.NOMSNumber
                }
        }

        //merge additional data into case data
        data = { ...data, ...nomsData };
    }

    if (detentionLocation === 'other'){
        detentionNameData = {
            [detentionNamekey]: {
                other: detentionName
            }
        }
    } else {
        detentionNameData = {
            [detentionNamekey]: detentionName
        }
        //merge additional data into case data
        data = { ...data, ...detentionNameData };
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
          appellantInDetention: "Yes",
          isNotificationTurnedOff: "Yes"
      };
      return data;
  }

}
