import {lawFirmUser, aatUrl} from './detainedConfig'

let caseId: string;


Feature('Detained Appeal');

Before(({ I }) => {
    // or Background
    I.amOnPage(aatUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal',   async ({I, loginPage, createCasePage, createAppeal}) => {
    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal. setDetentionLocation('immigration');
    await createAppeal.setHomeOfficeSetails();
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal();
    await createAppeal.setAppellantBasicDetails();
    await createAppeal.setNationality(true);
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder("No");
    await createAppeal.hasRemovalOrder('No');
    await createAppeal.hasNewMatters('No');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegsRepresentatibecDetails();
    await createAppeal.isHearingRequired(true);
    await createAppeal.hasFeeRemission('No');
    await createAppeal.checkMyAnswers();

    //() => `${caseNumber.split('-').join('').replace(/#/, '')}`;
    caseId = await I.grabCaseNumber();
    console.log('>>>>', caseId);
    await I.wait(6);
});
