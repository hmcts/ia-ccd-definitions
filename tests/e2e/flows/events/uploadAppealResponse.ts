const { I } = inject();

class UploadAppealResponse {

    constructor() {
    }

    async upload() {
        await I.selectNextStep('Upload the appeal response');
        await I.waitForElement('#appealReviewOutcome-decisionMaintained', 60);
        await I.click('#appealReviewOutcome-decisionMaintained');
        await I.clickContinue();
        // TODO: move to function to be used by multiple scenarios
        await I.waitForElement('#homeOfficeAppealResponseDocument', 60);
        await I.attachFile('#homeOfficeAppealResponseDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
        await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
        await I.clickContinue();
        // end code to move
        await I.clickButtonOrLink('Upload');
        await I.waitForText('You\'ve uploaded the appeal response');
        await I.clickCloseAndReturnToCaseDetails();
    };
}

// For inheritance
//module.exports = new UploadAppealResponse();
export = UploadAppealResponse;