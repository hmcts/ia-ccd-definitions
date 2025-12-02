import { Page } from "@playwright/test";

export class CreateCasePage {
  private jurisdictionLocator: string;
  private caseTypeLocator: string;
  private caseTypeOptionLocator: string;
  private eventLocator: string;


  constructor(public page: Page) {}

  readonly createCaseLink = this.page.getByRole('link', { name: 'Create case' });
  readonly startButton = this.page.getByRole('button', { name: 'Start' })


  async createCase() {
    const caseType = this.page.locator('#cc-case-type');

    await this.createCaseLink.click();
 await caseType.selectOption('Asylum');
    // On Demo we have to manually select the options as there are a number of them for Jurisdiction
    // if (!['preview'].includes(runningEnv)) {
    //   await jurisdiction.selectOption('IA');
    //   await caseType.selectOption('Asylum');
    // }
    await this.startButton.click();
  }
}
