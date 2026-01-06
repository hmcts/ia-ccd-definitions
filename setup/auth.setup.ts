import { test as setup, expect } from "@playwright/test";
import {UserCredentials} from "../tests/e2e/page-objects/pages/idam.po";
const authFile = "./.auth/authentication.json";
setup("Authentication", async ({ page }) => {

    let userName: string = 'CRD_func_test_aat_adm66@justice.gov.uk';
    let password: string = 'AldgateT0wer';
console.log('RUNNING SETUP');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work')

// Save authentication state
    await page.context().storageState({ path: authFile });
});