import { Page } from "@playwright/test";

export class ButtonHelper {

    constructor(public page: Page) {}

    readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
    readonly submitButton = this.page.getByRole('button', { name: 'Submit'});
    readonly saveAndContinueButton = this.page.getByRole('button', { name: 'Save and continue' });
    readonly closeAndReturnToCaseDetails = this.page.getByRole('button', { name: 'Close and Return to case details' });


}