const { I } = inject();

class retrieveCasePage {

  constructor() {

    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  async getCase(caseId: string){
    await I.waitForText('My work', 60);
    await I.fillField('#caseReference', caseId);
    await I.click('Find');
    await I.wait(10);
  }
}

// For inheritance
//module.exports = new loginPage();
export = retrieveCasePage;
