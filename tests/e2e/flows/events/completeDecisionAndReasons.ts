import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class CompleteDecisionAndReasons {
    private buttonHelper: ButtonHelper;
    readonly generateButton = this.page.getByRole('button', { name: 'Generate' });


    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async upload(decision: string = 'allowed') {
        await new PageHelper(this.page).selectNextStep('Complete decision and reasons');
        await this.page.check(`#isDecisionAllowed-${decision}`);
        await this.buttonHelper.continueButton.click();
        await this.page.locator('#finalDecisionAndReasonsDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.page.check('#isDocumentSignedToday_values-isDocumentSignedToday');
        await this.page.check('#isFeeConsistentWithDecision_values-isFeeConsistentWithDecision');
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.uploadButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}