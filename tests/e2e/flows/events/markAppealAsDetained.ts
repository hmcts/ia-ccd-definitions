import createAppeal from '../createAppeal';
import {appellant} from '../../detainedConfig'

const { I } = inject();

class markAppeal {
    private createAppeal: createAppeal;

    constructor() {
        this.createAppeal = new createAppeal();

    }

    async setAsDetained(detentionLocation: string = 'immigration', yesterday){

        await I.waitForText('Detention details', 60);
        await I.fillField('#appellantDetainedDate-day', appellant.detained.date.day);
        await I.fillField('#appellantDetainedDate-month', appellant.detained.date.month);
        await I.fillField('#appellantDetainedDate-year', appellant.detained.date.year);
        await I.fillField('#addReasonAppellantWasDetained', appellant.detained.reason);
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
