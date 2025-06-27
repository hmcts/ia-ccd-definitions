import moment, {Moment} from "moment/moment";

const { I } = inject();
class CreateDirection {

    constructor() {
        //insert your locators
        // this.button = '#button'
    }
    // insert your methods here



    async confirmAndSubmitRespondentDirection() {
       await I.waitForText('Explain the direction you are issuing', 60);
       await this.validateComplyDate();
       await I.clickContinue();
       await I.clickSendDirection();
       await I.waitForText('You have sent a direction');
    }


    async validateComplyDate() {
        const daysToAdd: number = 7;
        const complyDate: string = await I.grabValueFrom('#sendDirectionDateDue-day') + '-'
            + await I.grabValueFrom('#sendDirectionDateDue-month') + '-'
            + await I.grabValueFrom('#sendDirectionDateDue-year');
        const todayPlusDays = moment().add(daysToAdd, 'days').format('DD-MM-YYYY');

        // @ts-ignore
        await I.expectDeepEqual(complyDate, todayPlusDays, `Request respondence evidence comply date should be ${daysToAdd} days from today: ${todayPlusDays}.`);
    }

    async confirmAndSubmitCaseBuildingDirection() {
        await I.waitForText('Explain the direction you are issuing', 60);
        await I.clickContinue();
        await I.clickSendDirection();
        await I.waitForText('You have sent a direction');
        await I.clickCloseAndReturnToCaseDetails();
    }

}

// For inheritance
//module.exports = new detentionPage();
export = CreateDirection;