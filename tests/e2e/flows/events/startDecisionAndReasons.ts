import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";

export class StartDecisionAndReasons {
    private buttonHelper: ButtonHelper;
    readonly saveButton = this.page.getByRole('button', { name: 'Save' });


    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(historyAgreed: string = 'Yes', scheduleOfIssuesAgreed: string = 'Yes') {
        await new PageHelper(this.page).selectNextStep('Start decision and reasons');
        await this.page.fill('#caseIntroductionDescription', 'Test case introduction text.');
        await this.buttonHelper.continueButton.click();
        await this.page.fill('#appellantCaseSummaryDescription', 'Test appellant case summary text.');
        await this.buttonHelper.continueButton.click();

        await this.page.check(`#immigrationHistoryAgreement_${historyAgreed}`);
        if (historyAgreed === 'Yes') {
            await this.page.fill('#agreedImmigrationHistoryDescription', 'Test agreed immigration history text.');
        } else {
            await this.page.fill('#respondentsImmigrationHistoryDescription', 'Test respondent immigration history text.');
            await this.page.fill('#immigrationHistoryDisagreementDescription', 'Test areas of immigration history disagreement text.');
        }
        await this.buttonHelper.continueButton.click();

        await this.page.check(`#scheduleOfIssuesAgreement_${scheduleOfIssuesAgreed}`);
        if (scheduleOfIssuesAgreed === 'Yes') {
            await this.page.fill('#appellantsAgreedScheduleOfIssuesDescription', 'Test appellant schedule of issues text.');
        } else {
            await this.page.fill('#appellantsDisputedScheduleOfIssuesDescription', 'Test appellant disputed schedule of issues text.');
            await this.page.fill('#scheduleOfIssuesDisagreementDescription', 'Test areas of parties schedule of issues disagreement text.');
        }
        await this.buttonHelper.continueButton.click();
        await this.saveButton.click();
    };
}