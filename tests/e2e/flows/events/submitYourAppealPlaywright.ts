//import createAppeal from '../createAppeal';

//const { I } = inject();
import {Page, expect} from "@playwright/test";
import { PageHelper } from '../../helpers/pageHelper';

//const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';

export class SubmitYourAppeal {
  //  private createAppeal: createAppeal;

    constructor(public page: Page) {
        //this.createAppeal = new createAppeal();
    }
    // refactor - put them in the pageHelper or maybe button Helper?
    readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
    readonly submitButton = this.page.getByRole('button', { name: 'Submit'});
    readonly clickCloseAndReturnToCaseDetails = this.page.getByRole('button', { name: 'Close and Return to case details' });


    async submit(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        await new PageHelper(this.page).selectNextStep('Submit your appeal');
       // await I.selectNextStep('Submit your appeal');
        if (!inTime) {
                 await this.setAppealOutOfTime();
        }
        await this.page.waitForTimeout(5000); // waits for 2 seconds
        await this.agreeToDeclaration(legalRepDeclaration, inTime);
    };

    async setAppealOutOfTime(){
        //await I.runAccessibilityCheck('AppealOutOfTimePage');
        //await I.waitForText('Reasons the appeal is late', 60);
        await this.page.fill('#applicationOutOfTimeExplanation', 'Test explanation of why out of time.');
        //await I.fillField('#applicationOutOfTimeExplanation', 'Test explanation of why out of time.');
        await this.page.locator('#applicationOutOfTimeDocument').setInputFiles('./tests/documents/TEST_DOCUMENT_1.pdf');
       await this.page.fill('#uploadTheNoticeOfDecisionDocs_0_description', 'Test Notice of Decision document.');
        await this.page.waitForSelector('.error-message', { state: 'hidden' });
        await this.continueButton.click();
      //  await I.attachFile('#applicationOutOfTimeDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
      //  await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
      //  await I.clickContinue();
    }

    async agreeToDeclaration(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        //await I.waitForText('Declaration',60);
        //await I.runAccessibilityCheck('DeclarationPage');
        console.log('legalRepDeclaration>>>', legalRepDeclaration);
        await this.page.waitForTimeout(5000); // waits for 2 seconds
        if (legalRepDeclaration) {
            await this.page.check('#legalRepDeclaration-hasDeclared');
            //await I.click('#legalRepDeclaration');
        } else {
            await this.page.check('#adminDeclaration1-hasDeclared');
            //await I.click('#adminDeclaration1-hasDeclared');
        }

        await this.submitButton.click();
        //await I.clickSubmit();
        const confirmationHeader = this.page.locator('#confirmation-header > ccd-markdown > div > markdown > h1');

        if (legalRepDeclaration && inTime) {
            await expect(confirmationHeader).toHaveText('Your appeal has been submitted');
            //await I.waitForText('Your appeal has been submitted',60)
        } else if (inTime){
            await expect(confirmationHeader).toHaveText('The appeal has been submitted');
            //await I.waitForText('The appeal has been submitted',60)
        } else {
            //TODO change to playwright
            return;
            //await I.validateCorrectLabelDisplayed(outOfTimedImageLocator, 'outOfTimeConfirmation');
        }

        await this.clickCloseAndReturnToCaseDetails.click();
        //await I.clickCloseAndReturnToCaseDetails();

    }


}

// For inheritance
//module.exports = new serviceRequestPage();
//export = SubmitYourAppeal;