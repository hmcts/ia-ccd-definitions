import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export class SubmitHearingRequirements {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit(isInCountry: boolean = true) {
        await new PageHelper(this.page).selectNextStep('Submit hearing requirements');
        await this.buttonHelper.continueButton.click();

        if (isInCountry) {
            await this.isAppellantAttendingTheHearing('Yes');
        }

        await this.isAppellantGivingOralEvidence('Yes', isInCountry);
        await this.isWitnessesAttending('No');

        if (isInCountry) {
            await this.isEvidenceFromOutsideUkInCountry('No');
        }

        await this.isInterpreterServicesNeeded('Yes', 'spoken');
        await this.isHearingRoomNeeded('No');
        await this.isHearingLoopNeeded('No');
        await this.buttonHelper.continueButton.click(); // Additional requests help page
        await this.isVideoHearingSuitable('Yes');
        await this.hasHealthConditions('No');
        await this.hasPastExperiences('No');
        await this.hasMultimediaEvidence('No');
        await this.isSingleSexCourtRequired('No');
        await this.isCameraRequired('No');
        await this.hasAdditionalRequest('No');
        await this.areThereDatesToAvoid('No');

        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };

    async isAppellantAttendingTheHearing(isAttending: string= 'Yes'){
        await this.page.locator(`#isAppellantAttendingTheHearing_${isAttending}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isAppellantGivingOralEvidence(isGivingEvidence: string = 'Yes', isInCountry: boolean = true){
        if (isInCountry) {
            await this.page.locator(`#isAppellantGivingOralEvidence_${isGivingEvidence}`).check();
        } else {
            await this.page.locator(`#isEvidenceFromOutsideUkOoc_${isGivingEvidence}`).check();
        }
        await this.buttonHelper.continueButton.click();
    };

    async isWitnessesAttending(isAttending: string = 'Yes'){
        //TODO add Yes option - requires adding witness
        await this.page.locator(`#isWitnessesAttending_${isAttending}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isEvidenceFromOutsideUkInCountry(evidenceFromOutsideCountry: string = 'Yes'){
        await this.page.locator(`#isEvidenceFromOutsideUkInCountry_${evidenceFromOutsideCountry}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isInterpreterServicesNeeded(interpreterNeeded: string = 'Yes', interpreterType: string = 'spoken') {
        const interpreterTypeUpperCaseFirstLetter = interpreterType[0].toUpperCase() + interpreterType.slice(1);

        await this.page.locator(`#isInterpreterServicesNeeded_${interpreterNeeded}`).check();
        await this.buttonHelper.continueButton.click();

        if (interpreterNeeded === 'Yes') {
            if (interpreterType === 'spoken') {
                await this.page.check(`#appellantInterpreterLanguageCategory-${interpreterType}LanguageInterpreter`);
                await this.buttonHelper.continueButton.click();
                await this.page.selectOption('#appellantInterpreter' + interpreterTypeUpperCaseFirstLetter + 'Language_languageRefData', 'French');
            }

            if (interpreterType === 'sign') {
                await this.page.check(`appellantInterpreterLanguageCategory-${interpreterType}LanguageInterpreter`);
                await this.buttonHelper.continueButton.click();
                await this.page.selectOption('#appellantInterpreter' + interpreterTypeUpperCaseFirstLetter + 'Language_languageRefData', 'British Sign Language (BSL)');
            }

            if (interpreterType === 'both') {
                await this.page.check('#appellantInterpreterLanguageCategory-spokenLanguageInterpreter');
                await this.page.check('#appellantInterpreterLanguageCategory-signLanguageInterpreter');
                await this.buttonHelper.continueButton.click();
                await this.page.selectOption('#appellantInterpreterSpokenLanguage_languageRefData', 'French');
                await this.buttonHelper.continueButton.click();
                await this.page.selectOption('#appellantInterpreterSignLanguage_languageRefData', 'British Sign Language (BSL)');
            }
            await this.buttonHelper.continueButton.click();
        }
        await this.buttonHelper.continueButton.click();
    };

    async isHearingRoomNeeded(hearingRoomNeeded: string = 'Yes'){
        await this.page.locator(`#isHearingRoomNeeded_${hearingRoomNeeded}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isHearingLoopNeeded(hearingLoopNeeded: string = 'Yes'){
        await this.page.locator(`#isHearingLoopNeeded_${hearingLoopNeeded}`).check();
        await this.buttonHelper.continueButton.click();
    };

    async isVideoHearingSuitable(isSuitable: string = 'Yes'){
        await this.page.locator(`#remoteVideoCall_${isSuitable}`).check();

        if (isSuitable === 'Yes') {
            await this.page.locator('#remoteVideoCallDescription').fill('Test explanation of why a video call is suitable.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async hasHealthConditions(hasHeathIssues: string = 'Yes'){
        await this.page.locator(`#physicalOrMentalHealthIssues_${hasHeathIssues}`).check();

        if (hasHeathIssues === 'Yes') {
            await this.page.locator('#physicalOrMentalHealthIssuesDescription').fill('Test explanation of health issues.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async hasPastExperiences(hasExperiences: string = 'Yes'){
        await this.page.locator(`#pastExperiences_${hasExperiences}`).check();

        if (hasExperiences === 'Yes') {
            await this.page.locator('#pastExperiencesDescription').fill('Test explanation of past experiences.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async hasMultimediaEvidence(hasMMEvidence: string = 'Yes'){
        await this.page.locator(`#multimediaEvidence_${hasMMEvidence}`).check();

        if (hasMMEvidence === 'Yes') {
            await this.page.locator('#multimediaEvidenceDescription').fill('Test explanation of multimedia evidence.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async isSingleSexCourtRequired(singleSexCourtRequired: string = 'Yes') {
        await this.page.locator(`#singleSexCourt_${singleSexCourtRequired}`).check();;
        await this.buttonHelper.continueButton.click();
    };

    async isCameraRequired(cameraRequired: string = 'Yes'){
        await this.page.locator(`#inCameraCourt_${cameraRequired}`).check();;

        if (cameraRequired === 'Yes') {
            await this.page.locator('#inCameraCourtDescription').fill('Test explanation of camera required.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async hasAdditionalRequest(additionalRequest: string = 'Yes'){
        await this.page.locator(`#additionalRequests_${additionalRequest}`).check();;

        if (additionalRequest === 'Yes') {
            await this.page.locator('#additionalRequestsDescription').fill('Test explanation of additional request.');
        }

        await this.buttonHelper.continueButton.click();
    };

    async areThereDatesToAvoid(avoidDates: string = 'Yes') {
        await this.page.locator(`#datesToAvoidYesNo_${avoidDates}`).check();;
        //TODO - need to add Yes option - as this then requires user to add dates not available which can be single or range of dates
        await this.buttonHelper.continueButton.click();
    };


}