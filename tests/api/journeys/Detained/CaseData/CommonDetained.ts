import moment from "moment";
import {appellant, legalRepresentative} from "../../../../iacConfig";
import {detentionFacility} from "../../../../fixtures/detentionFacilities";

const yesterday = moment().subtract(1, 'days');
const todayPlusSevenDays = moment().add(7, 'days');
const homeOfficeDecisionDate = !['false'].includes(process.env.IN_TIME) ? moment().subtract(5, 'days') : moment().subtract(1, 'years');
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
const judgeDecision: string = ['allowed'].includes(process.env.JUDGE_DECISION) ? 'allowed' : 'dismissed'; // allowed or dismissed

let data;

export class CommonDetained {

  async generateSubmitData() {
      data = {
          ...outOfTime === 'Yes' ? {
              applicationOutOfTimeExplanation: "Out Of Time description test text",
              applicationOutOfTimeDocument: {
                  document_url: "INJECTED_VALUE",
                  document_binary_url: "INJECTED_VALUE",
                  document_filename: "TEST DOCUMENT 5.pdf"
              }
          } : {},
          adminDeclaration1: ["hasDeclared"],
          ...feeRemission === 'Yes' ? {remissionType: "hoWaiverRemission"} : {remissionType: "noRemission"},
          ...feeRemission === 'Yes' ? {remissionClaim: "section17"} : {remissionClaim: null},
          helpWithFeesOption: null,
          remissionOption: null,
          paAppealTypePaymentOption: null,
          feeAmountGbp: "14000",
          ...isRehydrated ? {isNotificationTurnedOff: "Yes"} : {isNotificationTurnedOff: null}
      };
      return data;
  }

  generateRecordRemissionDecisionData() {
      data = {
          amountRemitted: "10000",
          amountLeftToPay: "4000",
          remissionDecisionReason: "Partial Remission reason text",
          remissionDecision: "partiallyApproved",
          decisionHearingFeeOption: "decisionWithHearing",
          feeWithHearing: "140",
          feeWithoutHearing: null,
          paymentStatus: "Payment pending",
          remissionRejectedDatePlus14days: null
      }

      return data;
  }

