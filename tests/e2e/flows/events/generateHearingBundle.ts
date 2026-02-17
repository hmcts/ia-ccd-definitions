import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class GenerateHearingBundle {
    private buttonHelper: ButtonHelper;
    readonly generateButton = this.page.getByRole('button', { name: 'Generate'});

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(){
        await new PageHelper(this.page).selectNextStep('Generate hearing bundle');
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
}
