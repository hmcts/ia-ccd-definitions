import moment from "moment";

const { I } = inject();

class RespondentEvidenceDirection {

    constructor() {
    }

    async submit() {
        await I.selectNextStep('Request respondent evidence');
        await I.waitForText('Explain the direction you are issuing', 60);
        await I.validateComplyDate();
        await I.clickContinue();
        await I.clickSendDirection();
        await I.waitForText('You have sent a direction');
    };
}

// For inheritance
//module.exports = new RespondentEvidenceDirection();
export = RespondentEvidenceDirection;