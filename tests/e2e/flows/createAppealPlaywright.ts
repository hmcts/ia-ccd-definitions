import moment from "moment/moment";
import { Page } from "@playwright/test";
import { appellant, sponsor, legalRepresentative, runningEnv } from '../detainedConfig';
import { detentionFacility } from '../fixtures/detentionFacilities';
//const { I } = inject();
//const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';


export class CreateAppeal {
    constructor(public page: Page) {}
    readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
    readonly clickCloseAndReturnToCaseDetails = this.page.getByRole('button', { name: 'Close and Return to case details' });




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
      await this.continueButton.click();
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
      //await I.runAccessibilityCheck('InDententionPage');
      await this.page.check(`#appellantInDetention_${yesNo}`);
      await this.continueButton.click();
   }

     //     await I.clickContinue();
//   }
//
   async setDetentionLocation(detentionLocation: string = 'immigrationRemovalCentre') {
//     await I.runAccessibilityCheck('DetentionLocationPage');
     switch (detentionLocation) {
       case 'immigrationRemovalCentre':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
           await this.continueButton.click();
//         await I.click(`#detentionFacility-${detentionLocation}`);
//         await I.clickContinue();
           await this.setDetentionCentre();
           break;
       case 'prison':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
//         await I.click(`#detentionFacility-${detentionLocation}`);
//         await I.waitForElement(`#prisonNOMSNumber_${detentionLocation}`, 60);
//         await I.runAccessibilityCheck('DententionLocationPrisonNOMSPage');
           await this.page.fill('#prisonNOMSNumber_prison', appellant.NOMSNumber);
//         await I.fillField('#prisonNOMSNumber_prison', appellant.NOMSNumber)
//         await I.runAccessibilityCheck('DententionLocationPrisonNOMSPage');
           await this.continueButton.click();
//         await I.clickContinue();
           await this.page.locator('#prisonName').selectOption(detentionFacility.prison.name);
//         await I.selectOption('#prisonName', detentionFacility.prison.name);
//         await I.runAccessibilityCheck('DententionLocationPrisonNamePage');
           await this.continueButton.click();
//         await I.clickContinue();
           break;
       case 'other':
           await this.page.check(`#detentionFacility-${detentionLocation}`);
//         await I.click(`#detentionFacility-${detentionLocation}`);
//         await I.waitForVisible('#otherDetentionFacilityName_other', 60);
//         await I.runAccessibilityCheck('DententionLocationOtherPage');
           await this.page.fill('#otherDetentionFacilityName_other', detentionFacility.other.name);
//         await I.fillField('#otherDetentionFacilityName_other', 'Other facility test');
           await this.continueButton.click();
//         await I.clickContinue();
           break;
     }
   }
//
    async setDetentionCentre() {
      await this.page.locator('#ircName').selectOption('Brookhouse');
      await this.continueButton.click();
//     await I.runAccessibilityCheck('DententionLocationIRCPage');
   }
