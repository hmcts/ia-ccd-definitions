import {Page, expect} from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { ValidationHelper } from '../../helpers/ValidationHelper';

const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';

export class SubmitYourAppeal {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        await new PageHelper(this.page).selectNextStep('Submit your appeal');

        if (!inTime) {
                 await this.setAppealOutOfTime();
        }

        await this.agreeToDeclaration(legalRepDeclaration, inTime);
    };

    async setAppealOutOfTime(){
        await this.page.fill('#applicationOutOfTimeExplanation', 'Test explanation of why out of time.');
        await this.page.locator('#applicationOutOfTimeDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
        await this.page.fill('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.buttonHelper.continueButton.click();
    }

    async agreeToDeclaration(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        if (legalRepDeclaration) {
            await this.page.check('#legalRepDeclaration-hasDeclared');
        } else {
            await this.page.check('#adminDeclaration1-hasDeclared');
        }

        await this.buttonHelper.submitButton.click();

        const confirmationHeader = this.page.locator('#confirmation-header > ccd-markdown > div > markdown > h1');

        if (legalRepDeclaration && inTime) {
            await expect(confirmationHeader).toHaveText('Your appeal has been submitted');
        } else if (inTime){
            await expect(confirmationHeader).toHaveText('The appeal has been submitted');
        } else {
            await new ValidationHelper(this.page).validateCorrectLabelDisplayed(outOfTimedImageLocator, 'outOfTimeConfirmation');
        }

        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
}