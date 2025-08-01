import moment from "moment/moment";
import { Page } from "@playwright/test";
import { appellant, sponsor, legalRepresentative, runningEnv } from '../detainedConfig';
import { detentionFacility } from '../fixtures/detentionFacilities';
import { ButtonHelper } from '../helpers/ButtonHelper';

//const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';


export class CreateAppeal {
    private buttonHelper: ButtonHelper;
    
    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }
  
  // setTribunalAppealReceived() - Legal Admin Journey
//   async setTribunalAppealReceived() {
//     const yesterday = moment().subtract(1, 'days');
//     await I.runAccessibilityCheck('TribunalAppealReceivedDate');
//     await I.fillField('#tribunalReceivedDate-day', yesterday.date());
//     await I.fillField('#tribunalReceivedDate-month', yesterday.month()+1);
//     await I.fillField('#tribunalReceivedDate-year', yesterday.year());
//     await I.clickContinue();
//   }
//
//   // appellantInPerson() - Legal Admin Journey
//   async appellantInPerson(yesNo: string = 'Yes', hasPostalAddress: string = 'Yes') {
//     await I.click(`#appellantsRepresentation-${yesNo}`);
//
//     if (yesNo === 'No') {
//       await I.clickContinue();
//       await I.fillField('#appealWasNotSubmittedReason', 'Reason why appeal was not submitted on MyHMCTS');
//       await I.click('Add new');
//       await I.attachFile('#appealNotSubmittedReasonDocuments_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
//       await I.fillField('#appealNotSubmittedReasonDocuments_0_description', 'Supporting document test');
//       await I.waitForInvisible(locate('.error-message').withText('Uploading...'), 20);
//       await I.runAccessibilityCheck('ReasonNotSubmittedOnHMCTS');
//       await I.clickContinue();
//
//       await I.waitForText('Legal representative details', 60);
//       await I.fillField('#legalRepCompanyPaperJ', legalRepresentative.company);
//       await I.fillField('#legalRepGivenName', legalRepresentative.name);
//       await I.fillField('#legalRepFamilyNamePaperJ', legalRepresentative.familyName);
//       await I.fillField('#legalRepEmail', legalRepresentative.email);
//       await I.fillField('#legalRepRefNumberPaperJ', legalRepresentative.reference);
//       await I.runAccessibilityCheck('LegalRepresentativeDetails');
//       await I.clickContinue();
//
//       await I.waitForText('Legal representative address', 60);
//       await I.click(`#legalRepHasAddress_${hasPostalAddress}`);
//       await I.waitForElement('#legalRepAddressUK_legalRepAddressUK_postcodeInput');
//       await I.fillField('#legalRepAddressUK_legalRepAddressUK_postcodeInput',  legalRepresentative.address.postcode);
//       await I.click('//button[contains(text(), "Find address")]');
//       await I.waitForVisible('#legalRepAddressUK_legalRepAddressUK_addressList', 60);
//       await I.selectOption('#legalRepAddressUK_legalRepAddressUK_addressList', legalRepresentative.address.addressLine1); // First valid address
//       await I.runAccessibilityCheck('LegalRepresentativeAddress');
//       await I.clickContinue();
//
//     } else {
//       await I.clickContinue();
//     }
//   }
//
   async locationInUK(yesNo: string = 'Yes') {
      await this.page.check(`#appellantInUk_${yesNo}`);
      await this.buttonHelper.continueButton.click();
   }
