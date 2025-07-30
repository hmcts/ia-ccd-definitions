import { test } from '@playwright/test';
import { envUrl, LegalRepresentative} from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';
import { CreateCasePage } from '../page-objects/pages/createCase_page';
import { CreateAppeal } from '../flows/createAppealPlaywright';

//let caseId: string = '1752655171618589';
//const inTime: boolean = true;
//const cmrListing: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';

test.describe('Create Appeal. @LegalRepCreatesDetainedRepresentedPlaywright', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto(envUrl);
    });

    test('Create Detained Appeal', async ({ page }) => {
      const createAppeal = new CreateAppeal(page);
      await new IdamPage(page).login(LegalRepresentative);
      await new CreateCasePage(page).createCase();
      await createAppeal.locationInUK('Yes');
      await createAppeal.inDetention('Yes');
      await createAppeal.setDetentionLocation(detentionLocation);
    });

});