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

    async waitForHearingBundleToBeGenerated() {
        const maxRetries: number = 10;
        let retry: number = 0;
        while (await this.page.locator('#progress_caseOfficer_finalBundling_in_new').isVisible()) {
            if (retry < maxRetries) {
                retry++;
                console.log('Refreshing webpage, try: ' + retry + ' of ' + maxRetries);
                await this.page.reload();
                const visibleElement = await this.page.locator('#next-step');
                await visibleElement.waitFor({state: 'visible'});
            } else {
                break;
            }
        }
    }
}