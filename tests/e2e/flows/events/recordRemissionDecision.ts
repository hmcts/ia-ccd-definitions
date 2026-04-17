import { Page } from '@playwright/test';
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from '../../../helpers/ButtonHelper';

export class RecordRemissionDecision {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly recordDecisionButton = this.page.getByRole('button', { name: 'Record decision' });

    async submit(decision: string = 'approved') { //inTime, approved, rejected
        await new PageHelper(this.page).selectNextStep('Record remission decision');
        await this.page.check(`#remissionDecision-${decision}`);
        await this.buttonHelper.continueButton.click();

        if (decision === 'approved' || decision === 'partiallyApproved') {
            await this.page.fill('#amountRemitted', '140.00');
            await this.page.fill('#amountLeftToPay', '0.00');

            if (decision === 'partiallyApproved') {
                await this.page.fill('#remissionDecisionReason', 'Reason why it is only partial - test text.');
            }
        } else { //rejected
            await this.page.fill('#remissionDecisionReason', 'Reason why it is rejected - test text.');
        }

        await this.buttonHelper.continueButton.click();
        await this.recordDecisionButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

 }