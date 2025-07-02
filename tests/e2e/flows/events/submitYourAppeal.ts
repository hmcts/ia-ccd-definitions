import createAppeal from '../createAppeal';

const { I } = inject();
const outOfTimedImageLocator: string = '//*[@id="confirmation-body"]/ccd-markdown/div/markdown/p[1]/img';

class SubmitYourAppeal {
    private createAppeal: createAppeal;

    constructor() {
        this.createAppeal = new createAppeal();
    }

    async submit(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        await I.selectNextStep('Submit your appeal');
        if (!inTime) {
                 await this.setAppealOutOfTime();
        }

        await this.agreeToDeclaration(legalRepDeclaration, inTime);
    };

    async setAppealOutOfTime(){
        await I.runAccessibilityCheck('AppealOutOfTimePage');
        await I.waitForText('Reasons the appeal is late', 60);
        await I.fillField('#applicationOutOfTimeExplanation', 'Test explanation of why out of time.');
        await I.attachFile('#applicationOutOfTimeDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
        await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
        await I.clickContinue();
    }

    async agreeToDeclaration(legalRepDeclaration: boolean = true, inTime: boolean = true) {
        await I.waitForText('Declaration',60);
        await I.runAccessibilityCheck('DeclarationPage');
        if (legalRepDeclaration) {
            await I.click('#legalRepDeclaration');
        } else {
            await I.click('#adminDeclaration1-hasDeclared');
        }

        await I.clickSubmit();

        if (legalRepDeclaration && inTime) {
            await I.waitForText('Your appeal has been submitted',60)
        } else if (inTime){
            await I.waitForText('The appeal has been submitted',60)
        } else {
            await I.validateCorrectLabelDisplayed(outOfTimedImageLocator, 'outOfTimeConfirmation');
        }

        await I.clickCloseAndReturnToCaseDetails();

    }


}

// For inheritance
//module.exports = new serviceRequestPage();
export = SubmitYourAppeal;