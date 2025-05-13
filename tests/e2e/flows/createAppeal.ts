import moment, {Moment} from "moment/moment";
import {appellant, legalRepresentative, sponsor} from '../detainedConfig'

const { I } = inject();
const doutOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';

class createAppeal {

  constructor() {
    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  // setTribunalAppealReceived() - Legal Admin Journey
  async setTribunalAppealReceived() {
    const yesterday = moment().subtract(1, 'days');

    await I.fillField('#tribunalReceivedDate-day', yesterday.date());
    await I.fillField('#tribunalReceivedDate-month', yesterday.month()+1);
    await I.fillField('#tribunalReceivedDate-year', yesterday.year());
    await I.clickContinue();
  }

  // appellantInPerson() - Legal Admin Journey
  async appellantInPerson(yesNo: string = 'Yes') {
    await I.click(`#appellantsRepresentation-${yesNo}`);
    if (yesNo === 'No') {
      //TODO - add addition page call
    }
    await I.clickContinue();
  }

  async locationInUK(yesNo: string = 'Yes') {
    await I.click(`#appellantInUk_${yesNo}`);
    await I.clickContinue();
  }

  async inDetention(yesNo: string = 'Yes') {
    await I.click(`#appellantInDetention_${yesNo}`);
    await I.clickContinue();
  }

  async setDetentionLocation(detentionLocation: string = 'immigration') {
    switch (detentionLocation) {
      case 'immigration':
        console.log('immigration');
        await I.click('#detentionFacility-immigrationRemovalCentre');
        await I.clickContinue();
        await this.setDetentionCentre();
        await this.bailApplication('No');
        break;
      case 'prison':
        break;
      case 'other':
        break;
    }

  }

   async setDetentionCentre() {
    await I.selectOption('#ircName', 'Brookhouse');
    await I.clickContinue();
  }

  async bailApplication(bail: string = "No") {
    // TODO: Needs other options added
    await I.click('#hasPendingBailApplications-No');
    await I.clickContinue();
  }

  async setHomeOfficeSetails(inTime: boolean = true) {
    let homeOfficeLetterDate;
    if (inTime) {
      homeOfficeLetterDate = moment().subtract(5, 'days');
    } else {
      homeOfficeLetterDate = moment().subtract(20, 'days');
    }

    const yesterday = moment().subtract(1, 'days');

    await I.fillField('#homeOfficeReferenceNumber', '12345');
    await I.fillField('#homeOfficeDecisionDate-day', homeOfficeLetterDate.date());
    await I.fillField('#homeOfficeDecisionDate-month', homeOfficeLetterDate.month()+1);
    await I.fillField('#homeOfficeDecisionDate-year', homeOfficeLetterDate.year());
    await I.clickContinue();
  }

  async uploadNoticeOfDecision() {
    await I.click('Add new');
    await I.attachFile('#uploadTheNoticeOfDecisionDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }

  async setTypeOfAppeal(appealType: string = 'EEA'){
    switch (appealType) {
      case 'EEA':
        await I.click('#appealType-refusalOfEu');
        await I.clickContinue();
        let currentUrl: string = await I.grabCurrentUrl();

        if (!currentUrl.includes('BasicDetails')) {
          await this.groundsOfAppeal();
        }
        break;
    }
  }

  // appellantDetails() - Legal Admin journey only
  async appellantDetails() {
    await I.fillField('#internalAppellantMobileNumber', appellant.mobile);
    await I.fillField('#internalAppellantEmail', appellant.email);
    await I.clickContinue();
  }


  async groundsOfAppeal() {
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
    await I.clickContinue();
  }

  async hasSponsor(isSponsored: string = 'No', sponsorComms: string = 'email', sponsorAuthorised: string = 'Yes'){
    await I.click(`#hasSponsor_${isSponsored}`);
    await I.clickContinue();

    if (isSponsored === 'Yes') {
      await this.setSponsor(sponsorComms, sponsorAuthorised);
    }

  }

  async setSponsor(emailSms: string, authorisation: string) {
    await I.fillField('#sponsorGivenNames', sponsor.givenNames);
    await I.fillField('#sponsorFamilyName', sponsor.familyName);
    await I.clickContinue();

    await I.click('//*[@id="sponsorAddress_sponsorAddress"]/div/a');
    await I.fillField('#sponsorAddress__detailAddressLine1', sponsor.address.addressLine1);
    await I.fillField('#sponsorAddress__detailPostTown', sponsor.address.postTown);
    await I.fillField('#sponsorAddress__detailPostCode', sponsor.address.postcode);
    await I.fillField('#sponsorAddress__detailCountry', sponsor.address.country);
    await I.clickContinue();

    if (emailSms === 'email') {
      await I.checkOption('#sponsorContactPreference-wantsEmail');
      await I.fillField('#sponsorEmail', sponsor.email);
    } else {
      await I.checkOption('#sponsorContactPreference-wantsSms');
      await I.fillField('#sponsorMobileNumber', sponsor.mobile);
    }
    await I.clickContinue();

    await I.checkOption(`#sponsorAuthorisation_${authorisation}`);
    await I.clickContinue();
  }

  async hasDepotationOrder(hasDeportOrder: string = 'No') {
    await I.click(`#deportationOrderOptions_${hasDeportOrder}`);
    await I.clickContinue();
  }

  async hasRemovalDirections(hasRemovalOrder: string = 'No') {
    await I.click(`#removalOrderOptions_${hasRemovalOrder}`);

    if (hasRemovalOrder === 'Yes') {
      const todayPlus20Days = moment().add(20, 'days');
      await I.fillField('#removalOrderDate-day', todayPlus20Days.date());
      await I.fillField('#removalOrderDate-month', todayPlus20Days.month()+1);
      await I.fillField('#removalOrderDate-year', todayPlus20Days.year());
      await I.fillField('#removalOrderDate-hour', '14');
      await I.fillField('#removalOrderDate-minute', '30');
      await I.fillField('#removalOrderDate-second', '00');
    }
    await I.clickContinue();
  }

  // uploadAppealDocs() - For Legal Admin journey
  async uploadAppealDocs() {
    await I.click('Add new');
    await I.attachFile('#uploadTheAppealFormDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#uploadTheAppealFormDocs_0_description', 'Appeal document.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }



  async hasNewMatters(hasMatters: string = 'No') {
    await I.click(`#hasNewMatters_${hasMatters}`);
    if (hasMatters === 'Yes') {
      await I.fillField('#newMatters', 'New mateers test text.');
    }
    await I.clickContinue();
  }

  async hasOtherAppeals(otherAppeals: string = 'No') {
    // TODO: Needs other options added
    await I.click('#hasOtherAppeals-No');
    await I.clickContinue();
  }

  async setLegsRepresentatibecDetails() {
    await I.fillField('#legalRepCompany', legalRepresentative.company);
    await I.fillField('#legalRepName', legalRepresentative.name);
    await I.fillField('#legalRepFamilyName', legalRepresentative.familyName);
    await I.fillField('#legalRepMobilePhoneNumber', legalRepresentative.mobile);
    await I.fillField('#legalRepReferenceNumber', legalRepresentative.reference);
    await I.clickContinue();
  }

  async isHearingRequired(hearingRequired: boolean = true) {
    if (hearingRequired) {
      await I.click('#decisionHearingFeeOption-decisionWithHearing');
    } else {
      await I.click('#decisionHearingFeeOption-decisionWithoutHearing');
    }
    await I.clickContinue();
  }

  async hasFeeRemission(feeRemission: string = 'No') {
    // TODO: Needs other options added
    switch (feeRemission) {
      case 'No':
        await I.click('#remissionType-noRemission');
        break;
    }
    await I.clickContinue();
  }

  async checkMyAnswers() {
    // TODO: Needs other options added
    await I.clickSaveAndContinue();
    await I.waitForText('You have saved your appeal', 60);
    await I.waitForText('You still need to submit it',60);
  }

  // setAppealOutOfTime() Legal Admin journey
  async setAppealOutOfTime(){
    await I.waitForText('Reasons the appeal is late', 60);
    await I.fillField('#applicationOutOfTimeExplanation', 'Test explanation of why out of time.');
    await I.attachFile('#applicationOutOfTimeDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }

  async agreeToDeclaration(legalRepDeclaration: boolean = true, inTime: boolean = true) {
      await I.waitForText('Declaration',60);
      if (legalRepDeclaration) {
        await I.click('#legalRepDeclaration');
        await I.waitForText('Your appeal has been submitted',60)
      } else {
        await I.click('#adminDeclaration1-hasDeclared');
      }

    await I.clickButtonOrLink('Submit');
    if (legalRepDeclaration) {
      await I.waitForText('Your appeal has been submitted',60)
    } else if (inTime){
        await I.waitForText('The appeal has been submitted',60)
    } else {
      await I.isCorrectLabelDisplayed(doutOfTimedImageLocator, 'outOfTimeConfirmation');
    }
    await I.wait(5);
  }

}

// For inheritance
//module.exports = new detentionPage();
export = createAppeal;
