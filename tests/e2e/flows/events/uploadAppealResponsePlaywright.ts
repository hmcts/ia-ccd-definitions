import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class UploadAppealResponse {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async upload() {
        await new PageHelper(this.page).selectNextStep('Upload the appeal response');

        await this.page.locator('#appealReviewOutcome-decisionMaintained').check();
        await this.buttonHelper.continueButton.click();
        await this.page.locator('#homeOfficeAppealResponseDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_4.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.page.waitForTimeout(2000); // waits for 2 seconds otherwise uploadButton click fails
        await this.buttonHelper.uploadButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}