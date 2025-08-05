import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class BuildYourCase {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async build() {
        await new PageHelper(this.page).selectNextStep('Build your case');
        await this.page.locator('#caseArgumentDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_3.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}