//
   async setCustodialSentence(hasCustodialSentence: string = 'Yes') {
       await this.page.check(`#releaseDateProvided_${hasCustodialSentence}`);

      //     await I.click(`#releaseDateProvided_${hasCustodialSentence}`);

     if (hasCustodialSentence === 'Yes') {
         await this.page.fill('#releaseDate-day', appellant.custodialSentence.day.toString());
         await this.page.fill('#releaseDate-month', appellant.custodialSentence.month.toString());
         await this.page.fill('#releaseDate-year', appellant.custodialSentence.year.toString());
//       await I.fillField('#releaseDate-day', appellant.custodialSentence.day);
//       await I.fillField('#releaseDate-month', appellant.custodialSentence.month);
//       await I.fillField('#releaseDate-year', appellant.custodialSentence.year);
     }
//     await I.runAccessibilityCheck('CustodialSentencePage');
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async setBailApplication(bail: string = "No") {
      await this.page.check(`#hasPendingBailApplications-${bail}`);
      if (bail === 'Yes') {
          await this.page.fill('#bailApplicationNumber', appellant.bailApplicationNumber);
      }
      await this.continueButton.click();
   }



   async setHomeOfficeDetails(inTime: boolean = true) {
      const homeOfficeLetterDate = inTime ? moment().subtract(5, 'days') : moment().subtract(20, 'days');

//     await I.runAccessibilityCheck('HomeOfficeDetailsPage');
      await this.page.fill('#homeOfficeReferenceNumber', '12345');
     //await I.fillField('#homeOfficeReferenceNumber', '12345');
//
//
      await this.page.fill('#homeOfficeDecisionDate-day', homeOfficeLetterDate.date().toString());
      await this.page.fill('#homeOfficeDecisionDate-month', (homeOfficeLetterDate.month() + 1).toString());
      await this.page.fill('#homeOfficeDecisionDate-year', homeOfficeLetterDate.year().toString());
//     await I.fillField(`#${fieldPrefix}-day`, homeOfficeLetterDate.date().toString());
//     await I.fillField(`#${fieldPrefix}-month`, (homeOfficeLetterDate.month() + 1).toString());
//     await I.fillField(`#${fieldPrefix}-year`, homeOfficeLetterDate.year().toString());
      await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async uploadNoticeOfDecision() {
//     await I.runAccessibilityCheck('UploadNoticeOfDecisionPage');
       await this.page.locator('button:text("Add new")').click();
 //     await I.click('Add new');
       await this.page.locator('#uploadTheNoticeOfDecisionDocs_0_document').setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
//     await I.attachFile('#uploadTheNoticeOfDecisionDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
       await this.page.fill('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
//     await I.fillField('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
       //await this.page.waitForTimeout(5000); // waits for 2 seconds
       await this.page.waitForSelector('.error-message', { state: 'hidden' });
//     await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async setTypeOfAppeal(appealType: string = 'refusalOfEu'){
     let currentUrl: string;
//
//     await I.runAccessibilityCheck('TypeOfAppealPage');
       await this.page.check(`#appealType-${appealType}`);
//     await I.click(`#appealType-${appealType}`);
       await this.continueButton.click();
//     await I.clickContinue()
//
     switch (appealType) {
       case 'refusalOfEu':
           currentUrl = this.page.url();
//         currentUrl = await I.grabCurrentUrl();
           if (!currentUrl.includes('BasicDetails')) {
               await this.groundsOfAppeal();
           }
           break;
       case 'revocationOfProtection':
           currentUrl = this.page.url();
//         currentUrl = await I.grabCurrentUrl();
           if (!currentUrl.includes('BasicDetails')) {
               await this.page.check('#appealGroundsRevocation_values-revocationHumanitarianProtection');
//           await I.runAccessibilityCheck('TypeOfAppealRevocationHumanitarianProtectionOptionsPage');
//           await I.click('#appealGroundsRevocation_values-revocationHumanitarianProtection');
               await this.continueButton.click();
//           await I.clickContinue();
           }
           break;
       case 'refusalOfHumanRights':
           currentUrl = this.page.url();
//         currentUrl = await I.grabCurrentUrl();
           if (!currentUrl.includes('BasicDetails')) {
//           await I.runAccessibilityCheck('TypeOfAppealHumanRightsRefusalOptionsPage');
               await this.page.check('#appealGroundsDecisionHumanRightsRefusal_values-humanRightsRefusal');
//           await I.click('#appealGroundsDecisionHumanRightsRefusal_values-humanRightsRefusal');
               await this.continueButton.click();
//           await I.clickContinue();
           }
           break;
       case 'deprivation':
           currentUrl = this.page.url();
//         currentUrl = await I.grabCurrentUrl();
           if (!currentUrl.includes('BasicDetails')) {
               await this.page.check('#appealGroundsDeprivation_values-disproportionateDeprivation');
//           await I.runAccessibilityCheck('TypeOfAppealDeprivationOptionsPage');
//           await I.checkOption('#appealGroundsDeprivation_values-disproportionateDeprivation');
               await this.continueButton.click();
//           await I.clickContinue();
           }
           break;
       case 'euSettlementScheme':
           break;
       case 'protection':
//         await I.runAccessibilityCheck('TypeOfAppealHumanitarianProtectionOptionsPage');
             await this.page.check('#appealGroundsProtection_values-protectionHumanitarianProtection');
//         await I.click('#appealGroundsProtection_values-protectionHumanitarianProtection');
             await this.continueButton.click();
//         await I.clickContinue();
             break;
     }
   }

   // appellantDetails() - Legal Admin journey only
   async appellantDetails() {
       await this.page.fill('#internalAppellantMobileNumber', appellant.mobile);
//     await I.fillField('#internalAppellantMobileNumber', appellant.mobile);
       await this.page.fill('#internalAppellantEmail', appellant.email);
//     await I.fillField('#internalAppellantEmail', appellant.email);
//     await I.runAccessibilityCheck('AppellantDetails');
       await this.continueButton.click();
//     await I.clickContinue();
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
//       await I.click(`#appellantHasFixedAddress_${hasPostalAddress}`);
     }
//
     if (hasPostalAddress === 'Yes') {
       if (!updateDetentionLocationEvent) {
           await this.page.check('//*[@id="appellantAddress_appellantAddress"]/div/a');
//         await I.click('//*[@id="appellantAddress_appellantAddress"]/div/a');
       }

       await this.page.fill('#appellantAddress__detailAddressLine1', appellant.address.addressLine1);
//       await I.fillField('#appellantAddress__detailAddressLine1', appellant.address.addressLine1);
       await this.page.fill('#appellantAddress__detailPostTown', appellant.address.postTown);
//       await I.fillField('#appellantAddress__detailPostTown', appellant.address.postTown);
       await this.page.fill('#appellantAddress__detailPostCode', appellant.address.postcode);
//       await I.fillField('#appellantAddress__detailPostCode', appellant.address.postcode);
       await this.page.fill('#appellantAddress__detailCountry', appellant.address.country);
//       await I.fillField('#appellantAddress__detailCountry', appellant.address.country);
     }
//     await I.runAccessibilityCheck('AppellantAddressPage');
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
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
//
   async groundsOfAppeal() {
//     await I.runAccessibilityCheck('TypeOfAppealRefusalOfEuOptionsPage');
       await this.page.click('#appealGroundsEuRefusal_values-appealGroundsEuRefusal');
//     await I.click('#appealGroundsEuRefusal_values-appealGroundsEuRefusal');
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async setAppellantBasicDetails(minimalBasicDetails: boolean = false) {
      if (!minimalBasicDetails) {
          await this.page.fill('#appellantTitle', appellant.title);
          //await I.fillField('#appellantTitle', appellant.title);
      }
      await this.page.fill('#appellantGivenNames', appellant.givenNames);
//     await I.fillField('#appellantGivenNames', appellant.givenNames);
      await this.page.fill('#appellantFamilyName', appellant.familyName);
//     await I.fillField('#appellantFamilyName', appellant.familyName);
      await this.page.fill('#appellantDateOfBirth-day', appellant.dob.day.toString());
//     await I.fillField('#appellantDateOfBirth-day', appellant.dob.day);
      await this.page.fill('#appellantDateOfBirth-month', appellant.dob.month.toString());
//     await I.fillField('#appellantDateOfBirth-month', appellant.dob.month);
      await this.page.fill('#appellantDateOfBirth-year', appellant.dob.year.toString());
//     await I.fillField('#appellantDateOfBirth-year', appellant.dob.year);
//     await I.runAccessibilityCheck('AppellantBasicDetailsPage');
      await this.continueButton.click();
//     await I.clickContinue();
   }

   async setNationality(hasNationality: boolean = true){
      if (hasNationality){
          await this.page.check('#appellantStateless-hasNationality');
//       await I.click('#appellantStateless-hasNationality');
          await this.page.locator('button:text("Add new")').click();
//       await I.click('Add new');
          await this.page.locator('#appellantNationalities_0_code').selectOption('Finland');
//       await I.selectOption('#appellantNationalities_0_code', 'Finland');
      } else {
          await this.page.check('#appellantStateless-hasNationality');
//       await I.click('#appellantStateless-hasNationality');
      }
//     await I.runAccessibilityCheck('AppellantNationalityPage');
      await this.continueButton.click();
//     await I.clickContinue();
   }

   async hasSponsor(isSponsored: string = 'No', sponsorComms: string = 'email', sponsorAuthorised: string = 'Yes'){
//     await I.runAccessibilityCheck('SponsorPage');
       await this.page.click(`#hasSponsor_${isSponsored}`);
//     await I.click(`#hasSponsor_${isSponsored}`);
       await this.continueButton.click();
//     await I.clickContinue();
//
     if (isSponsored === 'Yes') {
       await this.setSponsor(sponsorComms, sponsorAuthorised);
     }

//
   }
//
   async setSponsor(emailSms: string, authorisation: string) {
//     await I.runAccessibilityCheck('SponsorNames')
       await this.page.fill('#sponsorGivenNames', sponsor.givenNames);
//     await I.fillField('#sponsorGivenNames', sponsor.givenNames);
       await this.page.fill('#sponsorFamilyName', sponsor.familyName);
//     await I.fillField('#sponsorFamilyName', sponsor.familyName);
       //await this.page.waitForTimeout(5000); // waits for 2 seconds
       await this.continueButton.click();
//     await I.clickContinue();
//     await I.runAccessibilityCheck('SponsorAddress');
       await this.page.getByText("I can't enter a UK postcode").click();
       await this.page.fill('#sponsorAddress__detailAddressLine1', sponsor.address.addressLine1);
//     await I.fillField('#sponsorAddress__detailAddressLine1', sponsor.address.addressLine1);
       await this.page.fill('#sponsorAddress__detailPostTown', sponsor.address.postTown);
//     await I.fillField('#sponsorAddress__detailPostTown', sponsor.address.postTown);
       await this.page.fill('#sponsorAddress__detailPostCode', sponsor.address.postcode);
//     await I.fillField('#sponsorAddress__detailPostCode', sponsor.address.postcode);
       await this.page.fill('#sponsorAddress__detailCountry', sponsor.address.country);
//     await I.fillField('#sponsorAddress__detailCountry', sponsor.address.country);
       await this.continueButton.click();
//     await I.clickContinue();
//
//     await I.runAccessibilityCheck('SponsorContactPreferencePage');
     if (emailSms === 'email') {
         await this.page.check('#sponsorContactPreference-wantsEmail');
//       await I.checkOption('#sponsorContactPreference-wantsEmail');
         await this.page.fill('#sponsorEmail', sponsor.email);
//       await I.fillField('#sponsorEmail', sponsor.email);
     } else {
         await this.page.check('#sponsorContactPreference-wantsSms');
//       await I.checkOption('#sponsorContactPreference-wantsSms');
         await this.page.fill('#sponsorMobileNumber', sponsor.mobile);
//       await I.fillField('#sponsorMobileNumber', sponsor.mobile);
     }
     await this.continueButton.click();
//     await I.clickContinue();
//     await I.runAccessibilityCheck('SponsorAuthorisationPage');
     await this.page.check(`#sponsorAuthorisation_${authorisation}`);
//     await I.checkOption(`#sponsorAuthorisation_${authorisation}`);
     await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async hasDeportationOrder(hasDeportOrder: string = 'No') {
//     await I.runAccessibilityCheck('DeportationPage');
       await this.page.check(`#deportationOrderOptions_${hasDeportOrder}`);
//     await I.click(`#deportationOrderOptions_${hasDeportOrder}`);
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
   async hasRemovalDirections(hasRemovalOrder: string = 'No') {
       await this.page.check(`#removalOrderOptions_${hasRemovalOrder}`);
//     await I.click(`#removalOrderOptions_${hasRemovalOrder}`);
//
     if (hasRemovalOrder === 'Yes') {
         await this.page.fill('#removalOrderDate-day', appellant.removalDirections.date.day.toString());
//       await I.fillField('#removalOrderDate-day', appellant.removalDirections.date.day);
         await this.page.fill('#removalOrderDate-month', appellant.removalDirections.date.month.toString());
//       await I.fillField('#removalOrderDate-month', appellant.removalDirections.date.month);
         await this.page.fill('#removalOrderDate-year', appellant.removalDirections.date.year.toString());
//       await I.fillField('#removalOrderDate-year', appellant.removalDirections.date.year);
         await this.page.fill('#removalOrderDate-hour', appellant.removalDirections.time.hour24.toString());
//       await I.fillField('#removalOrderDate-hour', appellant.removalDirections.time.hour24);
         await this.page.fill('#removalOrderDate-minute', appellant.removalDirections.time.minutesWithLeadingZero.toString());
//       await I.fillField('#removalOrderDate-minute', appellant.removalDirections.time.minutesWithLeadingZero);
         await this.page.fill('#removalOrderDate-second', appellant.removalDirections.time.secondsWithLeadingZero.toString());
//       await I.fillField('#removalOrderDate-second', appellant.removalDirections.time.secondsWithLeadingZero);
     }
//     await I.runAccessibilityCheck('RemovalDirectionsPage');
       await this.continueButton.click();
//     await I.clickContinue();
   }
//
//   // uploadAppealDocs() - For Legal Admin journey
//   async uploadAppealDocs() {
//     await I.runAccessibilityCheck('UploadAppealDocumentation');
//     await I.click('Add new');
//     await I.attachFile('#uploadTheAppealFormDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
//     await I.fillField('#uploadTheAppealFormDocs_0_description', 'Appeal document.');
//     await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
//     await I.clickContinue();
//   }
//
//
//
   async hasNewMatters(hasMatters: string = 'No') {
       await this.page.check(`#hasNewMatters_${hasMatters}`);
//     await I.click(`#hasNewMatters_${hasMatters}`);
       if (hasMatters === 'Yes') {
           await this.page.fill('#newMatters', 'New matters test text.');
//       await I.fillField('#newMatters', 'New matters test text.');
     }
//     await I.runAccessibilityCheck('NewMattersPage');
       await this.continueButton.click();
//     await I.clickContinue();
   }

   async hasOtherAppeals(otherAppeals: string = 'No') {
       await this.page.check(`#hasOtherAppeals-${otherAppeals}`);
//     await I.click(`#hasOtherAppeals-${otherAppeals}`);
       if (otherAppeals != 'No') {
//       // TODO: Needs other options added
       }
//     await I.runAccessibilityCheck('OtherAppealsPage');
       await this.continueButton.click();
//     await I.clickContinue();
   }

   async setLegalRepresentativeDetails() {
//     await I.runAccessibilityCheck('LegalRepresentativeDetailsPage');
       await this.page.fill('#legalRepCompany', legalRepresentative.company);
//     await I.fillField('#legalRepCompany', legalRepresentative.company);
       await this.page.fill('#legalRepName', legalRepresentative.name);
//     await I.fillField('#legalRepName', legalRepresentative.name);
       await this.page.fill('#legalRepFamilyName', legalRepresentative.familyName);
//     await I.fillField('#legalRepFamilyName', legalRepresentative.familyName);
       await this.page.fill('#legalRepMobilePhoneNumber', legalRepresentative.mobile);
//     await I.fillField('#legalRepMobilePhoneNumber', legalRepresentative.mobile);
       await this.page.fill('#legalRepReferenceNumber', legalRepresentative.reference);
//     await I.fillField('#legalRepReferenceNumber', legalRepresentative.reference);
       await this.continueButton.click();
//     await I.clickContinue();
   }

   async isHearingRequired(hearingRequired: boolean = true) {
//     await I.runAccessibilityCheck('HearingRequiredPage');
       if (hearingRequired) {
           await this.page.check("//input[contains(@id,'decisionWithHearing')]")
//         await I.click("//input[contains(@id,'decisionWithHearing')]");
       } else {
           await this.page.check("//input[contains(@id,decisionWithoutHearing')]")
//         await I.click("//input[contains(@id,decisionWithoutHearing')]");
       }
       await this.continueButton.click();
//     await I.clickContinue();
   }

   async hasFeeRemission(feeRemission: string = 'No') {
//     // TODO: Needs other options added
//     await I.runAccessibilityCheck('FeeRemissionPage');
     switch (feeRemission) {
         case 'No':
             await this.page.check('#remissionType-noRemission');
//         await I.click('#remissionType-noRemission');
         break;
     }
       await this.continueButton.click();
//     await I.clickContinue();
   }

   // Only valid for appeal type: Refusal of protection claim
   async setPayNowLater(nowLater: string = 'Now') {
//     await I.runAccessibilityCheck('PayNowPage');
       await this.page.check(`#paAppealTypePaymentOption-pay${nowLater}`);
//     await I.click(`#paAppealTypePaymentOption-pay${nowLater}`);
       await this.continueButton.click();
//     await I.clickContinue();
   }

   async checkMyAnswers() {
       await this.continueButton.click();
//     await I.clickSaveAndContinue();
//
       if(['demo'].includes(runningEnv)) {

//       await I.waitForText('You have saved your appeal', 60);
//       await I.waitForText('You still need to submit it', 60);
           await this.clickCloseAndReturnToCaseDetails.click();
//       await I.clickCloseAndReturnToCaseDetails();
       }
   }
   //    }
   }
//
// // For inheritance
// //module.exports = new CreateAppeal();
// export = CreateAppeal;
