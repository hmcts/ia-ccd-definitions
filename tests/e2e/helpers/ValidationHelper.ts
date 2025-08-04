import { Page, expect } from "@playwright/test";
//import { TabsHelper } from "./TabsHelper";

export class ValidationHelper {

    constructor(public page: Page) {}

    async validateCorrectLabelDisplayed(locator: string, label: string) {
        const src:string = await this.page.locator(locator).getAttribute('src');
        await expect(src).toContain(label);
    }

    // async validateCaseFlagExists(caseFlag: string, activeInactive: string = 'Active') {
    //     const tabName: string = 'Case flags';
    //     await new TabsHelper(this.page).selectTab('Case flags');
    //     //await this.selectTab(tabName);
    //     const testing  = await this.page.getByText('Detained individual');
    //     console.log('case flag locator>>>>', testing.innerText());


      //  const hasCaseFlagBeenLocated: boolean = this.page.locator('tr')
        //const hasCaseFlagBeenLocated = await tryTo(() => this.grabTextFrom(locate('tr').inside('ccd-case-flag-table').withText(caseFlag).find('td').withText(activeInactive)));
       // this.expectTrue(hasCaseFlagBeenLocated, `Could not locate case flag: ${caseFlag} with status of: ${activeInactive}`)
   // }

    // async getTableDetails() {
    //     const table = page.locator('#table');
    //     const rows = table.locator('tbody tr');
    //     const rowCount = await rows.count();
    //
    //     console.log(`Rows count: ${rowCount}`);
    //
    //     const cols = rows.first().locator('td');
    //     const colCount = await cols.count();
    //
    //     console.log(`Cols count: ${colCount}`);
    //
    //     // Extract table data using map
    //     const tableData = await rows.evaluateAll((rowElements) => {
    //         return rowElements.map(row => {
    //             return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim());
    //         });
    //     });
    //
    //     console.log('tableData:', tableData);
    // }
}