//
//
//   async outOfCountryDecision(appealDecision: string = 'refusalOfHumanRights', inTime: boolean = true) {
//     let currentUrl: string;
//     const inOutOfTimeDate = inTime
//         ? moment().subtract(5, 'days')
//         : moment().subtract(2, 'months');
//
//     switch (appealDecision) {
//       case 'refusalOfHumanRights':
//         await I.click('#outOfCountryDecisionType-refusalOfHumanRights');
//         await I.clickContinue();
//         currentUrl = await I.grabCurrentUrl();
//         if (currentUrl.includes('startAppealentryClearanceDecision')) {
//           await I.fillField('#gwfReferenceNumber', '123456789');
//           await I.fillField('#dateEntryClearanceDecision-day', inOutOfTimeDate.date().toString());
//           await I.fillField('#dateEntryClearanceDecision-month', (inOutOfTimeDate.month() + 1).toString());
//           await I.fillField('#dateEntryClearanceDecision-year', inOutOfTimeDate.year().toString());
//           await I.clickContinue();
//         }
//         break;
//       case 'refusalOfProtection':
//         await I.click('#outOfCountryDecisionType-refusalOfProtection');
//         await I.clickContinue();
//         currentUrl = await I.grabCurrentUrl();
//         if (currentUrl.includes('startAppealdepartureDate')) {
//           await I.fillField('#dateClientLeaveUk-day', inOutOfTimeDate.date().toString());
//           await I.fillField('#dateClientLeaveUk-month', (inOutOfTimeDate.month() + 1).toString());
//           await I.fillField('#dateClientLeaveUk-year', inOutOfTimeDate.year().toString());
//           await I.clickContinue();
//           await this.setHomeOfficeDetails(inTime, 'decisionLetterReceivedDate');
//         }
//         break;
//       case 'removalOfClient':
//         await I.click('#outOfCountryDecisionType-removalOfClient');
//         await I.clickContinue();
//         currentUrl = await I.grabCurrentUrl();
//         if (currentUrl.includes('startAppealhomeOfficeDecision')) {
//           await I.fillField('#homeOfficeReferenceNumber', '123456789');
//           await I.fillField('#day-label-decisionLetterReceivedDate-day', inOutOfTimeDate.date().toString());
//           await I.fillField('#month-label-decisionLetterReceivedDate-month', (inOutOfTimeDate.month() + 1).toString());
//           await I.fillField('#year-label-decisionLetterReceivedDate-year', inOutOfTimeDate.year().toString());
//           await I.clickContinue();
//           await this.setHomeOfficeDetails(inTime, 'decisionLetterReceivedDate');
//         }
//         break;
//       case 'refusePermit':
//         await I.click('#outOfCountryDecisionType-refusePermit');
//         await I.clickContinue();
//         currentUrl = await I.grabCurrentUrl();
//         if (currentUrl.includes('startAppealentryClearanceDecision')) {
//           await I.fillField('#gwfReferenceNumber', '123456789');
//           await I.fillField('#dateEntryClearanceDecision-day', inOutOfTimeDate.date().toString());
//           await I.fillField('#dateEntryClearanceDecision-month', (inOutOfTimeDate.month() + 1).toString());
//           await I.fillField('#dateEntryClearanceDecision-year', inOutOfTimeDate.year().toString());
//           await I.clickContinue();
//         }
//         break;
//     }
//   }
//
   async inDetention(yesNo: string = 'Yes') {
      await this.page.check(`#appellantInDetention_${yesNo}`);
      await this.buttonHelper.continueButton.click();
   }

   async setDetentionLocation(detentionLocation: string = 'immigrationRemovalCentre') {
     switch (detentionLocation) {
       case 'immigrationRemovalCentre':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
           await this.buttonHelper.continueButton.click();
           await this.setDetentionCentre();
           break;
       case 'prison':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
           await this.page.fill('#prisonNOMSNumber_prison', appellant.NOMSNumber);
           await this.buttonHelper.continueButton.click();

           await this.page.locator('#prisonName').selectOption(detentionFacility.prison.name);
           await this.buttonHelper.continueButton.click();
           break;
       case 'other':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
           await this.page.fill('#otherDetentionFacilityName_other', detentionFacility.other.name);
           await this.buttonHelper.continueButton.click();
           break;
     }
   }

    async setDetentionCentre() {
      await this.page.locator('#ircName').selectOption('Brookhouse');
      await this.buttonHelper.continueButton.click();
   }

   async setCustodialSentence(hasCustodialSentence: string = 'Yes') {
       await this.page.check(`#releaseDateProvided_${hasCustodialSentence}`);
       
       if (hasCustodialSentence === 'Yes') {
           await this.page.fill('#releaseDate-day', appellant.custodialSentence.day.toString());
           await this.page.fill('#releaseDate-month', appellant.custodialSentence.month.toString());
           await this.page.fill('#releaseDate-year', appellant.custodialSentence.year.toString());
       }
       await this.buttonHelper.continueButton.click();
   }

   async setBailApplication(bail: string = "No") {
       await this.page.check(`#hasPendingBailApplications-${bail}`);
       if (bail === 'Yes') {
           await this.page.fill('#bailApplicationNumber', appellant.bailApplicationNumber);
       }
       await this.buttonHelper.continueButton.click();
   }

   async setHomeOfficeDetails(inTime: boolean = true) {
       const homeOfficeLetterDate = inTime ? moment().subtract(5, 'days') : moment().subtract(20, 'days');
       
       await this.page.fill('#homeOfficeReferenceNumber', '12345');
       await this.page.fill('#homeOfficeDecisionDate-day', homeOfficeLetterDate.date().toString());
       await this.page.fill('#homeOfficeDecisionDate-month', (homeOfficeLetterDate.month() + 1).toString());
       await this.page.fill('#homeOfficeDecisionDate-year', homeOfficeLetterDate.year().toString());
       await this.buttonHelper.continueButton.click();
   }

   async uploadNoticeOfDecision() {
       await this.page.locator('button:text("Add new")').click();
       await this.page.locator('#uploadTheNoticeOfDecisionDocs_0_document').setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
       await this.page.fill('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
       await this.page.waitForSelector('.error-message', { state: 'hidden' });
       await this.buttonHelper.continueButton.click();
   }

   async setTypeOfAppeal(appealType: string = 'refusalOfEu'){
       let currentUrl: string;

       await this.page.check(`#appealType-${appealType}`);
       await this.buttonHelper.continueButton.click();
       
       switch (appealType) {
           case 'refusalOfEu':
               currentUrl = this.page.url();
               if (!currentUrl.includes('BasicDetails')) {
                   await this.groundsOfAppeal();
               }
               break;
           case 'revocationOfProtection':
               currentUrl = this.page.url();
               if (!currentUrl.includes('BasicDetails')) {
                   await this.page.check('#appealGroundsRevocation_values-revocationHumanitarianProtection');
                   await this.buttonHelper.continueButton.click();
               }
               break;
           case 'refusalOfHumanRights':
               currentUrl = this.page.url();
               if (!currentUrl.includes('BasicDetails')) {
                   await this.page.check('#appealGroundsDecisionHumanRightsRefusal_values-humanRightsRefusal');
                   await this.buttonHelper.continueButton.click();
               }
               break;
           case 'deprivation':
               currentUrl = this.page.url();
               if (!currentUrl.includes('BasicDetails')) {
                   await this.page.check('#appealGroundsDeprivation_values-disproportionateDeprivation');
                   await this.buttonHelper.continueButton.click();
               }
               break;
           case 'euSettlementScheme':
               break;
           case 'protection':
               await this.page.check('#appealGroundsProtection_values-protectionHumanitarianProtection');
               await this.buttonHelper.continueButton.click();
               break;
       }
   }

   // appellantDetails() - Legal Admin journey only
   async appellantDetails() {
       await this.page.fill('#internalAppellantMobileNumber', appellant.mobile);
       await this.page.fill('#internalAppellantEmail', appellant.email);
       await this.buttonHelper.continueButton.click();
   }

//   // appellant contact preference: non-detained journey only
//   async setAppellentContactPreference(preference: string = 'EMAIL') {
//     if (preference === 'EMAIL') {
//       await I.click('#contactPreference-wantsEmail');
//       await I.fillField('#email', appellant.email);
//     } else {
//       await I.click('#contactPreference-wantsSms');
//       await I.fillField('#mobileNumber', appellant.mobile);
//     }
//     await I.clickContinue();
//   }
//
   // appellant address: non-detained journey and detained journey where facility is "Other"
   async setAppellentsAddress(journeyType: string = "detained", hasPostalAddress: string = 'Yes', updateDetentionLocationEvent: boolean = false) {
       if (journeyType !== 'detained') {
           await this.page.check(`#appellantHasFixedAddress_${hasPostalAddress}`);
       }
       
       if (hasPostalAddress === 'Yes') {
           if (!updateDetentionLocationEvent) {
               await this.page.check('//*[@id="appellantAddress_appellantAddress"]/div/a');
           }
           await this.page.fill('#appellantAddress__detailAddressLine1', appellant.address.addressLine1);
           await this.page.fill('#appellantAddress__detailPostTown', appellant.address.postTown);
           await this.page.fill('#appellantAddress__detailPostCode', appellant.address.postcode);
           await this.page.fill('#appellantAddress__detailCountry', appellant.address.country);
       }
       await this.buttonHelper.continueButton.click();
   }

//   async setOutOfCountryAddress(hasAddress: 'Yes' | 'No' = 'Yes') {
//     await I.click(`#hasCorrespondenceAddress_${hasAddress}`);
//
//     if (hasAddress === 'Yes') {
//       const outOfCountryAddress = '123 Example Street, Example City, Example Country, AB12 3CD';
//       await I.fillField('#appellantOutOfCountryAddress', outOfCountryAddress);
//     }
//
//     await I.clickContinue();
//   }

   async groundsOfAppeal() {
       await this.page.click('#appealGroundsEuRefusal_values-appealGroundsEuRefusal');
       await this.buttonHelper.continueButton.click();
   }

   async setAppellantBasicDetails(minimalBasicDetails: boolean = false) {
       if (!minimalBasicDetails) {
           await this.page.fill('#appellantTitle', appellant.title);
       }
       await this.page.fill('#appellantGivenNames', appellant.givenNames);
       await this.page.fill('#appellantFamilyName', appellant.familyName);
       await this.page.fill('#appellantDateOfBirth-day', appellant.dob.day.toString());
       await this.page.fill('#appellantDateOfBirth-month', appellant.dob.month.toString());
       await this.page.fill('#appellantDateOfBirth-year', appellant.dob.year.toString());
       await this.buttonHelper.continueButton.click();
   }

   async setNationality(hasNationality: boolean = true){
       if (hasNationality){
           await this.page.check('#appellantStateless-hasNationality');
           await this.page.locator('button:text("Add new")').click();
           await this.page.locator('#appellantNationalities_0_code').selectOption('Finland');
       } else {
           await this.page.check('#appellantStateless-hasNationality');
       }
       await this.buttonHelper.continueButton.click();
   }

   async hasSponsor(isSponsored: string = 'No', sponsorComms: string = 'email', sponsorAuthorised: string = 'Yes'){
       await this.page.click(`#hasSponsor_${isSponsored}`);
       await this.buttonHelper.continueButton.click();
       
       if (isSponsored === 'Yes') {
           await this.setSponsor(sponsorComms, sponsorAuthorised);
       }
   }

   async setSponsor(emailSms: string, authorisation: string) {
       await this.page.fill('#sponsorGivenNames', sponsor.givenNames);
       await this.page.fill('#sponsorFamilyName', sponsor.familyName);
       await this.buttonHelper.continueButton.click();
       await this.page.getByText("I can't enter a UK postcode").click();
       await this.page.fill('#sponsorAddress__detailAddressLine1', sponsor.address.addressLine1);
       await this.page.fill('#sponsorAddress__detailPostTown', sponsor.address.postTown);
       await this.page.fill('#sponsorAddress__detailPostCode', sponsor.address.postcode);
       await this.page.fill('#sponsorAddress__detailCountry', sponsor.address.country);
       await this.buttonHelper.continueButton.click();
       
       if (emailSms === 'email') {
           await this.page.check('#sponsorContactPreference-wantsEmail');
           await this.page.fill('#sponsorEmail', sponsor.email);
       } else {
           await this.page.check('#sponsorContactPreference-wantsSms');
           await this.page.fill('#sponsorMobileNumber', sponsor.mobile);
       }
       await this.buttonHelper.continueButton.click();
       await this.page.check(`#sponsorAuthorisation_${authorisation}`);
       await this.buttonHelper.continueButton.click();
   }

   async hasDeportationOrder(hasDeportOrder: string = 'No') {
       await this.page.check(`#deportationOrderOptions_${hasDeportOrder}`);
       await this.buttonHelper.continueButton.click();
   }

   async hasRemovalDirections(hasRemovalOrder: string = 'No') {
       await this.page.check(`#removalOrderOptions_${hasRemovalOrder}`);
       
       if (hasRemovalOrder === 'Yes') {
           await this.page.fill('#removalOrderDate-day', appellant.removalDirections.date.day.toString());
           await this.page.fill('#removalOrderDate-month', appellant.removalDirections.date.month.toString());
           await this.page.fill('#removalOrderDate-year', appellant.removalDirections.date.year.toString());
           await this.page.fill('#removalOrderDate-hour', appellant.removalDirections.time.hour24.toString());
           await this.page.fill('#removalOrderDate-minute', appellant.removalDirections.time.minutesWithLeadingZero.toString());
           await this.page.fill('#removalOrderDate-second', appellant.removalDirections.time.secondsWithLeadingZero.toString());
       }

       await this.buttonHelper.continueButton.click();
   }

   // uploadAppealDocs() - For Legal Admin journey
//   async uploadAppealDocs() {
//     await I.runAccessibilityCheck('UploadAppealDocumentation');
//     await I.click('Add new');
//     await I.attachFile('#uploadTheAppealFormDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
//     await I.fillField('#uploadTheAppealFormDocs_0_description', 'Appeal document.');
//     await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
//     await I.clickContinue();
//   }

   async hasNewMatters(hasMatters: string = 'No') {
       await this.page.check(`#hasNewMatters_${hasMatters}`);

       if (hasMatters === 'Yes') {
           await this.page.fill('#newMatters', 'New matters test text.');
       }

       await this.buttonHelper.continueButton.click();
   }

   async hasOtherAppeals(otherAppeals: string = 'No') {
       await this.page.check(`#hasOtherAppeals-${otherAppeals}`);

       if (otherAppeals != 'No') {
       // TODO: Needs other options added
       }

       await this.buttonHelper.continueButton.click();
   }

   async setLegalRepresentativeDetails() {
       await this.page.fill('#legalRepCompany', legalRepresentative.company);
       await this.page.fill('#legalRepName', legalRepresentative.name);
       await this.page.fill('#legalRepFamilyName', legalRepresentative.familyName);
       await this.page.fill('#legalRepMobilePhoneNumber', legalRepresentative.mobile);
       await this.page.fill('#legalRepReferenceNumber', legalRepresentative.reference);
       await this.buttonHelper.continueButton.click();
   }

   async isHearingRequired(hearingRequired: boolean = true) {
       if (hearingRequired) {
           await this.page.check("//input[contains(@id,'decisionWithHearing')]")
       } else {
           await this.page.check("//input[contains(@id,decisionWithoutHearing')]")
       }

       await this.buttonHelper.continueButton.click();
   }

   async hasFeeRemission(feeRemission: string = 'No') {
     // TODO: Needs other options added
       switch (feeRemission) {
           case 'No':
               await this.page.check('#remissionType-noRemission');
               break;
       }
       
       await this.buttonHelper.continueButton.click();
   }

   // Only valid for appeal type: Refusal of protection claim
   async setPayNowLater(nowLater: string = 'Now') {
       await this.page.check(`#paAppealTypePaymentOption-pay${nowLater}`);
       await this.buttonHelper.continueButton.click();
   }

   async checkMyAnswers() {
       await this.buttonHelper.continueButton.click();

       if(['demo'].includes(runningEnv)) {
           await this.buttonHelper.closeAndReturnToCaseDetails.click();
       }
   }
}