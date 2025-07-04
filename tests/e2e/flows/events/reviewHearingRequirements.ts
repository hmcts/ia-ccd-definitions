const { I } = inject();

class ReviewHearingRequirements {

    constructor() {

    }

    async submit() {
        await I.selectNextStep('Review Hearing requirements');
        await I.waitForText('Continue to see requests for additional adjustments.', 60);
        await I.clickContinue(); // review hearing requirements page
        await this.remoteHearingDecision('Refused');
        await I.clickContinue(); // any health conditions
        await I.clickContinue(); // multimedia evidence
        await I.clickContinue(); // Single sex court
        await I.clickContinue(); // Camera required
        await I.clickContinue(); // Any other requests
        await this.typeOfHearingRequired('INTER');
        await this.isSuitableToFloat('No');
        await this.areThereAdditionalInstructions('No');
        await I.clickSubmit(); // CYA
        await I.waitForText('You\'ve recorded the agreed hearing adjustments');
        await I.clickCloseAndReturnToCaseDetails();
    };

    async remoteHearingDecision(grantedRefused: string = 'Granted') {
        await I.click(`#isRemoteHearingAllowed-${grantedRefused}`);
        await I.fillField('#remoteVideoCallTribunalResponse', 'Test description of Tribunal response.');
        await I.clickContinue();
    };

    async typeOfHearingRequired(option: string = 'INTER') {
        await I.click(`#hearingChannel_${option}`);
        await I.clickContinue();
    };

    async isSuitableToFloat(isSuitable: string = 'Yes') {
        await I.click(`#isAppealSuitableToFloat_${isSuitable}`);
        await I.clickContinue();
    };

    async areThereAdditionalInstructions(additionalInstructions: string = 'Yes') {
        await I.click(`#isAdditionalInstructionAllowed_${additionalInstructions}`);

        if (additionalInstructions === 'Yes') {
            await I.fillField('#additionalInstructionsTribunalResponse', 'Test additional instructions for Tribunal response.');
        }

        await I.clickContinue();
    }
}

// For inheritance
//module.exports = new ReviewHearingRequirements();
export = ReviewHearingRequirements;