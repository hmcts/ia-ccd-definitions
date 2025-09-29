import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import { ButtonHelper } from "../../helpers/ButtonHelper";
import moment from "moment";

const todayPlus14days = moment().add(14, 'days');

export class ListTheCase {
    private buttonHelper: ButtonHelper;
    readonly listCaseButton = this.page.getByText('List case');


    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async list(isRemoteHearing: string = 'No') {
        await new PageHelper(this.page).selectNextStep('List the case');
        await this.page.fill('#ariaListingReference', 'LP/12345/2019');
        await this.page.selectOption('#listingLocation', 'Atlantic Quay - Glasgow');
        await this.page.check(`#isRemoteHearing_${isRemoteHearing}`);
        await this.page.fill('#listingLength_hours', '1');
        await this.page.fill('#listCaseHearingDate-day', todayPlus14days.date().toString());
        await this.page.fill('#listCaseHearingDate-month', (todayPlus14days.month()+1).toString());
        await this.page.fill('#listCaseHearingDate-year', todayPlus14days.year().toString());
        await this.page.fill('#listCaseHearingDate-hour', '10');
        await this.buttonHelper.continueButton.click();
        await this.listCaseButton.click();
        await this.buttonHelper.closeAndReturnToCaseDetailsButton.click();
    };
}