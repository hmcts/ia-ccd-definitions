import moment from "moment";
import {appellant, legalRepresentative} from "../../../../e2e/iacConfig";
import {detentionFacility} from "../../../../fixtures/detentionFacilities";

const yesterday = moment().subtract(1, 'days');
const todayPlusSevenDays = moment().add(7, 'days');
const homeOfficeDecisionDate = moment().subtract(5, 'days');
const requestCaseBuildingComplyDate = moment().add(42, 'days');
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

export class LegalAdminDetained {


  async generateDraftData() {
    data = {
          isAdmin: "Yes",
          sourceOfAppeal: isRehydrated ? 'rehydratedAppeal' : 'paperForm',
          ...isRehydrated ? {appealReferenceNumber: "INJECTED_VALUE"} : {},
          tribunalReceivedDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString().padStart(2,'0')),
          ...isRehydrated ? {submissionOutOfTime: outOfTime} : {},
          appellantsRepresentation: aip,   //No = LR, Yes = AIP
          ...aip === "No" ? {
              appealWasNotSubmittedReason: "test appeal not submitted reason text",
              appealNotSubmittedReasonDocuments: [],
              legalRepCompanyPaperJ: legalRepresentative.company,
              legalRepGivenName: legalRepresentative.name,
              legalRepFamilyNamePaperJ: legalRepresentative.familyName,
              legalRepEmail: legalRepresentative.email,
              legalRepRefNumberPaperJ: legalRepresentative.reference,
              letterSentOrReceived: "Sent",
              legalRepHasAddress: "Yes"
              }
              : {},
          appellantInUk: "Yes",
          ...aip === "No" ? {
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
          appellantInDetention: "Yes",
          detentionBuilding: detentionBuilding,
          detentionFacility: detentionLocation,
          ...detentionLocation === 'prison' ? {prisonNOMSNumber: {prison: appellant.NOMSNumber}} : {},
          detentionAddressLines: detentionAddressLines,
          detentionPostcode: detentionPostcode,
          ...detentionLocation === 'prison' ? {prisonName: detentionName} : detentionLocation === 'immigrationRemovalCentre' ? { [detentionNamekey]: detentionName} : {  [detentionNamekey]: {other: detentionName}},
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
          appealType: typeOfAppeal,
          homeOfficeDecisionDate: homeOfficeDecisionDate.year().toString() + '-' + (homeOfficeDecisionDate.month() + 1).toString().padStart(2, '0') + '-' + homeOfficeDecisionDate.date().toString().padStart(2, '0'),
          ...isRehydrated ? {uploadRehydratedNod: []} : {},
          hasSponsor: "No",
          deportationOrderOptions: "No",
          removalOrderOptions: "No",
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
          ...!isRehydrated ? {uploadTheNoticeOfDecisionDocs: [
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
            ]}
          : {},
          uploadTheAppealFormDocs: [
            {
                value: {
                    description: "Appeal form document upload description",
                    document: {
                        document_url: "INJECTED_VALUE",
                        document_binary_url: "INJECTED_VALUE",
                        document_filename: "TEST DOCUMENT 1.pdf"
                    }
                },
                id: null
            }
          ],
    };

    return data;
  }

  async generateSubmitData() {
      data = {
          adminDeclaration1: ["hasDeclared"],
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

  generateMarkAsPaidData(){
      data = {
          paidAmount:"14000",
          paidDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString().padStart(2,'0')),
          additionalPaymentInfo: "Mark appeal as paid test text",
      }

      return data;
  }

  generateRequestRespondentEvidenceData() {
      data = {
          sendDirectionExplanation: "A notice of appeal has been lodged against this decision.\n\nYou must now upload all documents to the Tribunal. The Tribunal will make them accessible to the other party. You have until the date indicated below to supply your bundle.\n\nThe bundle must comply with (i) Rule 24 of the Tribunal Procedure Rules 2014 and (ii) Practice Direction, Part 3, sections 7.1 - 7.4.\nSpecifically, the bundle must contain:\n\n- The explanation for refusal;\n- the deportation order and/or the notice of decision to make the order (if any);\n- Interview record (if any);\n- Appellant's representations (if any);\n- a copy of any relevant indictment; pre-sentence report and/or OASys/ARNS reports (if any);\n- a copy of the Appellant's criminal record (if any);\n- a copy of the certificate of conviction (if any);\n- a transcript of the Sentencing Judge's Remarks (if any).\n- a copy of any Parole Report or other document relating to the appellant's period in custody and/or release (if any);\n- a copy of any medical report (if any).\n\nParties must ensure they conduct proceedings with procedural rigour.\nThe Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the possible sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction.",
          sendDirectionParties: "respondent",
          sendDirectionDateDue: todayPlusSevenDays.year().toString() + '-' + (todayPlusSevenDays.month() + 1).toString().padStart(2,'0') + '-' + (todayPlusSevenDays.date().toString().padStart(2,'0'))
      }

      return data;
  }

  generateUploadedHomeOfficeBundleDocsData() {
      data = {
          uploadedHomeOfficeBundleDocs: "- None",
          homeOfficeBundle: [
                  {
                      value: {
                          description: "Home Office bundle upload description",
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

  generateRequestCaseBuildingData() {
      data = {
          sendDirectionExplanation: "You must now build your case to enable the respondent to conduct a thorough review of the appeal.\n\nBy the date indicated below the Appellant is directed to:\n\n1. Upload an Appeal Skeleton Argument (“ASA”). The form and content of this ASA must comply with the terms of Practice Direction, Part 3.\n\n   Specifically, the ASA must\n\n   - be no more than 12 pages of numbered paragraphs.\n\n   - be set out in three distinct parts, to include:\n      i) a concise summary of the appellant’s case;\n      ii) a schedule of the disputed issues;\n      iii) the appellant’s brief submissions on each of those issues, which explain why the issues should be resolved in the appellant’s favour.\n\n   - include the name of the author of the ASA and the date on which it was prepared.\n\n2. The Appellant must, by the same date, upload an indexed and paginated bundle of all evidence which must comply with the Practice Direction. This includes:\n\n   - Witness statements\n\n   - Evidence relevant to the issues set out within the ASA\n\n   - Expert evidence or country information evidence\n\nParties must ensure they conduct proceedings with procedural rigour.\n\nThe Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the possible sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction.",
          sendDirectionParties: "appellant",
          sendDirectionDateDue: requestCaseBuildingComplyDate.year().toString() + '-' + (requestCaseBuildingComplyDate.month() + 1).toString().padStart(2,'0') + '-' + (requestCaseBuildingComplyDate.date().toString().padStart(2,'0'))
      }

      return data;
  }

}
