import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class ForceCaseHearingReqs {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Force case - hearing reqs');
        await this.page.fill('#reasonToForceCaseToSubmitHearingRequirements','Test Force case - hearing reqs Reason.')
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}