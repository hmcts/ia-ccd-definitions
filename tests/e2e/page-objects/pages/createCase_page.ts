import {Page} from "@playwright/test";

export class CreateCasePage {
  private jurisdictionLocator: string;
  private caseTypeLocator: string;
  private caseTypeOptionLocator: string;
  private eventLocator: string;


  constructor(public page: Page) {}

  readonly createCaseLink = this.page.getByRole('link', { name: 'Create case' });
  readonly startButton = this.page.getByRole('button', { name: 'Start' })

  async createCase() {
    await this.createCaseLink.click();
    await this.startButton.click();
//    await this.page.waitForTimeout(10000); // waits for 3 seconds
  }
}
