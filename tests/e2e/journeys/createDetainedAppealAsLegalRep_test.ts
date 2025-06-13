import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative} from '../detainedConfig'

// @ts-ignore
let caseId: string;
let inTime: boolean = true;

const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
const detainedRepresentedS94bImageLocator: string = '//*[@id="journey_type_legal_rep_detained_s9"]/dt/ccd-markdown/div/markdown/p/img';
const detentionLocation: string = 'immigrationRemovalCentre';
//const detentionLocation: string = 'prison';
//const detentionLocation: string = 'other';


Feature('Detained Appeal - Represented @LegalRepDetainedRepresented');

// @ts-ignore
Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal as Legal Representative ' + (inTime ? 'In Time' : 'Out of Time'),   async ({I, loginPage, createCasePage, createAppeal, serviceRequestPage, paymentPage}) => {
    const typeOfAppeal: string = 'EEA'; // Refusal under EEA regulations
    //const typeOfAppeal: string = 'RHR'; // Refusal human rights
    //const typeOfAppeal: string  = 'DC'; // Deprivation of citizenship
    //const typeOfAppeal: string  = 'EU'; // Refusal of application under the EU Settlement Scheme

    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation(detentionLocation);

    if (detentionLocation === 'prison' || detentionLocation === 'other') {
        await createAppeal.setCustodialSentence('Yes');
    }

    if (detentionLocation === 'immigrationRemovalCentre') {
        await createAppeal.setBailApplication('Yes');
    }

    await createAppeal.setHomeOfficeDetails(inTime);
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);

    if (detentionLocation === 'other') {
        await createAppeal.setAppellentsAddress('detained', 'Yes');
    }

    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder("No");
    await createAppeal.hasRemovalDirections('Yes');
    await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        await createAppeal.hasFeeRemission('No');
    }

    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await I.selectNextStep('Submit your appeal');
    if (!inTime) {
        await createAppeal.setAppealOutOfTime();
    }

    await createAppeal.agreeToDeclaration(true, inTime);

    if (typeOfAppeal !== 'DC') {
        // create service request
        await retryTo(tryNum => {
            serviceRequestPage.createServiceRequest()
        }, 3);

        //await serviceRequestPage.createServiceRequest();

        // make payment - will remove caseId from parmaeters and function when successful payment hyperlink points to correct env
        await retryTo(tryNum => {
            paymentPage.makePayment('CC', caseId);
        }, 3);

        //await paymentPage.makePayment('CC', caseId);
    }

    await I.logout();
}).retry(3);


// @ts-ignore
Scenario('Legal Officer adds s94b appeal status, updates detention location and creates Respondent Direction',   async ({I, loginPage, retrieveCase, createDirection, s94b, updateDetentionLocation}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await s94b.setStatus('Yes');
    await I.validateCorrectLabelDisplayed(detainedRepresentedS94bImageLocator, 'legalRep_detained_s9');
    await I.validateCaseFlagExists('Detained individual', 'ACTIVE');
    await I.selectNextStep('Update detention location');
    await updateDetentionLocation.changeLocation(detentionLocation === 'prison' ? 'other' : (detentionLocation === 'other' ? 'immigrationRemovalCentre' : 'prison'))
    await updateDetentionLocation.validateDataUpdated();
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
Scenario('Legal Officer creates Respondent Review Direction',   async ({I, loginPage, retrieveCase, createDirection}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.selectNextStep('Request respondent review');
    await createDirection.confirmAndSubmitRespondentDirection();
    await I.logout();
}).retry(3);

// @ts-ignore
Scenario('Home Office Officer (respondant) responds to appeal response from Appellant/Legal Rep',   async ({I, loginPage, retrieveCase, createDirection}) => {
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