import createAppeal from '../createAppeal';

const { I } = inject();

class detentionLocation {

    private createAppeal: createAppeal;
    private detentionLocation: string;

    constructor() {
        this.createAppeal = new createAppeal();

    }

    async changeLocation(detentionLocation: string = 'prison'){
        this.detentionLocation = detentionLocation;
        await this.createAppeal.setDetentionLocation(detentionLocation)
        switch (detentionLocation) {
            case 'immigrationRemovalCentre':
                await this.createAppeal.setBailApplication('Yes');
                break;
            case 'other':
                await this.createAppeal.setAppellentsAddress('detained', 'Yes', true);
                await this.createAppeal.setCustodialSentence('Yes');
                break;
            case 'prison':
                await this.createAppeal.setCustodialSentence('Yes');
                break;
        }

        await I.clickButtonOrLink('Update detention location');
        await I.waitForText('You have updated the detained location', 60);
        await I.clickCloseAndReturnToCaseDetails();
    };

    async validateDataUpdated() {
        await I.validateDataOnAppellantTab();
        await I.validateDataOnAppealTab(this.detentionLocation);
    };
}

// For inheritance
//module.exports = new serviceRequestPage();
export = detentionLocation;