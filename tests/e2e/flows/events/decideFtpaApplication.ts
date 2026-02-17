import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";
import moment from "moment";

export class DecideFtpaApplication {
    private buttonHelper: ButtonHelper;
    readonly forceToFtpaDecidedButton = this.page.getByRole('button', { name: ' Force to FTPA decided '});

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(party: string = 'Appellant', forced:boolean = false) {
        if (!forced) {
            await new PageHelper(this.page).selectNextStep('Decide FTPA application');
        } else {
            const yesterday = moment().subtract(1, 'days');
            await this.page.fill('#ftpaAppellantDecisionDate-day', yesterday.date().toString());
            await this.page.fill('#ftpaAppellantDecisionDate-month', (yesterday.month()+1).toString());
            await this.page.fill('#ftpaAppellantDecisionDate-year', yesterday.year().toString());
            // due to the auto-validation firing - the error message does not disappear until we physically move off of the last field
            // if we just try and click continue it stays on the decision date page and the test fails - only happens in ICC
            await this.page.keyboard.press('Tab');
            await this.page.waitForSelector('.error-message', { state: 'hidden' });
            await this.buttonHelper.continueButton.click();
        }

        await this.page.check(`#ftpaApplicantType-${party.toLowerCase()}`);
        await this.buttonHelper.continueButton.click();

        // TODO Needs all the options added
            await this.page.check(`#ftpa${party}RjDecisionOutcomeType-granted`);
            await this.buttonHelper.continueButton.click();
        if (!forced) {
            await this.page.locator(`#ftpaApplication${party}Document`).setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
            await this.page.waitForSelector('.error-message', {state: 'hidden'});
            await this.buttonHelper.continueButton.click();
            await this.page.check(`#isFtpa${party}NoticeOfDecisionSetAside_No`);
            await this.buttonHelper.continueButton.click();
            await this.buttonHelper.continueButton.click();  //Notes for upper tribunal
            await this.buttonHelper.submitButton.click();
        } else {
            await this.forceToFtpaDecidedButton.click();
        }

        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}