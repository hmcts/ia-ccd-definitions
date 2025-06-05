// in this file you can append custom step methods to 'I' object

const goButton: string = '//*[@id="content"]/div[1]/div[2]/ccd-event-trigger/form/button';
const signInButton: string = 'input[value="Sign in"]';

export = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    async clickContinue() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Continue'), urlBefore);
    },

    async clickSaveAndContinue() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Save and continue'), urlBefore);
    },

    async clickStart() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Start'), urlBefore);
    },

    async clickSignIn() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick(signInButton), urlBefore);
    },

    async clickSubmit() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Submit'), urlBefore);
    },

    async clickCloseAndReturnToCaseDetails() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Close and Return to case details'), urlBefore);
    },

    async clickSendDirection() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Send direction'), urlBefore);
    },

    async clickButtonOrLink(buttonOrLinkText: string) {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick(buttonOrLinkText), urlBefore);
    },

    async clickButtonOrLinkWithoutRetry(buttonOrLinkText: string) {
      await this.forceClick(buttonOrLinkText);
    },

    async grabCaseNumber() {
      await this.waitForElement('.alert-message');

      let message: string = await this.grabTextFrom('.alert-message');
      let caseId: string = (message.split('#')[1].split(' ')[0]).split('-').join('');
      return caseId;
    },

    async selectNextStep(nextStep: string) {
      await this.selectOption('#next-step', nextStep);
      await this.waitForEnabled(goButton);
      await this.click(goButton);
    },

    async retryUntilUrlChanges(action, urlBefore, maxNumberOfTries = 6) {
      let urlAfter;
      console.log('urlBefore>>>>',urlBefore);
      for (let tryNumber = 1; tryNumber <= maxNumberOfTries; tryNumber++) {
        console.log(`Checking if URL has changed, starting try #${tryNumber}`);
        await action();
        await this.sleep(3000 * tryNumber);
        urlAfter = await this.grabCurrentUrl();
        //console.log('urlBefore>>>>',urlBefore);
        //console.log('urlAfter>>>>',urlAfter);
        if (urlBefore !== urlAfter) {
          console.log(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url changed after try #${tryNumber} was executed`);
          break;
        } else {
          console.log(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url did not change after try #${tryNumber} was executed`);
        }
        if (tryNumber === maxNumberOfTries) {
          throw new Error(`Maximum number of tries (${maxNumberOfTries}) has been reached trying to change urls. Before: ${urlBefore}. After: ${urlAfter}`);
        }
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async validateCorrectLabelDisplayed(locator: string, label: string) {
      console.log('label>>>', label);
      let src: string = await this.grabAttributeFrom(locator, 'src');

      await this.expectContain(src, label, 'Incorrect or missing Label');
    },

    async validateCaseFlagExists(caseFlag: string, activeInactive: string = 'ACTIVE') {
      const tabName: string = 'Case flags';
      await this.selectTab(tabName);
      // Only works for single flag of detained individual - will need to update if this to be used for mutliple case flags
      this.see(caseFlag);
      this.see(activeInactive.toUpperCase())
    },

    async selectTab(tabName: string) {
      const tabLabel: string = 'mat-tab-label-';
      const noOfTabs: number = await this.grabNumberOfVisibleElements('.mat-tab-label-content');

      // as the tab group number changes dependent on the journey we need to ascertain this before
      // we can try and select the relevant tab
      // ie when tabs are displayed after appeal submission they are labelled: #mat-tab-label-0
      // after creating a service request they are labelled: #mat-tab-label-2

      let tabId = await this.grabAttributeFrom('.mat-tab-labels > div', 'id');
      let tabGroupNumber = (tabId.split(tabLabel)[1]).split('-')[0];

      for (let i = 0; i < noOfTabs; i++) {
        let tabLocator: string = `#${tabLabel}${tabGroupNumber}-${i} > div`;

        if (await this.grabTextFrom(tabLocator) === tabName) {
          await this.click(tabLocator)
          break;
        }
      }
    },

  });
}
