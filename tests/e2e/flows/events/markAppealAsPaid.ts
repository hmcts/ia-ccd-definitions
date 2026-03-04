import { Page } from '@playwright/test';
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from '../../../helpers/ButtonHelper';
import moment from "moment/moment";

export class MarkAppealAsPaid {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly markAsPaidButton = this.page.getByRole('button', { name: 'Mark as paid' });

    async recordPayment(){
        const yesterday = moment().subtract(1, 'days');
        await new PageHelper(this.page).selectNextStep('Mark appeal as paid');

        await this.page.fill('#paidAmount', '140.00');
        await this.page.fill('#paidDate-day', yesterday.date().toString());
        await this.page.fill('#paidDate-month', (yesterday.month()+1).toString());
        await this.page.fill('#paidDate-year', yesterday.year().toString());
        await this.page.fill('#additionalPaymentInfo', 'Additional payment info test text.');
        await this.buttonHelper.continueButton.click();
        await this.markAsPaidButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
}