  generateMarkAsPaidData(){
      data = {
          paidAmount:"4000",
          paidDate: yesterday.year().toString() + '-' + (yesterday.month() + 1).toString().padStart(2,'0') + '-' + (yesterday.date().toString().padStart(2,'0')),
          additionalPaymentInfo: "Mark appeal as paid test text"
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
          ...aip ? {sendDirectionExplanation: "You must now build your case to enable the respondent to conduct a thorough review of the appeal.\n\nBy the date indicated below the Appellant is directed to:\n\n1. Upload an Appeal Skeleton Argument (“ASA”). The form and content of this ASA must comply with the terms of Practice Direction, Part 3.\n\n   Specifically, the ASA must\n\n   - be no more than 12 pages of numbered paragraphs.\n\n   - be set out in three distinct parts, to include:\n      i) a concise summary of the appellant’s case;\n      ii) a schedule of the disputed issues;\n      iii) the appellant’s brief submissions on each of those issues, which explain why the issues should be resolved in the appellant’s favour.\n\n   - include the name of the author of the ASA and the date on which it was prepared.\n\n2. The Appellant must, by the same date, upload an indexed and paginated bundle of all evidence which must comply with the Practice Direction. This includes:\n\n   - Witness statements\n\n   - Evidence relevant to the issues set out within the ASA\n\n   - Expert evidence or country information evidence\n\nParties must ensure they conduct proceedings with procedural rigour.\n\nThe Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the possible sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction."} :
              {sendDirectionExplanation: "The Home Office has uploaded their bundle of evidence.\n\nYou must now submit an explanation of your case, also referred to as the Appellant’s Explanation of Case (AEC), and a bundle of evidence.\n\nThe AEC should include the following:\n\n  1. A short summary of your case including important dates.\n  2. A list of things in the Home Office refusal letter that you do not agree with and why you do not agree with them.\n\nYour bundle of evidence should include:\n\n  1. An index – setting out each document and its page number.\n  2. A witness statement by you, the appellant.\n  3. A witness statement by any other person who is going to be a witness at the hearing of the appeal.\n\n  - Everybody who is going to be a witness at the hearing needs a witness statement.\n  - A witness statement is a document containing everything relevant the witness can tell the Tribunal.\n  - Witnesses will not be allowed to add to their statements unless the Tribunal agrees.\n  - Witness statements should be typed if possible.\n  - They must be in English.\n  - They must have paragraph numbers and page numbers.\n  - They must set out events, usually in the order they happened.\n  - All witness statements must be signed and dated.\n  - At the hearing, the Tribunal will read the witness statements. Witnesses may be asked questions about their statements by the other side and the Tribunal.\n\n  4. Any evidence or documents you wish to rely on in support of your appeal. This may include official documents, relationship evidence, criminal evidence, financial documents, medical evidence and/or country evidence. This is not an exhaustive list; your evidence will depend on the nature of your individual case.\n  5. If any documents are not in English, they must be translated into English by a translator. This translator must be approved by an official body. The translation must be certified, the translator must sign, stamp, and date it to confirm it’s a true and accurate copy of the original text.\n\nIf you fail to submit an explanation of your case (AEC) and a bundle of evidence by the date below, you will need to request the permission of a Judge to rely on late evidence and you will have to provide an explanation for the delay.\n\nThis decision is made by a Legal Officer in exercise of a specified power granted by the Senior President of Tribunals under rules 3(1) and (2) of the Tribunals Procedure (First-tier Tribunal) (Immigration and Asylum Chamber) Rules 2014. You may within 14 days of the date of this decision apply in writing to the Tribunal for the decision to be considered afresh by a judge under rule 3(4)."},
          sendDirectionParties: "appellant",
          sendDirectionDateDue: requestCaseBuildingComplyDate.year().toString() + '-' + (requestCaseBuildingComplyDate.month() + 1).toString().padStart(2,'0') + '-' + (requestCaseBuildingComplyDate.date().toString().padStart(2,'0'))
      }

      return data;
  }

  generateBuildYourCaseData() {
      data = {
          uploadedLegalRepBuildCaseDocs: "- None",
          caseArgumentDocument: {
              document_url: "INJECTED_VALUE",
              document_binary_url: "INJECTED_VALUE",
              document_filename: "TEST DOCUMENT 4.pdf"
          },
          caseArgumentDescription: "Skeletal argument description text",
          caseArgumentEvidence: []
      }

      return data;
  }

  generateRespondentReviewData() {
      data = {
          sendDirectionExplanation: "By the date below you must review the appellant’s explanation of case (AEC) and bundle.\n\nThe review must comply with (i) Rule 24A (3) of the Tribunal Procedure Rules 2014 and (ii) the Practice Direction Part 2, section 2.1 (e), Part 3.\n\nSpecifically, the review must:\n\n- be meaningful and pragmatically address any evidence uploaded by the appellant subsequently to the decision under appeal.\n- explain whether you agree that the schedule of disputed issues is correct. If not, the review must set out the correct list of disputed issues, including whether there are any further issues that the respondent wishes to raise.\n- state whether you oppose or accept the appellant’s position on each issue and why.\n- cross-reference your submissions to paragraphs in the decision under appeal, pages in the respondent’s bundle, any country information evidence schedule, and/or any additional evidence relied upon.\n- specify which, if any, witnesses you intend to cross-examine and if you do not intend to cross-examine a witness, outline any objections to that witness’s statement being read by a judge.\n- address whether the appeal should be allowed on any ground if the appellant and/or their key witnesses are found to be credible according to the applicable standard of proof.\n- identify whether you are prepared to withdraw the decision (or part of it).\n- state whether the appeal can be resolved without a hearing.\n- not exceed 6 pages unless reasons are submitted in an accompanying application.\n- not contain standard or pro-forma paragraphs.\n- provide the name of the author of the review and the date.\n\nParties must ensure they conduct proceedings with procedural rigour.\n\nThe Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the possible sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction.",
          sendDirectionParties: "respondent",
          sendDirectionDateDue: todayPlusSevenDays.year().toString() + '-' + (todayPlusSevenDays.month() + 1).toString().padStart(2,'0') + '-' + (todayPlusSevenDays.date().toString().padStart(2,'0'))
      }

      return data;
  }

