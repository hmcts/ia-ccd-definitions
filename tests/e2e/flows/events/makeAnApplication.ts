import { Page } from '@playwright/test';
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from '../../../helpers/ButtonHelper';

export class MakeAnApplication {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(applicationType:string = 'Expedite') {
        await new PageHelper(this.page).selectNextStep('Make an application');
        await this.page.selectOption('#makeAnApplicationTypes', applicationType);
        await this.buttonHelper.continueButton.click();
        await this.page.fill('#makeAnApplicationDetails', 'Test make an application (Expedite) text.');
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
 }