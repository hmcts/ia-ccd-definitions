import { test } from '@playwright/test';
import { envUrl, LegalRepresentative} from '../detainedConfig';
import { IdamPage } from '../page-objects/pages/idam.po';
import { CreateCasePage } from '../page-objects/pages/createCase_page';
import { CreateAppeal } from '../flows/createAppealPlaywright';

//let caseId: string = '1752655171618589';
const inTime: boolean = true;
//const cmrListing: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';
//const typeOfAppeal: string = 'refusalOfEu'; // Refusal under EEA regulations (payment required)
//const typeOfAppeal: string = 'refusalOfHumanRights'; // Refusal human rights (payment required)
//const typeOfAppeal: string  = 'deprivation'; // Deprivation of citizenship (no payment required)
//const typeOfAppeal: string  = 'euSettlementScheme'; // Refusal of application under the EU Settlement Scheme (payment required)
//const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)
const typeOfAppeal:string = 'protection'; // Refusal of protection claim (payment required)

test.describe('Create Detained Appeal as Legal Representative ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + '@LegalRepCreatesDetainedRepresentedPlaywright', () => {
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

      if (detentionLocation === 'prison' || detentionLocation === 'other') {
          await createAppeal.setCustodialSentence('Yes');
      }

      if (detentionLocation === 'immigrationRemovalCentre') {
          await createAppeal.setBailApplication('Yes');
      }

      await createAppeal.setHomeOfficeDetails(inTime);
      await createAppeal.uploadNoticeOfDecision();
      await createAppeal.setTypeOfAppeal(typeOfAppeal);
      await createAppeal.setAppellantBasicDetails(false);
      await createAppeal.setNationality(true);


    });

});