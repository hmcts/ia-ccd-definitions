import { Page } from "@playwright/test";
import { PageHelper } from "../../helpers/PageHelper";
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class CreateServiceRequest {
    private pageHelper: PageHelper;
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.pageHelper = new PageHelper(page);
        this.buttonHelper = new ButtonHelper(page);
    }

    async submit(){
        await this.pageHelper.selectNextStep('Create a service request');
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetails.click();
    }
}