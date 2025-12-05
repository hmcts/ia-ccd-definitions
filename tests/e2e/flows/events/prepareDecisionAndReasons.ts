import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";
import { legalRepresentative } from "../../iacConfig";

export class PrepareDecisionAndReasons {
    private buttonHelper: ButtonHelper;
    readonly generateButton = this.page.getByRole('button', { name: 'Generate' });


    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async generate(anonymityOrder: string = 'Yes') {
        await new PageHelper(this.page).selectNextStep('Prepare Decision and Reasons');
        await this.page.check(`#anonymityOrder_${anonymityOrder}`);
        await this.buttonHelper.continueButton.click();
        await this.page.fill('#appellantRepresentative', legalRepresentative.name + ' ' + legalRepresentative.familyName);
        await this.page.fill('#respondentRepresentative', 'HO Leg Rep');
        await this.buttonHelper.continueButton.click();
        await this.generateButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}