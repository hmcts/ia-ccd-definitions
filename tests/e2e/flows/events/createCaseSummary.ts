import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class CreateCaseSummary {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async create() {
        await new PageHelper(this.page).selectNextStep('Create case summary');
        await this.page.setInputFiles('#caseSummaryDocument','./tests/documents/TEST_DOCUMENT_4.pdf');
        await this.page.fill('#caseSummaryDescription', 'Test case summary description.');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.uploadButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}