import { Page } from '@playwright/test';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import moment from "moment/moment";

export class ForceDecidedStateEvent {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }


    async forceDecidedState(decision: 'allowed' | 'dismissed' = 'allowed') {
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

    async whatDecision(decision: 'allowed' | 'dismissed') {
        const decisionId = decision === 'allowed'
            ? 'isDecisionAllowed-allowed'
            : 'isDecisionAllowed-dismissed';
        await this.page.check(`#${decisionId}`);
        await this.buttonHelper.continueButton.click();
    }

    async checkMyAnswers() {
        await this.buttonHelper.forceToDecidedButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

    async
}
