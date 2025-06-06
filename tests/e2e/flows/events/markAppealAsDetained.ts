import moment from "moment/moment";
import createAppeal from '../createAppeal';

const { I } = inject();

class markAppeal {
    private createAppeal: createAppeal;

    constructor() {
        this.createAppeal = new createAppeal();

    }

    async setAsDetained(detentionLocation: string = 'immigration'){
        const yesterday = moment().subtract(1, 'days');

        await I.waitForText('Detention details', 60);
        await I.fillField('#appellantDetainedDate-day', yesterday.date());
        await I.fillField('#appellantDetainedDate-month', yesterday.month()+1);
        await I.fillField('#appellantDetainedDate-year', yesterday.year());
        await I.fillField('#addReasonAppellantWasDetained', 'Reason for the appellant being detained');
        await I.clickContinue();
        await this.createAppeal.setDetentionLocation(detentionLocation);
    }
}

// For inheritance
//module.exports = new serviceRequestPage();
export = markAppeal;