  generateUploadTheAppealResponseData(){
      data = {
          appealReviewOutcome: "decisionMaintained",
          uploadedHomeOfficeAppealResponseDocs: "- None",
          homeOfficeAppealResponseDocument: {
              document_url: "INJECTED_VALUE",
              document_binary_url: "INJECT_VALUE",
              document_filename: "TEST DOCUMENT 4.pdf",
          },
          homeOfficeAppealResponseDescription: "Appeal Response document test description",
          homeOfficeAppealResponseEvidence: []
      }

      return data;
  }

  generateForceCaseHearingsReqsData() {
      data = {
          reasonToForceCaseToSubmitHearingRequirements: "Force Case hearings req test description"
      }

      return data;

  }

  generateDraftHearingRequirementsData() {
      data = {
          appealOutOfCountry:"No",
          isAppellantAttendingTheHearing: "Yes",
          isAppellantGivingOralEvidence: "Yes",
          isWitnessesAttending: "No",
          isEvidenceFromOutsideUkInCountry: "No",
          isInterpreterServicesNeeded: "Yes",
          appellantInterpreterLanguageCategory: ["spokenLanguageInterpreter"],
          appellantInterpreterSpokenLanguage: {
              languageRefData: {
                  value: {
                      code: "fra",
                      label: "French"
                  },
              },
              languageManualEntryDescription: null,
              languageManualEntry: []
          },
          isHearingRoomNeeded: "No",
          isHearingLoopNeeded: "No",
          isOutOfCountryEnabled: "Yes",
          remoteVideoCall: "No",
          physicalOrMentalHealthIssues: "No",
          pastExperiences: "No",
          multimediaEvidence: "No",
          singleSexCourt: "No",
          inCameraCourt: "No",
          additionalRequests: "No",
          datesToAvoidYesNo: "No",
          hearingDateRangeDescription: "Only include dates between 2 Mar 2026 and 11 May 2026."
      }

      return data;
  }

