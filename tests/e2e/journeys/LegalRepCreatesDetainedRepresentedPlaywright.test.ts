import { test } from '@playwright/test';
import { envUrl, LegalRepresentative} from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';

//let caseId: string = '1752655171618589';
//const inTime: boolean = true;
//const cmrListing: boolean = true;

test.describe('Create Appeal. @LegalRepCreatesDetainedRepresentedPlaywright', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto(envUrl);
    });

    test('Create Appeal', async ({ page }) => {
      await new IdamPage(page).login(LegalRepresentative);
    });

});