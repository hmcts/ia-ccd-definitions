const { I } = inject();

class ReviewHomeOfficeResponse {

    constructor() {
    }

    async submit() {
        await I.selectNextStep('Review Home Office response');
        await I.waitForText('Explain the direction you are issuing', 60);
        await I.validateComplyDate(5);
        await I.clickContinue();
        await I.clickSendDirection();
        await I.waitForText('You have sent a direction');
    };
}

// For inheritance
//module.exports = new ReviewHomeOfficeResponse();
export = ReviewHomeOfficeResponse;