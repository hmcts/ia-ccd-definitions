import { Page } from '@playwright/test';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { CreateAppeal } from '../createAppeal';
import { appellant } from '../../iacConfig';

export class RemoveDetainedStatus {
    private createAppeal: CreateAppeal;
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.createAppeal = new CreateAppeal(this.page);
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly removeDetainedStatusButton = this.page.getByRole('button', { name: 'Remove detained status' });

    //Legally Represented
     async removeStatus() {
        await new PageHelper(this.page).selectNextStep('Remove Detained Status');
        await this.detentionRemovalDetails();
        await this.appellantAddressManual();
        await this.createAppeal.setAppellantContactDetails();
        await this.removeDetainedStatusButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

    async detentionRemovalDetails() {
        await this.page.fill('#detentionRemovalDate-day', appellant.detentionRemoval.date.day.toString());
        await this.page.fill('#detentionRemovalDate-month', appellant.detentionRemoval.date.month.toString());
        await this.page.fill('#detentionRemovalDate-year', appellant.detentionRemoval.date.year.toString());
        await this.page.fill('#detentionRemovalReason',appellant.detentionRemoval.reason);
        await this.buttonHelper.continueButton.click();
    }

    async appellantAddress(hasPostalAddress: string = 'Yes') {
        await this.page.check(`#appellantHasFixedAddress_${hasPostalAddress}`);
        await this.page.fill('#appellantAddress_appellantAddress_postcodeInput', appellant.address.postcode);
        await this.page.click('//*[@id="appellantAddress_appellantAddress_postcodeLookup"]/button');
        await this.page.selectOption('#appellantAddress_appellantAddress_addressList', appellant.address.addressLine1);
        await this.buttonHelper.continueButton.click();
    }

    async appellantAddressManual() {
        await this.page.fill('#appellantAddress_appellantAddress_postcodeInput', appellant.address.postcode);
        await this.page.click('//*[@id="appellantAddress_appellantAddress_postcodeLookup"]/button');
        await this.page.selectOption('#appellantAddress_appellantAddress_addressList', appellant.address.addressLine1 + ', ' + appellant.address.postTown);
        await this.buttonHelper.continueButton.click();
    }
 }