  generateReviewHearingRequirementsData() {
      data = {
          autoHearingRequestEnabled: "No",
          witness1InterpreterLanguageCategory: null,
          witness2InterpreterLanguageCategory: null,
          witness3InterpreterLanguageCategory: null,
          witness4InterpreterLanguageCategory: null,
          witness5InterpreterLanguageCategory: null,
          witness6InterpreterLanguageCategory: null,
          witness7InterpreterLanguageCategory: null,
          witness8InterpreterLanguageCategory: null,
          witness9InterpreterLanguageCategory: null,
          witness10InterpreterLanguageCategory: null,
          isIntegrated: "Yes",
          appealOutOfCountry: "No",
          isEvidenceFromOutsideUkOoc: "No",
          isAppellantAttendingTheHearing: "Yes",
          isAppellantGivingOralEvidence: "Yes",
          isWitnessesAttending: "No",
          witnessDetailsReadonly: null,
          isEvidenceFromOutsideUkInCountry: "No",
          isInterpreterServicesNeeded: "Yes",
          interpreterLanguageReadonly: null,
          appellantInterpreterSpokenLanguage: {
              languageRefData: {
                  value: {
                      code: "fra",
                      label: "French"
                  },
              },
              languageManualEntry: []
          },
          appellantInterpreterSignLanguage: null,
          isAnyWitnessInterpreterRequired: null,
          witness1InterpreterSpokenLanguage: null,
          witness2InterpreterSpokenLanguage: null,
          witness3InterpreterSpokenLanguage: null,
          witness4InterpreterSpokenLanguage: null,
          witness5InterpreterSpokenLanguage: null,
          witness6InterpreterSpokenLanguage: null,
          witness7InterpreterSpokenLanguage: null,
          witness8InterpreterSpokenLanguage: null,
          witness9InterpreterSpokenLanguage: null,
          witness10InterpreterSpokenLanguage: null,
          witness1InterpreterSignLanguage: null,
          witness2InterpreterSignLanguage: null,
          witness3InterpreterSignLanguage: null,
          witness4InterpreterSignLanguage: null,
          witness5InterpreterSignLanguage: null,
          witness6InterpreterSignLanguage: null,
          witness7InterpreterSignLanguage: null,
          witness8InterpreterSignLanguage: null,
          witness9InterpreterSignLanguage: null,
          witness10InterpreterSignLanguage: null,
          isHearingRoomNeeded: "No",
          isHearingLoopNeeded: "No",
          listingLength: {
              hours: "1",
              minutes: "0"
          },
          isOutOfCountryEnabled: "Yes",
          remoteVideoCall: "No",
          remoteVideoCallDescription: null,
          isRemoteHearingAllowed: "Refused",
          remoteVideoCallTribunalResponse: "Refusal of remote hearing test text",
          physicalOrMentalHealthIssues: "No",
          physicalOrMentalHealthIssuesDescription: null,
          multimediaEvidence: "No",
          multimediaEvidenceDescription: null,
          singleSexCourt: "No",
          singleSexCourtType: null,
          singleSexCourtTypeDescription: null,
          inCameraCourt: "No",
          inCameraCourtDescription: null,
          additionalRequests: "No",
          additionalRequestsDescription: null,
          hearingChannel: {
              value: {
                  code: "INTER",
                  label: "In Person"
              },
          },
          isAppealSuitableToFloat: "No",
          isAdditionalInstructionAllowed: "No"
      }

      return data;
  }

  generateListTheCaseData() {
      data = {
          ariaListingReference: "INJECTED_VALUE",
          isCaseUsingLocationRefData: "Yes",
          listCaseHearingCentreAddress: null,
          listingLocation: {
              value: {
                  code: "366559",
                  label: "Atlantic Quay - Glasgow"
              },
          },
          isRemoteHearing: "No",
          listingLength: {
              hours: "1",
              minutes: "0"
          },
          listCaseHearingDate: todayPlusSevenDays.year().toString() + '-' + (todayPlusSevenDays.month() + 1).toString().padStart(2,'0') + '-' + (todayPlusSevenDays.date().toString().padStart(2,'0')) + "T10:00:00.000"
      }

      return data;
  }

  generateCreateCaseSummaryData() {
      data = {
          caseSummaryDocument: {
              document_url: "INJECTED_VALUE",
              document_binary_url: "INJECTED_VALUE",
              document_filename: "TEST DOCUMENT 3.pdf"
          },
          caseSummaryDescription: "Create Case Summary description test text"
      }

      return data;
  }

  generateHearingBundleData() {
      data = {
          ...isRehydrated ? {isNotificationTurnedOff: "No"} : {isNotificationTurnedOff: null}
      }

      return data;
  }

  generateStartDecisionAndReasonsData() {
      data = {
          listCaseHearingCentre: "glasgowTribunalsCentre",
          autoHearingRequestEnabled: "No",
          caseIntroductionDescription: "Brief introduction to case description text",
          appellantCaseSummaryDescription: "Appellant Case Summary description text",
          immigrationHistoryAgreement: "Yes",
          agreedImmigrationHistoryDescription: "Agreed Immigration History description test text",
          scheduleOfIssuesAgreement: "Yes",
          appellantsAgreedScheduleOfIssuesDescription: "Agreed schedule of issues description test text",
          isDecisionWithoutHearing: null,
      }

      return data;
  }

