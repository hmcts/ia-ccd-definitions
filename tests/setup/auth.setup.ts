import {test as setup, expect, test} from "@playwright/test";
import {
    envUrl, homeOfficeOfficerCredentials, judgeCredentials,
    legalOfficerAdminCredentials,
    legalOfficerCredentials,
    listingOfficerCredentials
} from '../iacConfig';
import {IdamPage} from '../e2e/page-objects/pages/idam.po';

let idamPage: IdamPage;
test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    idamPage = new IdamPage(page);
    await page.goto(envUrl);
});


setup("Authenticate Legal Officer Admin", async ({ page }) => {
    const authFile = "./.auth/LegalOfficerAdmin.json";

    //Login
    await idamPage.login(legalOfficerAdminCredentials);

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

    // Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Legal Officer", async ({ page }) => {
    const authFile = "./.auth/LegalOfficer.json";

    //Login
    await idamPage.login(legalOfficerCredentials);

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

    // Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Home Office Officer", async ({ page }) => {
    const authFile = "./.auth/HomeOfficeOfficer.json";

    //Login
    await idamPage.login(homeOfficeOfficerCredentials);

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/div/h1')).toContainText('Case list');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Listing Officer", async ({ page }) => {
    const authFile = "./.auth/ListingOfficer.json";

    //Login
    await idamPage.login(listingOfficerCredentials);

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

// Save authentication state
    await page.context().storageState({ path: authFile });
});

setup("Authenticate Judge", async ({ page }) => {
    const authFile = "./.auth/Judge.json";

    //Login
    await idamPage.login(judgeCredentials);

    // Assertion: Verify login success
    await expect(page.locator('//*[@id="content"]/h3')).toContainText('My work');

    // Save authentication state
    await page.context().storageState({ path: authFile });
});

