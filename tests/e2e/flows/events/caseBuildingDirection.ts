import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class CaseBuildingDirection {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Request case building');
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.sendDirectionButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}