import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative} from './detainedConfig'


let caseId: string;

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
    await I.logout();
});


// @ts-ignore
Scenario('Legal Officer creates Respondent Direction',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await I.validateCaseFlagExists('Detained individual', 'ACTIVE');
    await I.selectNextStep('Request respondent evidence');
    await createDirection.confirmAndSubmitRespondentDirection();
    await I.logout();
}).retry(3);

// @ts-ignore
Scenario('Home Office Officer (respondant) review appeal and upload Home Office bundle',   async ({I, loginPage, retrieveCase, homeOffice}) => {
    await loginPage.signIn(homeOfficeOfficer);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await I.selectNextStep('Upload Home Office bundle');
    await homeOffice.uploadBundle();
    await I.logout();
}).retry(3);


// @ts-ignore
Scenario('Legal Officer directs appellant/Legal Rep to build case',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(legalOfficer);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await I.selectNextStep('Request case building');
    await createDirection.confirmAndSubmitCaseBuildingDirection();
    await I.logout();
}).retry(3);


// @ts-ignore
Scenario('Appellant/Legal Rep build case',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(lawFirmUser);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await I.selectNextStep('Build your case');
    // TODO: move to function to be used by scenarios
    await I.waitForElement('#caseArgumentDocument', 60);
    await I.attachFile('#caseArgumentDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
    await I.clickSubmit();
    await I.waitForText('You have submitted your case');
    await I.clickCloseAndReturnToCaseDetails();
    await I.logout();
}).retry(3);

// @ts-ignore
Scenario.skip('Legal Officer creates Respondent Review Direction',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.selectNextStep('Request respondent review');
    await createDirection.confirmAndSubmitRespondentDirection();
    await I.logout();
}).retry(3);

// @ts-ignore
Scenario.skip('Home Office Officer (respondant) responds to appeal response from Appellant/Legal Rep',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(homeOfficeOfficer);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await I.selectNextStep('Upload the appeal response');
    await I.waitForElement('#appealReviewOutcome-decisionMaintained', 60);
    await I.click('#appealReviewOutcome-decisionMaintained');
    await I.clickContinue();
    // TODO: move to function to be used by multiple scenarios
    await I.waitForElement('#homeOfficeAppealResponseDocument', 60);
    await I.attachFile('#homeOfficeAppealResponseDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
    await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
    await I.clickContinue();
    // end code to move
    await I.clickButtonOrLink('Upload');
    await I.waitForText('You\'ve uploaded the appeal response');
    await I.clickCloseAndReturnToCaseDetails();
    await I.logout();
}).retry(3);


// @ts-ignore
Scenario.skip('test',   async ({I, loginPage, paymentPage}) => {
    await loginPage.signIn(lawFirmUser);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await paymentPage.makePayment('CC');
});
