import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';
import { ButtonHelper} from "../../../helpers/ButtonHelper";

export class TurnOnNotifications {
    private buttonHelper: ButtonHelper;

    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async submit() {
        await new PageHelper(this.page).selectNextStep('Turn on notifications/WA tasks');
        await this.buttonHelper.submitButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}