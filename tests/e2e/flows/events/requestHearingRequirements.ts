const { I } = inject();

class RequestHearingRequirements {

    constructor() {

    }

    async submit() {
        await I.selectNextStep('Request Hearing requirements');
        await I.waitForElement('.button[type="submit"]', 60);
        await I.clickSubmit();
    };
}

// For inheritance
//module.exports = new RequestHearingRequirements();
export = RequestHearingRequirements;