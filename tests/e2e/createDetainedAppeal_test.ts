import {lawFirmUser, aatUrl, legalOfficer, homeOfficeOfficer, legalRepresentative} from './detainedConfig'

let caseId: string;

Feature('Detained Appeal - Represented £detainedRepresented');


Before(({ I }) => {
    I.amOnPage(aatUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal}) => {
    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation('immigration');
    await createAppeal.setHomeOfficeSetails();
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal();
    await createAppeal.setAppellantBasicDetails();
    await createAppeal.setNationality(true);
    await createAppeal.hasSponsor('Yes');
    await createAppeal.hasDepotationOrder("No");
    await createAppeal.hasRemovalDirections('Yes');
    await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegsRepresentatibecDetails();
    await createAppeal.isHearingRequired(true);
    await createAppeal.hasFeeRemission('No');
    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>',caseId);

    await I.selectNextStep('Submit your appeal');
    await createAppeal.agreeToDeclaration();
});


// @ts-ignore
Scenario('Legal Officer creates Standard Order',   async ({I, loginPage, retrieveCase, createStandarOrder}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await createStandarOrder.isCorrectLabelDisplayed('legally_represented_detained_appeal');
});
