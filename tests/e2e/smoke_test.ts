import {lawFirmUser, aatUrl} from './detainedConfig'


Feature('smoke');

Before(({ I }) => {
    // or Background
    I.amOnPage(aatUrl);
})

// @ts-ignore
Scenario('Checking system is UP',   async ({I, loginPage, createCasePage, createAppeal}) => {
    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
});
