import { test } from '@playwright/test';
import { envUrl, legalRepresentativeCredentials } from './iacConfig';
import {IdamPage} from './page-objects/pages/idam.po';
import { CreateCasePage } from './page-objects/pages/createCase_page';
import { LinkHelper} from "./helpers/LinkHelper";


test.describe('Smoke Test',  { tag: '@smoke'}, () =>
{
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto(envUrl);
    });

    test('Checking system is UP',   async ({ page }) => {
        await new IdamPage(page).login(legalRepresentativeCredentials);
        await new CreateCasePage(page).createCase();
        await new LinkHelper(page).signOut.click();
    });
});
