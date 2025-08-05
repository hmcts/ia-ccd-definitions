import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper} from "../../helpers/ButtonHelper";

export class RequestHomeOfficeData {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly requestHomeOfficeDataButton = this.page.getByRole('button', { name: 'Request Home Office data' });



    async matchAppellantDetails() {
        await new PageHelper(this.page).selectNextStep('Request Home Office data');
        //await I.selectNextStep('Request Home Office data');
        //await I.waitForElement('#homeOfficeAppellantsList');
        await this.buttonHelper.continueButton.click();
        //await I.clickContinue();
        await this.requestHomeOfficeDataButton.click();
        //await I.clickButtonOrLink('Request Home Office data');
        //await I.see('You have matched the appellant details');
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
        //await I.clickCloseAndReturnToCaseDetails();
    };
}