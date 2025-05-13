import {aatUrl, legalAdmin} from './detainedConfig'

let caseId: string;
let inTime: boolean = false;
Feature('Detained Appeal - Legal Admin @detainedLegalAdmin');


Before(({ I }) => {
    I.amOnPage(aatUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal as Legal Admin',   async ({I, loginPage, createCasePage, createAppeal}) => {
    await loginPage.signIn(legalAdmin);
    await createCasePage.createCase();

    // Before you start page
    await I.clickContinue();
    await createAppeal.setTribunalAppealReceived();
    await createAppeal.appellantInPerson('Yes');
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation('immigration');
    await createAppeal.setHomeOfficeSetails(inTime);
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal();
    await createAppeal.setAppellantBasicDetails(true);
    await createAppeal.setNationality(true);
    await createAppeal.appellantDetails();
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder('No');
    await createAppeal.hasRemovalDirections('No');
    // await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    // await createAppeal.setLegsRepresentatibecDetails();
    await createAppeal.isHearingRequired(true);
    await createAppeal.hasFeeRemission('No');

    await createAppeal.uploadAppealDocs();
    await createAppeal.checkMyAnswers();
    await I.clickButtonOrLink('Close and Return to case details');
    //

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>'+caseId+'<<<<<<<<<<<<<');
    //

    await I.selectNextStep('Submit your appeal');
    if (!inTime) {
       await createAppeal.setAppealOutOfTime();
    }

    await createAppeal.agreeToDeclaration(false, false);

});

