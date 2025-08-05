import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ValidationHelper} from "../../helpers/ValidationHelper";
import { ButtonHelper} from "../../helpers/ButtonHelper";

export class RespondentEvidenceDirection {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Request respondent evidence');
        //await I.selectNextStep('Request respondent evidence');
        //await I.waitForText('Explain the direction you are issuing', 60);
        await new ValidationHelper(this.page).validateComplyDate(7);
        // await I.validateComplyDate(7);
        await this.buttonHelper.continueButton.click();
        //await I.clickContinue();
        await this.buttonHelper.sendDirectionButton.click();
        //await I.clickSendDirection();
        //await I.waitForText('You have sent a direction');
    };
}