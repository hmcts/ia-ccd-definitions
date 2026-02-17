import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class RequestHearingRequirements {

    constructor(public page: Page) {
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Request Hearing requirements');
        await new ButtonHelper(this.page).submitButton.click();
    };
}