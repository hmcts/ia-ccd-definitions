// in this file you can append custom step methods to 'I' object

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

      return await this.grabTextFrom('.alert-message');
    },
  });
}
