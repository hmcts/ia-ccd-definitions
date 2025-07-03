import moment from "moment";

const { I } = inject();

class RespondentReviewDirection {

    constructor() {
    }

    async submit() {
        await I.selectNextStep('Request respondent review');
        await I.waitForText('Explain the direction you are issuing', 60);
        await I.validateComplyDate();
        await I.clickContinue();
        await I.clickSendDirection();
        await I.waitForText('You have sent a direction');
    };
 }

// For inheritance
//module.exports = new RespondentReviewDirection();
export = RespondentReviewDirection;