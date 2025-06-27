import {createCase} from '../detainedConfig'
const { I } = inject();

class createCasePage {
  private createCaseLink: string;
  private jurisdictionLocator: string;
  private caseTypeLocator: string;
  private caseTypeOptionLocator: string;
  private eventLocator: string;


  constructor() {
    this.createCaseLink = 'Create case';
    this.jurisdictionLocator = '#cc-jurisdiction';
    this.caseTypeLocator = '#cc-case-type';
    this.caseTypeOptionLocator = '//*[@id="cc-case-type"]/option';
    this.eventLocator = '#cc-event';
  }

  async createCase() {
    await I.waitForText('Create Case', 60);
    await I.clickButtonOrLink(this.createCaseLink,);
    await I.waitForText(this.createCaseLink, 60);
    await I.wait(3);

    if (await I.grabValueFrom(this.eventLocator) !== createCase.eventCode) {
      await I.selectOption(this.jurisdictionLocator, createCase.jurisdictionCode);

      let listOfValues: string[] = await I.grabAttributeFromAll(this.caseTypeOptionLocator, 'value');
      for (const value of listOfValues) {
        const idx: number = listOfValues.indexOf(value);
        if (value === createCase.caseTypeCode){
          await I.selectOption(this.caseTypeLocator, await I.grabTextFrom(locate(this.caseTypeOptionLocator).at(idx+1)));
        }
      }

      await I.selectOption(this.eventLocator, createCase.eventCode);
    }

    await I.clickStart();
  }
}

// For inheritance
//module.exports = new loginPage();
export = createCasePage;
