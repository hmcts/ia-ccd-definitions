import { Page } from "@playwright/test";

export class LinkHelper {

    constructor(public page: Page) {}

    readonly signOut = this.page.locator('.hmcts-header__navigation-link');


}