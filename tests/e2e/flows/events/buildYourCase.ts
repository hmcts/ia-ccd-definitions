const { I } = inject();

class BuildYourCase {

    constructor() {
    }

    async build() {
        await I.selectNextStep('Build your case');
        await I.waitForElement('#caseArgumentDocument', 60);
        await I.attachFile('#caseArgumentDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
        await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
        await I.clickContinue();
        await I.clickSubmit();
        await I.waitForText('You have submitted your case');
        await I.clickCloseAndReturnToCaseDetails();
    };
}

// For inheritance
//module.exports = new BuildYourCase();
export = BuildYourCase;