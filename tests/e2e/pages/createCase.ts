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

  async createCase(){
    console.log('1');

    await I.waitForText(this.createCaseLink, 60);
    console.log('2');

    await I.forceClick(this.createCaseLink,);
    console.log('3');

    await I.waitForText(this.createCaseLink, 60);
    console.log('4');

    await I.selectOption(this.jurisdictionLocator, this.jurisdictionCode);
    console.log('5');

    await I.selectOption(this.caseTypeLocator, this.caseTypeCode);
    await I.selectOption(this.eventLocator, this.eventCode);
    await I.waitForEnabled('Start',60);
    await I.forceClick('Start');

}

// For inheritance
//module.exports = new loginPage();
export = createCasePage;
