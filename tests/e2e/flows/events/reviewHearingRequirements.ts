import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class ReviewHearingRequirements {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Review hearing requirements');
        await this.buttonHelper.continueButton.click(); // review hearing requirements page
        await this.remoteHearingDecision('Refused');
        await this.buttonHelper.continueButton.click(); // any health conditions
        await this.buttonHelper.continueButton.click(); // multimedia evidence
        await this.buttonHelper.continueButton.click(); // Single sex court
        await this.buttonHelper.continueButton.click(); // Camera required
        await this.buttonHelper.continueButton.click(); // Any other requests
        await this.typeOfHearingRequired('INTER');
        await this.isSuitableToFloat('No');
        await this.areThereAdditionalInstructions('No');
        await await this.buttonHelper.submitButton.click() // CYA
        await await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };

    async remoteHearingDecision(grantedRefused: string = 'Granted') {
        await this.page.locator(`#isRemoteHearingAllowed-${grantedRefused}`).check();
        await this.page.locator('#remoteVideoCallTribunalResponse').fill('Test description of Tribunal response.');
        await this.buttonHelper.continueButton.click();
    };

    async typeOfHearingRequired(option: string = 'INTER') {
        await this.page.locator(`#hearingChannel_${option}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isSuitableToFloat(isSuitable: string = 'Yes') {
        await this.page.locator(`#isAppealSuitableToFloat_${isSuitable}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async areThereAdditionalInstructions(additionalInstructions: string = 'Yes') {
        await this.page.locator(`#isAdditionalInstructionAllowed_${additionalInstructions}`).check();

        if (additionalInstructions === 'Yes') {
            await await this.page.locator('#additionalInstructionsTribunalResponse').fill('Test additional instructions for Tribunal response.');
        }

        await this.buttonHelper.continueButton.click();
    }
}