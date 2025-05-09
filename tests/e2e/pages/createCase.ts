const { I } = inject();

class createCasePage {
  private createCaseLink: string;
  private jurisdictionLocator: string;
  private jurisdictionCode: string;
  private caseTypeLocator: string;
  private caseTypeCode: string;
  private eventLocator: string;
  private eventCode: string;

  constructor() {
    this.createCaseLink = 'Create case';
    this.jurisdictionLocator = '#cc-jurisdiction';
    this.jurisdictionCode = 'IA';
    this.caseTypeLocator = '#cc-case-type';
    this.caseTypeCode = 'Asylum';
    this.eventLocator = '#cc-event';
    this.eventCode = 'startAppeal';
console.log('constuctor fired');
    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  async createCase() {
    await I.waitForText('Case list', 60);
    await I.forceClick(this.createCaseLink,);
    await I.waitForText(this.createCaseLink, 60);
    await I.selectOption(this.jurisdictionLocator, this.jurisdictionCode);
    await I.selectOption(this.caseTypeLocator, this.caseTypeCode);
    await I.selectOption(this.eventLocator, this.eventCode);
    await I.forceClick('Start');
  }
}

// For inheritance
//module.exports = new loginPage();
export = createCasePage;
