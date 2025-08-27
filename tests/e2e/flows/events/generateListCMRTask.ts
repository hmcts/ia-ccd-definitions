import { Page } from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';

export class GenerateListCMR {

    constructor(public page: Page) {}

    readonly generateCMRTaskButton = this.page.getByRole('button', { name: 'Submit' });

    async createTask() {
        await new PageHelper(this.page).selectNextStep('Generate List CMR Task');
        await this.generateCMRTaskButton.click();
    };
}