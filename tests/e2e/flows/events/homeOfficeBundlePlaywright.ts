import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class HomeOfficeBundle {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly uploadButton = this.page.getByRole('button', { name: 'Upload' });

    async upload() {
        await new PageHelper(this.page).selectNextStep('Upload Home Office bundle');
        await this.page.locator('button:text("Add new")').click();
        await this.page.locator('#homeOfficeBundle_0_document').setInputFiles('./tests/documents/TEST_DOCUMENT_2.pdf');
        await this.page.fill('#homeOfficeBundle_0_description', 'Test Notice of Decision document.');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.page.waitForTimeout(2000); // waits for 2 seconds otherwise uploadButton click fails
        await this.uploadButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}