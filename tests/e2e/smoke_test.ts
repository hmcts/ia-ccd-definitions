import {lawFirmUser, envUrl} from './detainedConfig'


Feature('Smoke Test @smoke');

Before(({ I }) => {
    // or Background
    I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Checking system is UP',   async ({I, loginPage, createCasePage, createAppeal}) => {
    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
});
