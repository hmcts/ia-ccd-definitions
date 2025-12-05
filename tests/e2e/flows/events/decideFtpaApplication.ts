import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class DecideFtpaApplication {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(party: string = 'Appellant') {
        await new PageHelper(this.page).selectNextStep('Decide FTPA application');

        await this.page.check(`#ftpaApplicantType-${party.toLowerCase()}`);
        await this.buttonHelper.continueButton.click();

        // TODO Needs all the options added
        await this.page.check(`#ftpa${party}RjDecisionOutcomeType-granted`);
        await this.buttonHelper.continueButton.click();
        await this.page.locator(`#ftpaApplication${party}Document`).setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.page.check(`#isFtpa${party}NoticeOfDecisionSetAside_No`);
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.continueButton.click();  //Notes for upper tribunal
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}