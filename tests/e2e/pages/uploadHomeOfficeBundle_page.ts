const { I } = inject();

class ServiceRequestPage {

  constructor() {


    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  async uploadBundle(){
    await I.waitForElement('//*[@id="homeOfficeBundle"]/div/button', 60);
    await I.click('Add new');
    await I.attachFile('#homeOfficeBundle_0_document', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.fillField('#homeOfficeBundle_0_description', 'Test Home Office Bundle.');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
    await I.clickButtonOrLink('Upload');
    await I.waitForText('You\'ve uploaded the Home Office bundle', 60);
    await I.clickCloseAndReturnToCaseDetails();
  }
}

// For inheritance
//module.exports = new serviceRequestPage();
export = ServiceRequestPage;
