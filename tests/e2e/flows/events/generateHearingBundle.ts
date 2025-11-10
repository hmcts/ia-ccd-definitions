import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";
import { runningEnv } from "../../detainedConfig";

export class GenerateHearingBundle {
    private buttonHelper: ButtonHelper;
    readonly generateButton = this.page.getByRole('button', { name: 'Generate'});

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(){
        await new PageHelper(this.page).selectNextStep('Generate hearing bundle');
        if (['preview', 'demo'].includes(runningEnv)) {
            await this.buttonHelper.submitButton.click();
        } else {
            await this.generateButton.click();
        }
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
}
