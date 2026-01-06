import { test as setup, expect } from "@playwright/test";
import {UserCredentials} from "../tests/e2e/page-objects/pages/idam.po";

setup("Authenticate Admin", async ({ page }) => {
    const authFile = "./.auth/LegalAdminOfficer.json";
    let userName: string = 'CRD_func_test_aat_adm66@justice.gov.uk';
    let password: string = 'AldgateT0wer';
console.log('RUNNING SETUP1');
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

setup("Authenticate Legal Rep", async ({ page }) => {
    const authFile = "./.auth/LegalRepresentative.json";
    let userName: string = 'ialegalreporgcreator12@mailnesia.com';
    let password: string = 'Aldg@teT0wer';
    console.log('RUNNING SETUP2');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/div/h1')).toContainText('Case list')

// Save authentication state
    await page.context().storageState({ path: authFile });
});