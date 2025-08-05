import { Page } from "@playwright/test";

export class PageHelper {

    constructor(public page: Page) {}

    async grabCaseNumber() {
        await this.page.waitForSelector('.alert-message', { state: 'visible' });
        const message = await this.page.innerText('.alert-message');
        const caseId: string = (message.split('#')[1].split(' ')[0]).split('-').join('');
        return caseId;
    }

    async selectNextStep(nextStep: string) {
        await this.page.selectOption('#next-step', nextStep);
        await this.page.waitForTimeout(2000); // waits for 2 seconds
        await this.page.getByRole('button', { name: 'Go' }).click();
    }

    async getCase(caseId: string) {
        await this.page.fill('#exuiCaseReferenceSearch', caseId);
        await this.page.getByRole( 'button', { name: 'Find' }).click();
    }
}