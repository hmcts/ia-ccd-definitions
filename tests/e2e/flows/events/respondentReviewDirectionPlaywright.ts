import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";
import {ValidationHelper} from "../../helpers/ValidationHelper";

export class RespondentReviewDirection {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Request respondent review');
        await new ValidationHelper(this.page).validateComplyDate(7);
        await this.buttonHelper.continueButton.click();
        await this.buttonHelper.sendDirectionButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
 }