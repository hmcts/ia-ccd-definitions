import moment from "moment";
import {appellant} from "../../detainedConfig";


const { I } = inject();

class removeDetainedStatus {

    async detentionRemovalDetails() {
        const monthAgo = moment().subtract(1, 'month');

        await I.waitForText(`Detention removal details`, 60);

        await I.fillField('#detentionRemovalDate-day', monthAgo.date().toString());
        await I.fillField('#detentionRemovalDate-month', (monthAgo.month() + 1).toString());
        await I.fillField('#detentionRemovalDate-year', monthAgo.year().toString());

        await I.fillField('#detentionRemovalReason','Testing reason why appellant was removed from detention');
        await I.clickContinue();
    }

    async appellantAddress(hasPostalAddress: string = 'Yes') {
        await I.click(`#appellantHasFixedAddress_${hasPostalAddress}`);

        await I.waitForElement('#appellantAddress_appellantAddress_postcodeInput');
        await I.fillField('#appellantAddress_appellantAddress_postcodeInput', 'B11LS');
        await I.click('//button[contains(text(), "Find address")]');
        await I.wait(2);
        await I.selectOption('#appellantAddress_appellantAddress_addressList', 'Apartment 1, Westside One, 22 Suffolk Street Queensway, Birmingham '); // First valid address
        await I.clickContinue();
    }

    async appellantContactPreference(preference: 'email' | 'text') {
        await I.waitForText('The appellant\'s contact preference', 60);

        if (preference === 'email') {
            // Select email option
            await I.click('#contactPreference-wantsEmail');
            // Fill in email field from config
            await I.waitForElement('#email', 5);
            await I.fillField('#email', appellant.email);
        } else if (preference === 'text') {
            // Select text message option
            await I.click('#contactPreference-wantsSms');
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


    async removeDetainedStatus(contactPreference: 'email' | 'text' = 'email') {
        await this.detentionRemovalDetails();
        await this.appellantAddress('Yes');
        await this.appellantContactPreference(contactPreference);
        await this.removeDetainedCYA();
        await I.clickButtonOrLink('Remove Detained Status');
        await this.removeDetainedConfirmation();
    }

    async checkIfNonDetained() {
        await this.checkAppealTabDetentionNo();
    }


}

// Export as default
//export default new removeDetainedStatus();
export = removeDetainedStatus;