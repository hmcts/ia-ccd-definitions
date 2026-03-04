import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper} from "../../../helpers/ButtonHelper";

export class RequestHomeOfficeData {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    readonly requestHomeOfficeDataButton = this.page.getByRole('button', { name: 'Request Home Office data' });



    async matchAppellantDetails() {
        await new PageHelper(this.page).selectNextStep('Request Home Office data');
        await this.buttonHelper.continueButton.click();
        await this.requestHomeOfficeDataButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}