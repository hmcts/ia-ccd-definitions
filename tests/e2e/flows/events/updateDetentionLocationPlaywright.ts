import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { ValidationHelper } from '../../helpers/ValidationHelper';
import { CreateAppeal } from '../createAppealPlaywright';

export class UpdateDetentionLocation {
    private pageHelper: PageHelper;
    private createAppeal: CreateAppeal;
    private buttonHelper: ButtonHelper;
    private validationHelper: ValidationHelper;

    constructor(public page: Page) {
        this.pageHelper = new PageHelper(this.page);
        this.createAppeal = new CreateAppeal(this.page);
        this.buttonHelper = new ButtonHelper(this.page);
        this.validationHelper = new ValidationHelper(this.page);
    }

    readonly updateDetentionLocationButton = this.page.getByRole('button', { name: 'Update detention location' });


    async changeLocation(detentionLocation: string = 'prison', hasCustodialSentence: boolean = true) {
        await this.pageHelper.selectNextStep('Update detention location');
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

        await this.updateDetentionLocationButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetails.click();
    };

    async validateDataUpdated(detentionLocation: string, validateDetentionDate: boolean = false) {
        await this.validationHelper.validateDataOnAppellantTab();
        //await I.validateDataOnAppellantTab();
        await this.validationHelper.validateDataOnAppealTab(detentionLocation, validateDetentionDate);
         //await I.validateDataOnAppealTab(detentionLocation, validateDetentionDate);
     };
}