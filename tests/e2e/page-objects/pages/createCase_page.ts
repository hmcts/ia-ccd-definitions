import {createCase} from '../detainedConfig'
import {Page} from "@playwright/test";
//const { I } = inject();

export class CreateCasePage {
  private jurisdictionLocator: string;
  private caseTypeLocator: string;
  private caseTypeOptionLocator: string;
  private eventLocator: string;


  constructor(public page: Page) {
    this.jurisdictionLocator = '#cc-jurisdiction';
    this.caseTypeLocator = '#cc-case-type';
    this.caseTypeOptionLocator = '//*[@id="cc-case-type"]/option';
    this.eventLocator = '#cc-event';
  }

  readonly createCaseLink = this.page.getByRole('link', { name: 'Create case' });
  readonly startButton = this.page.getByRole('button', { name: 'Start' })

  async createCase() {
    await this.createCaseLink.click();
    await this.startButton.click();
    await this.page.waitForTimeout(10000); // waits for 3 seconds
  }
}

// For inheritance
//module.exports = new loginPage();
//export = CreateCasePage;
