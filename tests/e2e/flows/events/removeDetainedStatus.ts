import moment from "moment";
import {appellant} from "../../detainedConfig";


const { I } = inject();

class RemoveDetainedStatus {

    async removeStatus(contactPreference: 'Email' | 'Text' = 'Email') {
        await this.detentionRemovalDetails();
        await this.appellantAddress('Yes');
        await this.appellantContactPreference(contactPreference);
        await this.removeDetainedCYA();
        await I.clickButtonOrLink('Remove Detained Status');
        await this.removeDetainedConfirmation();
    }

    async detentionRemovalDetails() {


        await I.waitForText(`Detention removal details`, 60);

        await I.fillField('#detentionRemovalDate-day', appellant.detentionRemoval.date.day);
        await I.fillField('#detentionRemovalDate-month', appellant.detentionRemoval.date.month);
        await I.fillField('#detentionRemovalDate-year', appellant.detentionRemoval.date.year);

        await I.fillField('#detentionRemovalReason',appellant.detentionRemoval.reason);
        await I.clickContinue();
    }

    async appellantAddress(hasPostalAddress: string = 'Yes') {
        await I.click(`#appellantHasFixedAddress_${hasPostalAddress}`);

        await I.waitForElement('#appellantAddress_appellantAddress_postcodeInput');
        await I.fillField('#appellantAddress_appellantAddress_postcodeInput', appellant.address.postcode);
        await I.click('//*[@id="appellantAddress_appellantAddress_postcodeLookup"]/button');
        await I.waitForVisible('#appellantAddress_appellantAddress_addressList',60);
        await I.waitForText('1 address found', 60);
        await I.selectOption('#appellantAddress_appellantAddress_addressList', appellant.address.addressLine1 + ', ' + appellant.address.postTown);
        await I.clickContinue();
    }

    async appellantContactPreference(preference: 'Email' | 'Text') {
        await I.waitForText('The appellant\'s contact preference', 60);
        await I.click(`#contactPreference-wants${preference}`);
        if (preference === 'Email') {
            // Fill in email field from config
            await I.waitForElement('#email', 5);
            await I.fillField('#email', appellant.email);
        } else {
            // Fill in phone number field from config
            await I.waitForElement('#mobileNumber', 5);
            await I.fillField('#mobileNumber', appellant.mobile);
        }

        await I.clickContinue();
    }

    async removeDetainedCYA() {
        await I.waitForText('Remove Detained Status', 60);
        await I.waitForText('Check your answers', 60);
        await I.waitForText('When was the appellant removed from detention?', 60);
        await I.waitForText('Reasons the appellant was removed from detention', 60);
        await I.waitForText('Does the appellant have a fixed address?', 60);
        await I.waitForText('Address', 60);
        await I.waitForText('Communication Preference', 60);
    }

    async removeDetainedConfirmation() {
        await I.waitForText('You have removed the detained status from this appeal', 60);
    }

    async checkAppealTabDetentionNo() {
        await I.selectTab('Appeal');
        let appellantInDetention: string = await I.grabTextFrom('//*[@id="case-viewer-field-read--appellantInDetention"]');
        // @ts-ignore
        await I.expectEqual(appellantInDetention, 'No', `The Detention Flag: ${appellantInDetention} on the Appeal Tab is invalid. It should be: No`);
    }

    async validateIsNonDetained() {
        await this.checkAppealTabDetentionNo();
    }


}

// Export as default
//export default new removeDetainedStatus();
export = RemoveDetainedStatus;