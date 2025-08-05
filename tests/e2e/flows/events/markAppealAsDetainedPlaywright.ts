import { Page, expect } from '@playwright/test';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { CreateAppeal } from '../createAppealPlaywright';
import { appellant } from '../../detainedConfig';

export class MarkAppealAsDetained {
    private createAppeal: CreateAppeal;
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.createAppeal = new CreateAppeal(this.page);
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly markAppealAsDetainedButton = this.page.getByRole('button', { name: 'Mark appeal as detained' });

    async setAsDetained(detentionLocation: string = 'immigrationRemovalCentre'){
        await new PageHelper(this.page).selectNextStep('Mark appeal as detained');

        await this.page.fill('#appellantDetainedDate-day', appellant.detained.date.day.toString());
        await this.page.fill('#appellantDetainedDate-month', appellant.detained.date.month.toString());
        await this.page.fill('#appellantDetainedDate-year', appellant.detained.date.year.toString());
        await this.page.fill('#addReasonAppellantWasDetained', appellant.detained.reason);
        await this.buttonHelper.continueButton.click();
        await this.createAppeal.setDetentionLocation(detentionLocation);

        switch (detentionLocation) {
            case 'prison':
                await this.createAppeal.setCustodialSentence('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
                break;
            case 'other':
                expect(await this.page.innerText('#appellantAddress__detailAddressLine1'), 'Incorrect address for Appellant').toEqual(appellant.address.addressLine1,);
                expect(await  this.page.innerText('#appellantAddress__detailPostCode'), 'Incorrect address for Appellant').toEqual(appellant.address.postcode);
                await this.buttonHelper.continueButton.click();
                await this.createAppeal.setCustodialSentence('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
                break;
            default:
                await this.createAppeal.setBailApplication('Yes');
                await this.createAppeal.hasRemovalDirections('Yes');
        }

        await this.markAppealAsDetainedButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }
}
