import {lawFirmUser, envUrl} from './detainedConfig'


Feature('Smoke Test @smoke');

Before(({ I }) => {
    // or Background
    I.amOnPage(envUrl);
})

// @ts-expect-error stop warning
Scenario('Checking system is UP',   async ({loginPage, createCasePage}) => {
    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
});
