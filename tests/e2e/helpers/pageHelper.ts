import { Page } from "@playwright/test";

export class PageHelper {

    constructor(public page: Page) {}

    async grabCaseNumber() {
        await this.page.waitForSelector('.alert-message', { state: 'visible' });
       //waitForElement('.alert-message', 60);
        const message = await this.page.locator('.alert-message').innerText();
        //const message: string = await this.grabTextFrom('.alert-message');

        const caseId: string = (message.split('#')[1].split(' ')[0]).split('-').join('');
        return caseId;
    }

    async selectNextStep(nextStep: string) {
        //const urlBefore = await this.grabCurrentUrl();
        await this.page.locator('#next-step').selectOption(nextStep);
        await this.page.getByRole('button', { name: 'Go' }).click();
        //await this.selectOption('#next-step', nextStep);
        //await this.waitForEnabled(goButton);
        //await this.retryUntilUrlChanges(() => this.forceClick(goButton), urlBefore);
    }
}