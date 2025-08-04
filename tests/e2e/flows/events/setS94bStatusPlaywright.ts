import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class S94b {
    private buttonHelper: ButtonHelper;
    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async setStatus(isS94b: string = 'Yes'){
        await new PageHelper(this.page).selectNextStep('Update s94b status');
       // await I.selectNextStep('Update s94b status');
       // await I.waitForElement(`#s94bStatus_${isS94b}`, 60);
        await this.page.check(`#s94bStatus_${isS94b}`);
        //await I.click(`#s94bStatus_${isS94b}`);
        await this.buttonHelper.continueButton.click();
        //await I.clickContinue();
        await this.buttonHelper.submitButton.click();
        //await I.clickSubmit();
    }
}
