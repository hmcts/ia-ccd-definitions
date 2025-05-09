const { I } = inject();

class loginPage {
  private usernameField: string;
  private passwordField: string;
  private signInButton: string;

  constructor() {
    this.usernameField = '#username';
    this.passwordField = '#password';

    this.signInButton = 'input[value="Sign in"]';
    //insert your locators
    // this.button = '#button'
  }
  // insert your methods here

  async signIn(user){
    if (user.email && user.password) {
      await I.waitForElement(this.usernameField,30);
      await I.fillField(this.usernameField, user.email);
      await I.fillField(this.passwordField, user.password);
      await I.click(this.signInButton);
      await I.wait(20);
    }
    else {
      console.log('*******User details are empty. Cannot login. *******');
    }
  }
}

// For inheritance
//module.exports = new loginPage();
export = loginPage;
