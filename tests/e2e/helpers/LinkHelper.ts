import { Page } from "@playwright/test";

export class LinkHelper {

    constructor(public page: Page) {}

    readonly signOut = this.page.getByRole('link', {name: 'Sign out'});


}