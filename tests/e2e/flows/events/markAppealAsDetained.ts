import moment from "moment/moment";
import createAppeal from '../createAppeal';
import {appellant} from '../../detainedConfig'

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

        switch (detentionLocation) {
            case 'prison':
                await this.createAppeal.setCustodialSentence('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
                break;
            case 'other':
                let addressLine1: string = await I.grabValueFrom('#appellantAddress__detailAddressLine1');
                let postcode: string = await I.grabValueFrom('#appellantAddress__detailPostCode');
                // @ts-ignore
                await I.expectEqual(addressLine1, appellant.address.addressLine1, 'Incorrect address for Appellant');
                // @ts-ignore
                await I.expectEqual(postcode, appellant.address.postcode, 'Incorrect address for Appellant');
                await I.clickContinue();
                await this.createAppeal.setCustodialSentence('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
                break;
            default:
                await this.createAppeal.setBailApplication('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
        }

        await I.clickButtonOrLink('Mark appeal as detained');
        await I.waitForText('You have marked the appeal as detained', 60);
        await I.clickCloseAndReturnToCaseDetails();
    }
}

// For inheritance
//module.exports = new serviceRequestPage();
export = markAppeal;
