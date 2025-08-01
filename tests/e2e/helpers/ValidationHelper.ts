import { Page, expect } from "@playwright/test";

export class ValidationHelper {

    constructor(public page: Page) {}

    async validateCorrectLabelDisplayed(locator: string, label: string) {
        const src:string = await this.page.locator(locator).getAttribute('src');
        await expect(src).toContain(label);
    }
}