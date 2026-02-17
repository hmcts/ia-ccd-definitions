import { Page } from '@playwright/test';
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from '../../../helpers/ButtonHelper';
import moment from "moment/moment";

export class ForceDecidedStateEvent {
    private buttonHelper: ButtonHelper;
    readonly forceToDecidedButton = this.page.getByRole('button', { name: ' Force to decided '});

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }


    async forceDecidedState(decision: string = 'allowed') {
        await this.whenAppealDecided();
        await this.whatDecision(decision);
        await this.checkMyAnswers();
    }

    async whenAppealDecided(){
        const yesterday = moment().subtract(1, 'days');

        await new PageHelper(this.page).selectNextStep('Force decided state');

        await this.page.fill('#appealDate-day', yesterday.date().toString());
        await this.page.fill('#appealDate-month', (yesterday.month()+1).toString());
        await this.page.fill('#appealDate-year', yesterday.year().toString());
        await this.page.keyboard.press('Tab');
        await this.buttonHelper.continueButton.click();

    }

    async whatDecision(decision: string) {
        await this.page.check(`#isDecisionAllowed-${decision}`);
        await this.buttonHelper.continueButton.click();
    }

    async checkMyAnswers() {
        await this.forceToDecidedButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

}
