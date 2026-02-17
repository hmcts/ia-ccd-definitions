import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class ApplyForPermissionToAppeal {
    private buttonHelper: ButtonHelper;
    readonly addNewButtonAppellant = this.page.locator('//*[@id="ftpaAppellantGroundsDocuments"]/div/button');
    readonly addNewButtonRespondent = this.page.locator('//*[@id="ftpaRespondentGroundsDocuments"]/div/button');

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async apply(party: string = 'Appellant') {
        await new PageHelper(this.page).selectNextStep('Apply for permission to appeal');
        if (party === 'Appellant') {
            await this.addNewButtonAppellant.click();
        } else {
            await this.addNewButtonRespondent.click();
        }

        await this.page.locator(`#ftpa${party}GroundsDocuments_0_document`).setInputFiles('./tests/documents/TEST_DOCUMENT_4.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.page.fill(`#ftpa${party}GroundsDocuments_0_description`, `Test FTPA Grounds of the application text for ${party}.`);
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}