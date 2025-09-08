import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class EndTheAppeal {
    private buttonHelper: ButtonHelper;
    readonly endAppealButton = this.page.getByRole('button', { name: 'End appeal'});

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async end(outcome: string = 'No valid appeal', approverType: string = 'Case Worker') {
        await new PageHelper(this.page).selectNextStep('End the appeal');
        await this.page.getByLabel(outcome).check();
        await this.page.fill('#endAppealOutcomeReason', 'Test appeal outcome text.');
        await this.buttonHelper.continueButton.click();

        await this.page.getByLabel(approverType).check();
        await this.page.fill('#endAppealApproverName', approverType === 'Case Worker' ? 'Case_Worker_fn Case_Worker_ln' : 'Judge_fn Judge_ln');
        await this.buttonHelper.continueButton.click();
        await this.endAppealButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}