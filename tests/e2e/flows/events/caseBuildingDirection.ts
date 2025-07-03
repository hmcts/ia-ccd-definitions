import moment from "moment";

const { I } = inject();

class CaseBuildingDirection {

    constructor() {
    }

    async submit() {
        await I.selectNextStep('Request case building');
        await I.waitForText('Explain the direction you are issuing', 60);
        await I.clickContinue();
        await I.clickSendDirection();
        await I.waitForText('You have sent a direction');
        await I.clickCloseAndReturnToCaseDetails();
    };
}

// For inheritance
//module.exports = new CaseBuildingDirection();
export = CaseBuildingDirection;