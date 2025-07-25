import { test, expect } from '@playwright/test';
//import { IdamPage } from 'e2e/page-objects/pages/idam.po';

//let caseId: string = '1752655171618589';
const inTime: boolean = true;
const cmrListing: boolean = true;

test.describe('navigation. @LegalRepCreatesDetainedRepresentedPlaywright', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto('https://playwright.dev/');
    });

    test('main navigation', async ({ page }) => {
        // Assertions use the expect API.
        await expect(page).toHaveURL('https://playwright.dev/');
    });

    test('Create Detained Appeal as Legal Representative ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + (cmrListing ? 'with' : 'without') + ' CMR listing', async ({ page }) => {
        await page.goto('https://playwright.dev/');
        console.log('poo');
    });
});