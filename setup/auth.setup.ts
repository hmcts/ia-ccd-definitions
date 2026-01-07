import { test as setup, expect } from "@playwright/test";
import {UserCredentials} from "../tests/e2e/page-objects/pages/idam.po";

setup("Authenticate Legal Admin", async ({ page }) => {
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
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Legal Officer", async ({ page }) => {
    const authFile = "./.auth/LegalOfficer.json";
    let userName: string = 'CRD_func_test_aat_stcw@justice.gov.uk';
    let password: string = 'AldgateT0wer';
    console.log('RUNNING SETUP2');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate HomeOffice", async ({ page }) => {
    const authFile = "./.auth/HomeOffice.json";
    let userName: string = 'ia.respondentoffice.ccd@gmail.com';
    let password: string = 'AldgateT0wer';
    console.log('RUNNING SETUP3');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    //*[@id="content"]/div/h1
    await expect(page.locator('//*[@id="content"]/div/h1')).toContainText('Case list');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Listing Officer", async ({ page }) => {
    const authFile = "./.auth/ListingOfficer.json";
    let userName: string = 'CRD_func_test_aat_stcw@justice.gov.uk';
    let password: string = 'AldgateT0wer';
    console.log('RUNNING SETUP4');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    //*[@id="content"]/div/h1
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Judge", async ({ page }) => {
    const authFile = "./.auth/Judge.json";
    let userName: string = 'ia.iacjudge.ccd@gmail.com';
    let password: string = 'AldgateT0wer';
    console.log('RUNNING SETUP5');
    // Navigate to login page
    await page.goto('https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net');

    // Perform login
    await page.locator("#username").fill(userName);
    await page.locator("#password").fill(password);
    await page.locator('[name="save"]').click();

    // Assertion: Verify login success
    //*[@id="content"]/div/h1
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

