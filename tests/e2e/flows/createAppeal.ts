import moment, {Moment} from "moment/moment";

const { I } = inject();
import {appellant, legalRepresentative} from '../detainedConfig'

class createAppeal {

  constructor() {
    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

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

  async setHomeOfficeSetails() {
    const yesterday = moment().subtract(1, 'days');

    await I.fillField('#homeOfficeReferenceNumber', '12345');
    await I.fillField('#homeOfficeDecisionDate-day', yesterday.date());
    await I.fillField('#homeOfficeDecisionDate-month', yesterday.month()+1);
    await I.fillField('#homeOfficeDecisionDate-year', yesterday.year());
    await I.clickContinue();
  }

  async uploadNoticeOfDecision() {
    await I.click('Add new');
    await I.attachFile('#uploadTheNoticeOfDecisionDocs_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision docunment.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
  }

  async setTypeOfAppeal(appealType: string = 'EEA'){
    switch (appealType) {
      case 'EEA':
        await I.click('#appealType-refusalOfEu');
        await I.clickContinue();
        await this.groundsOfAppeal();
        break;
    }
  }

  async groundsOfAppeal() {
    await I.click('#appealGroundsEuRefusal_values-appealGroundsEuRefusal');
    await I.clickContinue();
  }

  async setAppellantBasicDetails() {
    await I.fillField('#appellantTitle', appellant.title);
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

  async hasSponsor(isSponsored: string = 'No'){
     await I.click(`#hasSponsor_${isSponsored}`);
     await I.clickContinue();
  }

  async hasDepotationOrder(hasDeportOrder: string = 'No') {
    await I.click(`#deportationOrderOptions_${hasDeportOrder}`);
    await I.clickContinue();
  }

  async hasRemovalOrder(hasRemoveOrder: string = 'No') {
    await I.click(`#removalOrderOptions_${hasRemoveOrder}`);
    await I.clickContinue();
  }

  async hasNewMatters(hasMatters: string = 'No') {
    await I.click(`#hasNewMatters_${hasMatters}`);
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
    await I.waitForText('DRAFT',60);
  }

  async agreeToDeclaration() {
    await I.waitForText('Declaration',60);
    await I.click('#legalRepDeclaration');
    await I.click('Submit');
    await I.waitForText('Your appeal has been submitted',60)
  }

}

// For inheritance
//module.exports = new detentionPage();
export = createAppeal;