  generatePrepareDecisionAndReasonsData() {
      data = {
          anonymityOrder: "No",
          appellantRepresentative: null,
          respondentRepresentative: null,
      }

      return data;
  }

    generateCompleteDecisionAndReasonsData() {
        data = {
            isDecisionAllowed: judgeDecision,
            finalDecisionAndReasonsDocument: {
                document_url: "INJECTED_VALUE",
                document_binary_url: "INJECTED_VALUE",
                document_filename: "TEST DOCUMENT 2.pdf"
            },
            isDocumentSignedToday: {
                values: [
                    "isDocumentSignedToday"
                ]
            },
            isFeeConsistentWithDecision: {
                values: [
                    "isFeeConsistentWithDecision"
                ]
            }
        }

        return data;
    }

    generatePermissionToAppealData() {
        const ftpaGroundsDocumentsKey: string = judgeDecision === 'allowed' ? 'ftpaRespondentGroundsDocuments' : 'ftpaAppellantGroundsDocuments';
        const ftpaEvidenceDocumentsKey: string = judgeDecision === 'allowed' ? 'ftpaRespondentEvidenceDocuments' : 'ftpaAppellantEvidenceDocuments';

      data = {
            [ftpaGroundsDocumentsKey]: [
                {
                    value: {
                        description: "Grounds of application - describe document test text",
                        document: {
                            document_url: "INJECTED_VALUE",
                            document_binary_url: "INJECTED_VALUE",
                            document_filename: "TEST DOCUMENT 1.pdf"
                        }
                    },
                    id: null
                }
            ],
            [ftpaEvidenceDocumentsKey]: []
        }

        return data;
  }

    generateDecideFtpaApplicationData() {
        const ftpaRjDecisionOutcomeTypeKey: string = judgeDecision === 'allowed' ? 'ftpaRespondentRjDecisionOutcomeType' : 'ftpaAppellantRjDecisionOutcomeType';
        const ftpaApplicationDocumentKey: string = judgeDecision === 'allowed' ? 'ftpaApplicationRespondentDocument' : 'ftpaApplicationAppellantDocument';
        const isFtpaNoticeOfDecisionSetAsideKey: string = judgeDecision === 'allowed' ? 'isFtpaRespondentNoticeOfDecisionSetAside' : 'isFtpaAppellantNoticeOfDecisionSetAside';
        const ftpaRjDecisionNotesPointsKey: string = judgeDecision === 'allowed' ? 'ftpaRespondentRjDecisionNotesPoints' : 'ftpaAppellantRjDecisionNotesPoints';
        const ftpaRjDecisionNotesDescriptionKey: string = judgeDecision === 'allowed' ? 'ftpaRespondentRjDecisionNotesDescription' : 'ftpaAppellantRjDecisionNotesDescription';

        data = {
            ftpaApplicantType: judgeDecision === 'allowed' ? 'respondent' : 'appellant',
            [ftpaRjDecisionOutcomeTypeKey]: "granted",
            [ftpaApplicationDocumentKey]: {
                document_url: "INJECTED_VALUE",
                document_binary_url: "INJECTED_VALUE",
                document_filename: "TEST DOCUMENT 5.pdf",

            },
            [isFtpaNoticeOfDecisionSetAsideKey]: "No",
            [ftpaRjDecisionNotesPointsKey]: {
                specialDifficulty: [
                    "specialDifficulty"
                ],
                specialReasons: [
                    "specialReasons"
                ],
                countryGuidance: [
                    "countryGuidance"
                ]
            },
            [ftpaRjDecisionNotesDescriptionKey]: "test description"
        }

        return data;
    }

}
