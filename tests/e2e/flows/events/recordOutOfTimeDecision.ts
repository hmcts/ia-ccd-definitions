import { Page } from '@playwright/test';
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from '../../../helpers/ButtonHelper';

export class RecordOutOfTimeDecision {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly removeDetainedStatusButton = this.page.getByRole('button', { name: 'Remove detained status' });

    async submit(decision: string = 'approved') { //inTime, approved, rejected
        await new PageHelper(this.page).selectNextStep('Record out of time decision');
        await this.page.check(`#outOfTimeDecisionType-${decision}`);
        await this.page.locator('#outOfTimeDecisionDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_2.pdf');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

 }