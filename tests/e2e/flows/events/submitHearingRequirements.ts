const { I } = inject();

class SubmitHearingRequirements {

    constructor() {

    }

    async submit() {
        await I.selectNextStep('Submit Hearing requirements');
        await I.waitForText('Requirements', 60);
        await I.clickContinue();
        await this.isAppellantAttendingTheHearing('Yes');
        await this.isAppellantGivingOralEvidence('Yes');
        await this.isWitnessesAttending('No');
        await this.isEvidenceFromOutsideUkInCountry('No');
        await this.isInterpreterServicesNeeded('No');
        await this.isHearingRoomNeeded('No');
        await this.isHearingLoopNeeded('No');
        await I.clickContinue(); // Additional requests help page
        await this.isVideoHearingSuitable('Yes');
        await this.hasHealthConditions('No');
        await this.hasPastExperiences('No');
        await this.hasMultimediaEvidence('No');
        await this.isSingleSexCourtRequired('No');
        await this.isCameraRequired('No');
        await this.hasAdditionalRequest('No');
        await this.areThereDatesToAvoid('No');

        await I.clickSubmit();
        await I.clickCloseAndReturnToCaseDetails();
    };

    async isAppellantAttendingTheHearing(isAttending: string= 'Yes'){
        await I.click(`#isAppellantAttendingTheHearing_${isAttending}`);
        await I.clickContinue();
    };

    async isAppellantGivingOralEvidence(isGivingEvidence: string = 'Yes'){
        await I.click(`#isAppellantGivingOralEvidence_${isGivingEvidence}`);
        await I.clickContinue();
    };

    async isWitnessesAttending(isAttending: string = 'Yes'){
        await I.click(`#isWitnessesAttending_${isAttending}`);
        //TODO add Yes option - requires adding witness
        await I.clickContinue();
    };

    async isEvidenceFromOutsideUkInCountry(evidenceFromOutsideCountry: string = 'Yes'){
        await I.click(`#isEvidenceFromOutsideUkInCountry_${evidenceFromOutsideCountry}`);
        await I.clickContinue();
    };

    async isInterpreterServicesNeeded(interpreterNeeded: string = 'Yes') {
        await I.click(`#isInterpreterServicesNeeded_${interpreterNeeded}`);
        //TODO - need to add Yes option - as this then loads further interpreter specific pages
        await I.clickContinue();
    };

    async isHearingRoomNeeded(hearingRoomNeeded: string = 'Yes'){
        await I.click(`#isHearingRoomNeeded_${hearingRoomNeeded}`);
        await I.clickContinue();
    };

    async isHearingLoopNeeded(hearingLoopNeeded: string = 'Yes'){
        await I.click(`#isHearingLoopNeeded_${hearingLoopNeeded}`);
        await I.clickContinue();
    };

    async isVideoHearingSuitable(isSuitable: string = 'Yes'){
        await I.click(`#remoteVideoCall_${isSuitable}`);

        if (isSuitable === 'Yes') {
            await I.fillField('#remoteVideoCallDescription','Test explanation of why a video call is suitable.');
        }

        await I.clickContinue();
    };

    async hasHealthConditions(hasHeathIssues: string = 'Yes'){
        await I.click(`#physicalOrMentalHealthIssues_${hasHeathIssues}`);

        if (hasHeathIssues === 'Yes') {
            await I.fillField('#physicalOrMentalHealthIssuesDescription','Test explanation of health issues.');
        }

        await I.clickContinue();
    };

    async hasPastExperiences(hasExperiences: string = 'Yes'){
        await I.click(`#pastExperiences_${hasExperiences}`);

        if (hasExperiences === 'Yes') {
            await I.fillField('#pastExperiencesDescription','Test explanation of past experiences.');
        }

        await I.clickContinue();
    };

    async hasMultimediaEvidence(hasMMEvidence: string = 'Yes'){
        await I.click(`#multimediaEvidence_${hasMMEvidence}`);

        if (hasMMEvidence === 'Yes') {
            await I.fillField('#multimediaEvidenceDescription','Test explanation of multimedia evidence.');
        }

        await I.clickContinue();
    };

    async isSingleSexCourtRequired(singleSexCourtRequired: string = 'Yes') {
        await I.click(`#singleSexCourt_${singleSexCourtRequired}`);
        await I.clickContinue();
    };

    async isCameraRequired(cameraRequired: string = 'Yes'){
        await I.click(`#inCameraCourt_${cameraRequired}`);

        if (cameraRequired === 'Yes') {
            await I.fillField('#inCameraCourtDescription','Test explanation of camera required.');
        }

        await I.clickContinue();
    };

    async hasAdditionalRequest(additionalRequest: string = 'Yes'){
        await I.click(`#additionalRequests_${additionalRequest}`);

        if (additionalRequest === 'Yes') {
            await I.fillField('#additionalRequestsDescription','Test explanation of additional request.');
        }

        await I.clickContinue();
    };

    async areThereDatesToAvoid(avoidDates: string = 'Yes') {
        await I.click(`#datesToAvoidYesNo_${avoidDates}`);
        //TODO - need to add Yes option - as this then requires user to add dates not available which can be single or range of dates
        await I.clickContinue();
    };


}

// For inheritance
//module.exports = new SubmitHearingRequirements();
export = SubmitHearingRequirements;