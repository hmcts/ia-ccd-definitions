// in this file you can append custom step methods to 'I' object
const goButton: string = '//*[@id="content"]/div[1]/div[2]/ccd-event-trigger/form/button';

export = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    async clickContinue() {
      await this.click('Continue');
    },

    async clickSaveAndContinue() {
      await this.click('Save and continue');
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
    }
  });
}
