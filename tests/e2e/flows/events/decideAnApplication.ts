import { Page } from '@playwright/test';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';

export class DecideAnApplication {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(decision:string = 'Granted') {
        await new PageHelper(this.page).selectNextStep('Decide an application');
        await this.buttonHelper.continueButton.click(); // Chose the first in the list (which is defaulted)
        await this.page.check(`#makeAnApplicationDecision-${decision}`);
        await this.page.fill('#makeAnApplicationDecisionReason', `Test ${decision} decision for an application text.`);
        await this.buttonHelper.continueButton.click();
        await this.page.getByRole('button', { name: 'Record decision' }).click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
 }