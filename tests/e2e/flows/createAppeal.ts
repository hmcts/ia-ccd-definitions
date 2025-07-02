import moment from "moment/moment";
import {appellant, legalRepresentative, sponsor, runningEnv} from '../detainedConfig'
// @ts-ignore
import {detentionFacility} from '../fixtures/detentionFacilities'

const { I } = inject();
//const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';

class CreateAppeal {

  constructor() {
    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  // setTribunalAppealReceived() - Legal Admin Journey
  async setTribunalAppealReceived() {
    const yesterday = moment().subtract(1, 'days');
    await I.runAccessibilityCheck('TribunalAppealReceivedDate');
    await I.fillField('#tribunalReceivedDate-day', yesterday.date());
    await I.fillField('#tribunalReceivedDate-month', yesterday.month()+1);
    await I.fillField('#tribunalReceivedDate-year', yesterday.year());
    await I.clickContinue();
  }

  // appellantInPerson() - Legal Admin Journey
  async appellantInPerson(yesNo: string = 'Yes', hasPostalAddress: string = 'Yes') {
    await I.click(`#appellantsRepresentation-${yesNo}`);
    
    if (yesNo === 'No') {
      await I.clickContinue();
      await I.fillField('#appealWasNotSubmittedReason', 'Reason why appeal was not submitted on MyHMCTS');
      await I.click('Add new');
      await I.attachFile('#appealNotSubmittedReasonDocuments_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
      await I.fillField('#appealNotSubmittedReasonDocuments_0_description', 'Supporting document test');
      await I.waitForInvisible(locate('.error-message').withText('Uploading...'), 20);
      await I.runAccessibilityCheck('ReasonNotSubmittedOnHMCTS');
      await I.clickContinue();

      await I.waitForText('Legal representative details', 60);
      await I.fillField('#legalRepCompanyPaperJ', legalRepresentative.company);
      await I.fillField('#legalRepGivenName', legalRepresentative.name);
      await I.fillField('#legalRepFamilyNamePaperJ', legalRepresentative.familyName);
      await I.fillField('#legalRepEmail', legalRepresentative.email);
      await I.fillField('#legalRepRefNumberPaperJ', legalRepresentative.reference);
      await I.runAccessibilityCheck('LegalRepresentativeDetails');
      await I.clickContinue();

      await I.waitForText('Legal representative address', 60);
      await I.click(`#legalRepHasAddress_${hasPostalAddress}`);
      await I.waitForElement('#legalRepAddressUK_legalRepAddressUK_postcodeInput');
      await I.fillField('#legalRepAddressUK_legalRepAddressUK_postcodeInput',  legalRepresentative.address.postcode);
      await I.click('//button[contains(text(), "Find address")]');
      await I.wait(2);
      await I.selectOption('#legalRepAddressUK_legalRepAddressUK_addressList', legalRepresentative.address.addressLine1); // First valid address
      await I.runAccessibilityCheck('LegalRepresentativeAddress');
      await I.clickContinue();

    } else {
      await I.clickContinue();
    }
  }

  async locationInUK(yesNo: string = 'Yes') {
    await I.runAccessibilityCheck('LocationPage');
    await I.click(`#appellantInUk_${yesNo}`);
    await I.clickContinue();
  }


  async outOfCountryDecision(appealDecision: string = 'refusalOfHumanRights', inTime: boolean = true) {
    let currentUrl: string;
    const inOutOfTimeDate = inTime
        ? moment().subtract(5, 'days')
        : moment().subtract(2, 'months');

    switch (appealDecision) {
      case 'refusalOfHumanRights':
        await I.click('#outOfCountryDecisionType-refusalOfHumanRights');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (currentUrl.includes('startAppealentryClearanceDecision')) {
          await I.fillField('#gwfReferenceNumber', '123456789');
          await I.fillField('#dateEntryClearanceDecision-day', inOutOfTimeDate.date().toString());
          await I.fillField('#dateEntryClearanceDecision-month', (inOutOfTimeDate.month() + 1).toString());
          await I.fillField('#dateEntryClearanceDecision-year', inOutOfTimeDate.year().toString());
          await I.clickContinue();
        }
        break;
      case 'refusalOfProtection':
        await I.click('#outOfCountryDecisionType-refusalOfProtection');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (currentUrl.includes('startAppealdepartureDate')) {
          await I.fillField('#dateClientLeaveUk-day', inOutOfTimeDate.date().toString());
          await I.fillField('#dateClientLeaveUk-month', (inOutOfTimeDate.month() + 1).toString());
          await I.fillField('#dateClientLeaveUk-year', inOutOfTimeDate.year().toString());
          await I.clickContinue();
          await this.setHomeOfficeDetails(inTime, 'decisionLetterReceivedDate');
        }
        break;
      case 'removalOfClient':
        await I.click('#outOfCountryDecisionType-removalOfClient');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (currentUrl.includes('startAppealhomeOfficeDecision')) {
          await I.fillField('#homeOfficeReferenceNumber', '123456789');
          await I.fillField('#day-label-decisionLetterReceivedDate-day', inOutOfTimeDate.date().toString());
          await I.fillField('#month-label-decisionLetterReceivedDate-month', (inOutOfTimeDate.month() + 1).toString());
          await I.fillField('#year-label-decisionLetterReceivedDate-year', inOutOfTimeDate.year().toString());
          await I.clickContinue();
          await this.setHomeOfficeDetails(inTime, 'decisionLetterReceivedDate');
        }
        break;
      case 'refusePermit':
        await I.click('#outOfCountryDecisionType-refusePermit');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (currentUrl.includes('startAppealentryClearanceDecision')) {
          await I.fillField('#gwfReferenceNumber', '123456789');
          await I.fillField('#dateEntryClearanceDecision-day', inOutOfTimeDate.date().toString());
          await I.fillField('#dateEntryClearanceDecision-month', (inOutOfTimeDate.month() + 1).toString());
          await I.fillField('#dateEntryClearanceDecision-year', inOutOfTimeDate.year().toString());
          await I.clickContinue();
        }
        break;
    }
  }

  async inDetention(yesNo: string = 'Yes') {
    await I.runAccessibilityCheck('InDententionPage');
    await I.click(`#appellantInDetention_${yesNo}`);
    await I.clickContinue();
  }

  async setDetentionLocation(detentionLocation: string = 'immigrationRemovalCentre', hasCustodialSentence: string = 'Yes') {
    await I.runAccessibilityCheck('DetentionLocationPage');
    switch (detentionLocation) {
      case 'immigrationRemovalCentre':
        await I.click(`#detentionFacility-${detentionLocation}`);
        await I.clickContinue();
        await this.setDetentionCentre();
        break;
      case 'prison':
        await I.click(`#detentionFacility-${detentionLocation}`);
        await I.waitForElement(`#prisonNOMSNumber_${detentionLocation}`, 60);
        await I.runAccessibilityCheck('DententionLocationPrisonNOMSPage');
        await I.fillField('#prisonNOMSNumber_prison', appellant.NOMSNumber)
        await I.runAccessibilityCheck('DententionLocationPrisonNOMSPage');
        await I.clickContinue();
        await I.selectOption('#prisonName', detentionFacility.prison.name);
        await I.runAccessibilityCheck('DententionLocationPrisonNamePage');
        await I.clickContinue();
        break;
      case 'other':
        await I.click(`#detentionFacility-${detentionLocation}`);
        await I.waitForVisible('#otherDetentionFacilityName_other', 60);
        await I.runAccessibilityCheck('DententionLocationOtherPage');
        await I.fillField('#otherDetentionFacilityName_other', 'Other facility test');
        await I.clickContinue();
        break;
    }
  }

   async setDetentionCentre() {
    await I.selectOption('#ircName', 'Brookhouse');
    await I.runAccessibilityCheck('DententionLocationIRCPage');
    await I.clickContinue();
  }

  async setCustodialSentence(hasCustodialSentence: string = 'Yes') {
    await I.click(`#releaseDateProvided_${hasCustodialSentence}`);

    if (hasCustodialSentence === 'Yes') {
      await I.fillField('#releaseDate-day', appellant.custodialSentence.day);
      await I.fillField('#releaseDate-month', appellant.custodialSentence.month);
      await I.fillField('#releaseDate-year', appellant.custodialSentence.year);
    }
    await I.runAccessibilityCheck('CustodialSentencePage');
    await I.clickContinue();
  }

  async setBailApplication(bail: string = "No") {
    // TODO: Needs other options added
    await I.click(`#hasPendingBailApplications-${bail}`);
    if (bail === 'Yes') {
      await I.waitForElement('#bailApplicationNumber', 60);
      await I.fillField('#bailApplicationNumber', appellant.bailApplicationNumber);
    }
    await I.runAccessibilityCheck('PendingBailApplicationPage');
    await I.clickContinue();
  }

  async setHomeOfficeDetails(inTime: boolean = true, fieldPrefix: string = 'homeOfficeDecisionDate') {
    const homeOfficeLetterDate = inTime
        ? moment().subtract(5, 'days')
        : moment().subtract(20, 'days');

    await I.runAccessibilityCheck('HomeOfficeDetailsPage');
    await I.fillField('#homeOfficeReferenceNumber', '12345');


    await I.fillField(`#${fieldPrefix}-day`, homeOfficeLetterDate.date().toString());
    await I.fillField(`#${fieldPrefix}-month`, (homeOfficeLetterDate.month() + 1).toString());
    await I.fillField(`#${fieldPrefix}-year`, homeOfficeLetterDate.year().toString());
    await I.clickContinue();
  }

  async uploadNoticeOfDecision() {
    await I.runAccessibilityCheck('UploadNoticeOfDecisionPage');
    await I.click('Add new');
    await I.attachFile('#uploadTheNoticeOfDecisionDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }

  async setTypeOfAppeal(appealType: string = 'EEA'){
    let currentUrl: string;
    await I.runAccessibilityCheck('TypeOfAppealPage');
    switch (appealType) {
      case 'EEA':
        await I.click('#appealType-refusalOfEu');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (!currentUrl.includes('BasicDetails')) {
          await this.groundsOfAppeal();
        }
        break;
      case 'RPS':
        await I.click('#appealType-revocationOfProtection');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (!currentUrl.includes('BasicDetails')) {
          await I.runAccessibilityCheck('TypeOfAppealRevocationHumanitarianProtectionOptionsPage');
          await I.click('#appealGroundsRevocation_values-revocationHumanitarianProtection');
          await I.clickContinue();
        }
        break;
      case 'RHR':
        await I.click('#appealType-refusalOfHumanRights');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (!currentUrl.includes('BasicDetails')) {
          await I.runAccessibilityCheck('TypeOfAppealHumanRightsRefusalOptionsPage');
          await I.click('#appealGroundsDecisionHumanRightsRefusal_values-humanRightsRefusal');
          await I.clickContinue();
        }
        break;
      case 'DC':
        await I.click('#appealType-deprivation');
        await I.clickContinue();
        currentUrl = await I.grabCurrentUrl();
        if (!currentUrl.includes('BasicDetails')) {
          await I.runAccessibilityCheck('TypeOfAppealDeprivationOptionsPage');
          await I.checkOption('#appealGroundsDeprivation_values-disproportionateDeprivation');
          await I.clickContinue();
        }
        break;
      case 'EU':
        await I.click('#appealType-euSettlementScheme');
        await I.clickContinue();
        break;
      case 'RPC':
        await I.click('#appealType-protection');
        await I.clickContinue()
        await I.runAccessibilityCheck('TypeOfAppealHumanitarianProtectionOptionsPage');
        await I.click('#appealGroundsProtection_values-protectionHumanitarianProtection');
        await I.clickContinue();
        break;
    }
  }

  // appellantDetails() - Legal Admin journey only
  async appellantDetails() {
    await I.fillField('#internalAppellantMobileNumber', appellant.mobile);
    await I.fillField('#internalAppellantEmail', appellant.email);
    await I.runAccessibilityCheck('AppellantDetails');
    await I.clickContinue();
  }

  // appellant contact preference: non-detained journey only
  async setAppellentContactPreference(preference: string = 'EMAIL') {
    if (preference === 'EMAIL') {
      await I.click('#contactPreference-wantsEmail');
      await I.fillField('#email', appellant.email);
    } else {
      await I.click('#contactPreference-wantsSms');
      await I.fillField('#mobileNumber', appellant.mobile);
    }
    await I.clickContinue();
  }

  // appellant address: non-detained journey and detained journey where facility is "Other"
  async setAppellentsAddress(journeyType: string = "detained", hasPostalAddress: string = 'Yes', updateDetentionLocationEvent: boolean = false) {
    if (journeyType !== 'detained') {
      await I.click(`#appellantHasFixedAddress_${hasPostalAddress}`);
    }

    if (hasPostalAddress === 'Yes') {
      if (!updateDetentionLocationEvent) {
        await I.click('//*[@id="appellantAddress_appellantAddress"]/div/a');
      }
      await I.fillField('#appellantAddress__detailAddressLine1', appellant.address.addressLine1);
      await I.fillField('#appellantAddress__detailPostTown', appellant.address.postTown);
      await I.fillField('#appellantAddress__detailPostCode', appellant.address.postcode);
      await I.fillField('#appellantAddress__detailCountry', appellant.address.country);
    }
    await I.runAccessibilityCheck('AppellantAddressPage');
    await I.clickContinue();
}

  async setOutOfCountryAddress(hasAddress: 'Yes' | 'No' = 'Yes') {
    await I.click(`#hasCorrespondenceAddress_${hasAddress}`);

    if (hasAddress === 'Yes') {
      const outOfCountryAddress = '123 Example Street, Example City, Example Country, AB12 3CD';
      await I.fillField('#appellantOutOfCountryAddress', outOfCountryAddress);
    }

    await I.clickContinue();
  }

  async groundsOfAppeal() {
    await I.runAccessibilityCheck('TypeOfAppealRefusalOfEuOptionsPage');
    await I.click('#appealGroundsEuRefusal_values-appealGroundsEuRefusal');
    await I.clickContinue();
  }

  async setAppellantBasicDetails(minimalBasicDetails: boolean = false) {
    if (!minimalBasicDetails) {
      await I.fillField('#appellantTitle', appellant.title);
    }

    await I.fillField('#appellantGivenNames', appellant.givenNames);
    await I.fillField('#appellantFamilyName', appellant.familyName);
    await I.fillField('#appellantDateOfBirth-day', appellant.dob.day);
    await I.fillField('#appellantDateOfBirth-month', appellant.dob.month);
    await I.fillField('#appellantDateOfBirth-year', appellant.dob.year);
    await I.runAccessibilityCheck('AppellantBasicDetailsPage');
    await I.clickContinue();
  }

  async setNationality(hasNationality: boolean = true){
    if (hasNationality){
      await I.click('#appellantStateless-hasNationality');
      await I.click('Add new');
      await I.selectOption('#appellantNationalities_0_code', 'Finland');
    } else {
      await I.click('#appellantStateless-hasNationality');
    }
    await I.runAccessibilityCheck('AppellantNationalityPage');
    await I.clickContinue();
  }

  async hasSponsor(isSponsored: string = 'No', sponsorComms: string = 'email', sponsorAuthorised: string = 'Yes'){
    await I.runAccessibilityCheck('SponsorPage');
    await I.click(`#hasSponsor_${isSponsored}`);
    await I.clickContinue();

    if (isSponsored === 'Yes') {
      await this.setSponsor(sponsorComms, sponsorAuthorised);
    }

  }

  async setSponsor(emailSms: string, authorisation: string) {
    await I.runAccessibilityCheck('SponsorNames')
    await I.fillField('#sponsorGivenNames', sponsor.givenNames);
    await I.fillField('#sponsorFamilyName', sponsor.familyName);
    await I.clickContinue();
    await I.runAccessibilityCheck('SponsorAddress');
    await I.click('//*[@id="sponsorAddress_sponsorAddress"]/div/a');
    await I.fillField('#sponsorAddress__detailAddressLine1', sponsor.address.addressLine1);
    await I.fillField('#sponsorAddress__detailPostTown', sponsor.address.postTown);
    await I.fillField('#sponsorAddress__detailPostCode', sponsor.address.postcode);
    await I.fillField('#sponsorAddress__detailCountry', sponsor.address.country);
    await I.clickContinue();

    await I.runAccessibilityCheck('SponsorContactPreferencePage');
    if (emailSms === 'email') {
      await I.checkOption('#sponsorContactPreference-wantsEmail');
      await I.fillField('#sponsorEmail', sponsor.email);
    } else {
      await I.checkOption('#sponsorContactPreference-wantsSms');
      await I.fillField('#sponsorMobileNumber', sponsor.mobile);
    }
    await I.clickContinue();
    await I.runAccessibilityCheck('SponsorAuthorisationPage');
    await I.checkOption(`#sponsorAuthorisation_${authorisation}`);
    await I.clickContinue();
  }

  async hasDepotationOrder(hasDeportOrder: string = 'No') {
    await I.runAccessibilityCheck('DeportationPage');
    await I.click(`#deportationOrderOptions_${hasDeportOrder}`);
    await I.clickContinue();
  }

  async hasRemovalDirections(hasRemovalOrder: string = 'No') {
    await I.click(`#removalOrderOptions_${hasRemovalOrder}`);

    if (hasRemovalOrder === 'Yes') {
      await I.fillField('#removalOrderDate-day', appellant.removalDirections.date.day);
      await I.fillField('#removalOrderDate-month', appellant.removalDirections.date.month);
      await I.fillField('#removalOrderDate-year', appellant.removalDirections.date.year);
      await I.fillField('#removalOrderDate-hour', appellant.removalDirections.time.hour24);
      await I.fillField('#removalOrderDate-minute', appellant.removalDirections.time.minutesWithLeadingZero);
      await I.fillField('#removalOrderDate-second', appellant.removalDirections.time.secondsWithLeadingZero);
    }
    await I.runAccessibilityCheck('RemovalDirectionsPage');
    await I.clickContinue();
  }

  // uploadAppealDocs() - For Legal Admin journey
  async uploadAppealDocs() {
    await I.runAccessibilityCheck('UploadAppealDocumentation');
    await I.click('Add new');
    await I.attachFile('#uploadTheAppealFormDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#uploadTheAppealFormDocs_0_description', 'Appeal document.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }



  async hasNewMatters(hasMatters: string = 'No') {
    await I.click(`#hasNewMatters_${hasMatters}`);
    if (hasMatters === 'Yes') {
      await I.fillField('#newMatters', 'New matters test text.');
    }
    await I.runAccessibilityCheck('NewMattersPage');
    await I.clickContinue();
  }

  async hasOtherAppeals(otherAppeals: string = 'No') {
    // TODO: Needs other options added
    await I.runAccessibilityCheck('OtherAppealsPage');
    await I.click('#hasOtherAppeals-No');
    await I.clickContinue();
  }

  async setLegalRepresentativeDetails() {
    await I.runAccessibilityCheck('LegalRepresentativeDetailsPage');
    await I.fillField('#legalRepCompany', legalRepresentative.company);
    await I.fillField('#legalRepName', legalRepresentative.name);
    await I.fillField('#legalRepFamilyName', legalRepresentative.familyName);
    await I.fillField('#legalRepMobilePhoneNumber', legalRepresentative.mobile);
    await I.fillField('#legalRepReferenceNumber', legalRepresentative.reference);
    await I.clickContinue();
  }

  async isHearingRequired(hearingRequired: boolean = true) {
    await I.runAccessibilityCheck('HearingRequiredPage');
    if (hearingRequired) {
      await I.click("//input[contains(@id,'decisionWithHearing')]");
    } else {
      await I.click("//input[contains(@id,decisionWithoutHearing')]");
    }
    await I.clickContinue();
  }

  async hasFeeRemission(feeRemission: string = 'No') {
    // TODO: Needs other options added
    await I.runAccessibilityCheck('FeeRemissionPage');
    switch (feeRemission) {
      case 'No':
        await I.click('#remissionType-noRemission');
        break;
    }
    await I.clickContinue();
  }

  // Only valid for appeal type: Refusal of protection claim
  async setPayNowLater(nowLater: string = 'Now') {
    await I.runAccessibilityCheck('PayNowPage');
    await I.click(`#paAppealTypePaymentOption-pay${nowLater}`);
    await I.clickContinue();
  }

  async checkMyAnswers() {
    await I.clickSaveAndContinue();

    if(['demo'].includes(runningEnv)) {
      await I.waitForText('You have saved your appeal', 60);
      await I.waitForText('You still need to submit it', 60);
      await I.clickCloseAndReturnToCaseDetails();
    }
  }
}

// For inheritance
//module.exports = new CreateAppeal();
export = CreateAppeal;
