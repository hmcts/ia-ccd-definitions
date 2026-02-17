import { expect, Page } from "playwright/test";
import { PageHelper } from "../../../helpers/PageHelper";
import { ButtonHelper } from "../../../helpers/ButtonHelper";

export const Add24WeeksStatutoryTimeframe = async (page: Page, reason: string) => {
         const buttonHelper = new ButtonHelper(page);
         await page.waitForTimeout(2000);
         await new PageHelper(page).selectNextStep('Add Statutory Timeframe');
         const reasonField = page.locator('#statutoryTimeframe24WeeksReason');
         await reasonField.waitFor({ state: 'visible', timeout: 5000 });
         await reasonField.fill(reason);
         
         await buttonHelper.continueButton.click();
         await page.waitForTimeout(2000);
         await buttonHelper.submitButton.click();
         await buttonHelper.closeAndReturnToCaseDetailsButton.click();
}

export const Remove24WeeksStatutoryTimeframe = async (page: Page, reason: string) => {
         const buttonHelper = new ButtonHelper(page);
         await page.waitForTimeout(2000);
         await new PageHelper(page).selectNextStep('Remove Statutory Timeframe');
         const reasonField = page.locator('#statutoryTimeframe24WeeksReason');
         await reasonField.waitFor({ state: 'visible', timeout: 5000 });
         await reasonField.fill(reason);
         
         await buttonHelper.continueButton.click();
         await page.waitForTimeout(2000);
         await buttonHelper.submitButton.click();
         await buttonHelper.closeAndReturnToCaseDetailsButton.click();

}

export const Add24WeeksStatutoryTimeframeIsDisabled = async (page: Page) => {
    const dropdown = page.locator('#next-step');
    console.log('Checking if Add Statutory Timeframe is present in Next Steps dropdown');
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });
    const optionsAfterAdd = await dropdown.locator('option').allTextContents();
    console.log('Options after:', optionsAfterAdd);
    expect(optionsAfterAdd.some(opt => opt.includes('Add Statutory Timeframe'))).toBeFalsy();

}