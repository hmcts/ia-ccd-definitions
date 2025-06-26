import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative, legalAdmin} from '../detainedConfig'

// @ts-ignore
let caseId: string = '1750958170473622';
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
    //const typeOfAppeal: string = 'EEA'; // Refusal under EEA regulations (payment required)
    //const typeOfAppeal: string = 'RHR'; // Refusal human rights (payment required)
    //const typeOfAppeal: string  = 'DC'; // Deprivation of citizenship (no payment required)
    //const typeOfAppeal: string  = 'EU'; // Refusal of application under the EU Settlement Scheme (payment required)
    const typeOfAppeal: string = 'RPS'; // Revocation of a protection status (no payment required)
    // const typeOfAppeal:string = 'RPC'; // Refusal of protection claim (payment required)

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

    await createAppeal.setHomeOfficeDetails(true); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);

    if (detentionLocation === 'other') {
        await createAppeal.setAppellentsAddress('detained', 'Yes');
    }

    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder("Yes");
    await createAppeal.hasRemovalDirections('Yes');
    await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        await createAppeal.hasFeeRemission('No');
    }

    if (typeOfAppeal === 'RPC') {
        await createAppeal.setPayNowLater('Now');
    }

    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await I.selectNextStep('Submit your appeal');
    if (!inTime) {
        await createAppeal.setAppealOutOfTime();
    }

    await createAppeal.agreeToDeclaration(true, inTime);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        // create service request
       await serviceRequestPage.createServiceRequest();

        // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
       await paymentPage.makePayment('CC', caseId);
    }

    await I.logout();
}).retry(3);



//
// // @ts-ignore
// Scenario('Home Office Officer (respondant) review appeal and upload Home Office bundle',   async ({I, loginPage, retrieveCase, homeOffice}) => {
//     await loginPage.signIn(homeOfficeOfficer);
//     await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
//     await I.waitForText('Case details', 60);
//     await I.selectNextStep('Upload Home Office bundle');
//     await homeOffice.uploadBundle();
//     await I.logout();
// }).retry(3);
//
//
// // @ts-ignore
// Scenario('Legal Officer directs appellant/Legal Rep to build case',   async ({I, loginPage, retrieveCase, createDirection}) => {
//     await loginPage.signIn(legalOfficer);
//     await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
//     await I.waitForText('Case details', 60);
//     await I.selectNextStep('Request case building');
//     await createDirection.confirmAndSubmitCaseBuildingDirection();
//     await I.logout();
// }).retry(3);
//
//
// // @ts-ignore
// Scenario('Appellant/Legal Rep build case',   async ({I, loginPage, retrieveCase, createDirection}) => {
//     await loginPage.signIn(lawFirmUser);
//     await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
//     await I.waitForText('Case details', 60);
//     await I.selectNextStep('Build your case');
//     // TODO: move to function to be used by scenarios
//     await I.waitForElement('#caseArgumentDocument', 60);
//     await I.attachFile('#caseArgumentDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
//     await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
//     await I.clickContinue();
//     await I.clickSubmit();
//     await I.waitForText('You have submitted your case');
//     await I.clickCloseAndReturnToCaseDetails();
//     await I.logout();
// }).retry(3);
//
// // @ts-ignore
// Scenario('Legal Officer creates Respondent Review Direction',   async ({I, loginPage, retrieveCase, createDirection}) => {
//     await loginPage.signIn(legalOfficer);
//     await retrieveCase.getCase(caseId);
//     await I.waitForText('Case details',60);
//     await I.selectNextStep('Request respondent review');
//     await createDirection.confirmAndSubmitRespondentDirection();
//     await I.logout();
// }).retry(3);
//
// // @ts-ignore
// Scenario('Home Office Officer (respondant) responds to appeal response from Appellant/Legal Rep',   async ({I, loginPage, retrieveCase, createDirection}) => {
//     await loginPage.signIn(homeOfficeOfficer);
//     await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
//     await I.waitForText('Case details',60);
//     await I.selectNextStep('Upload the appeal response');
//     await I.waitForElement('#appealReviewOutcome-decisionMaintained', 60);
//     await I.click('#appealReviewOutcome-decisionMaintained');
//     await I.clickContinue();
//     // TODO: move to function to be used by multiple scenarios
//     await I.waitForElement('#homeOfficeAppealResponseDocument', 60);
//     await I.attachFile('#homeOfficeAppealResponseDocument', './tests/documents/TEST_DOCUMENT_1.pdf');
//     await I.waitForInvisible(locate('.error-message').withText('Uploading...'),20);
//     await I.clickContinue();
//     // end code to move
//     await I.clickButtonOrLink('Upload');
//     await I.waitForText('You\'ve uploaded the appeal response');
//     await I.clickCloseAndReturnToCaseDetails();
//     await I.logout();
// }).retry(3);
//

// @ts-ignore
Scenario('Admin removes detained status',   async ({I, loginPage, removeDetainedStatus}) => {
    await loginPage.signIn(legalAdmin);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await I.selectNextStep('Remove Detained Status');
    await removeDetainedStatus.removeDetainedStatus();
    await I.clickCloseAndReturnToCaseDetails();
    await I.validateCaseFlagExists('Detained individual', 'Inactive');
    await removeDetainedStatus.checkIfNonDetained();
    await I.logout();
}).retry(3);