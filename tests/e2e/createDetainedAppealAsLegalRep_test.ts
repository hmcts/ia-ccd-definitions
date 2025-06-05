import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative} from './detainedConfig'


let caseId: string = '1749125729314236';

const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';

Feature('Detained Appeal - Represented @detainedRepresented');


Before(({ I }) => {
    I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal, serviceRequestPage, paymentPage}) => {
    const typeOfAppeal: string = 'EEA';

    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation('immigration');
    await createAppeal.setHomeOfficeDetails(true);
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder("No");
    await createAppeal.hasRemovalDirections('Yes');
    await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);

    if (typeOfAppeal !== 'RPS') {
        await createAppeal.hasFeeRemission('No');
    }

    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await I.selectNextStep('Submit your appeal');
    await createAppeal.agreeToDeclaration(true);

    // create service request
    await serviceRequestPage.createServiceRequest();

    // make payment - will remove caseId from parmaeters and function when successful payment hyperlink points to correct env
    await paymentPage.makePayment('CC', caseId);

});


// @ts-ignore
Scenario('Legal Officer creates Standard Order',   async ({I, loginPage, retrieveCase, createStandardOrder}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await I.validateCaseFlagExists('Detained individual', 'ACTIVE');
    await I.selectNextStep('Request respondent evidence');
    await createStandardOrder.confirmAndSubmitRespondentDirection();


});

// @ts-ignore
Scenario.skip('test',   async ({I, loginPage, paymentPage}) => {
    await loginPage.signIn(lawFirmUser);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await paymentPage.makePayment('CC');
});
