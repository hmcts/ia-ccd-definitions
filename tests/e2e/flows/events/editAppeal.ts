import { Page } from "@playwright/test";
import { PageHelper } from '../../../helpers/PageHelper';

export class EditAppeal {

    constructor(public page: Page) {
    }

    async edit() {
        await new PageHelper(this.page).selectNextStep('Edit appeal');
    };
}