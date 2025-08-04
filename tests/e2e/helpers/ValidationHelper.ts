import { Page, expect } from "@playwright/test";
import { TabsHelper } from "./TabsHelper";

export class ValidationHelper {

    constructor(public page: Page) {}

    async validateCorrectLabelDisplayed(locator: string, label: string) {
        const src:string = await this.page.locator(locator).getAttribute('src');
        await expect(src).toContain(label);
    }

    async validateCaseFlagExists(caseFlag: string, activeInactive: string = 'Active') {
        await new TabsHelper(this.page).selectTab('Case flags');
        const totalTables = await this.page.locator('ccd-case-flag-table').count();
        let flagStatusMatched: boolean = false;

        for (let i = 0; i < totalTables; i++) {
            const table = await this.page.locator('ccd-case-flag-table').nth(i);
            const rows = await table.getByRole('row');
            const caseFlagCount = await rows.filter({hasText: 'Detained individual'}).count();
            if (caseFlagCount > 0) {
                for (let j = 0; j < caseFlagCount; j++) {
                    const targetRow = await rows.filter({hasText: 'Detained individual'}).nth(j);
                    const cellCount = await targetRow.getByRole('cell').count();
                    const flagStatus = await targetRow.getByRole('cell').nth(cellCount - 1).innerText();

                    if (activeInactive === 'Active') {
                        if (flagStatus === activeInactive.toUpperCase()) {
                            flagStatusMatched = true;
                            break;
                        } else {
                            flagStatusMatched = false;
                        }
                    }

                    if (activeInactive === 'Inactive') {
                        if (flagStatus !== activeInactive.toUpperCase()) {
                            flagStatusMatched = false;
                            break;
                        } else {
                            flagStatusMatched = true;
                        }
                    }
                }
            }
        }
        await expect(flagStatusMatched).toEqual(true);
    }
}