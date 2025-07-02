import createAppeal from '../createAppeal';

const { I } = inject();

class DetentionLocation {

    private createAppeal: createAppeal;

    constructor() {
        this.createAppeal = new createAppeal();
    }

    async changeLocation(detentionLocation: string = 'prison', hasCustodialSentence: boolean = true) {
        await this.createAppeal.setDetentionLocation(detentionLocation)
        switch (detentionLocation) {
            case 'immigrationRemovalCentre':
                await this.createAppeal.setBailApplication('Yes');
                break;
            case 'other':
                await this.createAppeal.setAppellentsAddress('detained', 'Yes', true);
                if (hasCustodialSentence) {
                    await this.createAppeal.setCustodialSentence('Yes');
                } else {
                    await this.createAppeal.setCustodialSentence('No');
                    await this.createAppeal.setBailApplication('Yes');
                }
                break;
            case 'prison':
                if (hasCustodialSentence) {
                    await this.createAppeal.setCustodialSentence('Yes');
                } else {
                    await this.createAppeal.setCustodialSentence('No');
                    await this.createAppeal.setBailApplication('Yes');
                }
                break;
        }

        await I.clickButtonOrLink('Update detention location');
        await I.waitForText('You have updated the detained location', 60);
        await I.clickCloseAndReturnToCaseDetails();
    };

    async validateDataUpdated(detentionLocation: string, validateDetentionDate: boolean = false) {
        await I.validateDataOnAppellantTab();
        await I.validateDataOnAppealTab(detentionLocation, validateDetentionDate);
    };
}

// For inheritance
//module.exports = new serviceRequestPage();
export = DetentionLocation;