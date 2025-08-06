import { Page } from '@playwright/test';
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from '../../helpers/ButtonHelper';
import { CreateAppeal } from '../createAppealPlaywright';
import { appellant } from '../../detainedConfig';


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
        await this.createAppeal.appellantDetails();
        await this.removeDetainedStatusButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    }

    // //Legally Represented - Manual??? AIP
    // async removeStatusAiPNo() {
    //     await I.selectNextStep('Remove Detained Status');
    //     await this.detentionRemovalDetails();
    //     await this.appellantAddressManual();
    //     await this.appellantContactDetails();
    //     await this.removeDetainedManualCYA();
    //     await I.clickButtonOrLink('Remove Detained Status');
    //     await this.removeDetainedConfirmation();
    // }
    //
    // async validateDataOnAppealTab() {
    //     await I.selectTab('Appeal');
    //     const appellantInDetention: string = await I.grabTextFrom(appealTabInDetentionLocator);
    //     // @ts-expect-error stop warning
    //     await I.expectEqual(appellantInDetention, 'No', `The Detention Flag value of: ${appellantInDetention} on the Appeal Tab is invalid. It should be: No`);
    //     await I.dontSee(appealTabCustodialText);
    //     await I.dontSee(appealTabCustodialDateText);
    //     await I.dontSee(appealTabBailPendingText);
    //     await I.dontSee(appealTabBailNumberText);
    //     await I.see(appealTabDateStatusRemovedText);
    //     await I.see(appealTabRemovalReasonsText);
    //
    // }
    //
    // async validateDataOnAppellantTab(detentionLocation: string) {
    //     await I.selectTab('Appellant');
    //
    //     await I.dontSee(appellantTabDetentionFacilityTypeText);
    //     await I.dontSee(appellantTabDetentionFacilityNameText);
    //     await I.dontSee(appellantTabNomsNoText);
    //     await I.dontSee(detentionLocation === 'prison' ? detentionFacility.prison.building : detentionFacility.immigrationRemovalCentre.building);
    //     await I.dontSee(detentionLocation === 'prison' ? detentionFacility.prison.address : detentionFacility.immigrationRemovalCentre.address);
    //     await I.dontSee(detentionLocation === 'prison' ? detentionFacility.prison.postcode : detentionFacility.immigrationRemovalCentre.postcode);
    // }
    //
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
    //
    // async appellantContactPreference(preference: 'Email' | 'Text') {
    //     await I.waitForText('The appellant\'s contact preference', 60);
    //     await I.click(`#contactPreference-wants${preference}`);
    //     if (preference === 'Email') {
    //         // Fill in email field from config
    //         await I.waitForElement('#email', 5);
    //         await I.fillField('#email', appellant.email);
    //     } else {
    //         // Fill in phone number field from config
    //         await I.waitForElement('#mobileNumber', 5);
    //         await I.fillField('#mobileNumber', appellant.mobile);
    //     }
    //
    //     await I.clickContinue();
    // }
    //
    // async appellantContactDetails() {
    //     await I.fillField('#internalAppellantMobileNumber', appellant.mobile);
    //     await I.fillField('#internalAppellantEmail', appellant.email);
    //     await I.clickContinue();
    // }
    //
    // async removeDetainedCYA() {
    //     await I.waitForText('Remove Detained Status', 60);
    //     await I.waitForText('Check your answers', 60);
    //     await I.waitForText('When was the appellant removed from detention?', 60);
    //     await I.waitForText('Reasons the appellant was removed from detention', 60);
    //     await I.waitForText('Does the appellant have a fixed address?', 60);
    //     await I.waitForText('Address', 60);
    //     await I.waitForText('Communication Preference', 60);
    // }
    //
    // async removeDetainedManualCYA() {
    //     await I.waitForText('Remove Detained Status', 60);
    //     await I.waitForText('Check your answers', 60);
    //     await I.waitForText('When was the appellant removed from detention?', 60);
    //     await I.waitForText('Address', 60);
    //     await I.waitForText('Mobile number', 60);
    //     await I.waitForText('Email address', 60);
    // }
    //
    // async removeDetainedConfirmation() {
    //     await I.waitForText('You have removed the detained status from this appeal', 60);
    //     await I.clickCloseAndReturnToCaseDetails();
    // }

}