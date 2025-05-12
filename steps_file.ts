// in this file you can append custom step methods to 'I' object
import {output} from "codeceptjs";

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
        console.log('urlBefore>>>>',urlBefore);
        console.log('urlAfter>>>>',urlAfter);
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

  });
}
