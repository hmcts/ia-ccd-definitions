import {envUrl, legalAdmin} from '../detainedConfig'

let caseId: string;
let inTime: boolean = true;

Feature('Legally Represented - Manual Detained Appeal - Legal Admin @LegalAdminDetainedRepresented');


Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Represented Detained Appeal in Prison with Custodial sentence - ' + (inTime ? 'In Time' : 'Out of Time') + ' - Then remove detained status',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal, removeDetainedStatus}) => {
    //const typeOfAppeal: string = 'EEA'; // Refusal under EEA regulations (payment required)
    //const typeOfAppeal: string = 'RHR'; // Refusal human rights (payment required)
    // const typeOfAppeal: string  = 'DC'; // Deprivation of citizenship (no payment required)
    //const typeOfAppeal: string  = 'EU'; // Refusal of application under the EU Settlement Scheme (payment required)
    const typeOfAppeal: string = 'RPS'; // Revocation of a protection status (no payment required)
    //const typeOfAppeal:string = 'RPC'; // Refusal of protection claim (payment required)

    const detentionLocation: string = 'prison';

    await loginPage.signIn(legalAdmin);
    await createCasePage.createCase();

    // Before you start page
    await I.clickContinue();
    await createAppeal.setTribunalAppealReceived();
    await createAppeal.appellantInPerson('No', 'Yes');
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation(detentionLocation);
    await createAppeal.setCustodialSentence('Yes'); //detention location is prison
    await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(true);
    await createAppeal.setNationality(true);
    await createAppeal.appellantDetails();
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder('No');
    await createAppeal.hasRemovalDirections('No');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.isHearingRequired(true);
    await createAppeal.uploadAppealDocs();
    await createAppeal.checkMyAnswers();
    await I.clickCloseAndReturnToCaseDetails();
    //

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>'+caseId+'<<<<<<<<<<<<<');

    await draftAppeal.submit(false, inTime);

    await removeDetainedStatus.removeStatusAiPNo();
    await I.validateCaseFlagExists('Detained individual', 'Inactive');
    await removeDetainedStatus.validateDataOnAppealTab(detentionLocation);
    await I.logout();

}).retry(3);

// @ts-ignore
Scenario('Create Represented Detained Appeal in Immigration Removal Centre - ' + (inTime ? 'In Time' : 'Out of Time') + ' - Then remove detained status',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal, removeDetainedStatus}) => {
    //const typeOfAppeal: string = 'EEA'; // Refusal under EEA regulations (payment required)
    //const typeOfAppeal: string = 'RHR'; // Refusal human rights (payment required)
    // const typeOfAppeal: string  = 'DC'; // Deprivation of citizenship (no payment required)
    //const typeOfAppeal: string  = 'EU'; // Refusal of application under the EU Settlement Scheme (payment required)
    const typeOfAppeal: string = 'RPS'; // Revocation of a protection status (no payment required)
    //const typeOfAppeal:string = 'RPC'; // Refusal of protection claim (payment required)

    const detentionLocation: string = 'immigrationRemovalCentre';

    await loginPage.signIn(legalAdmin);
    await createCasePage.createCase();

    // Before you start page
    await I.clickContinue();
    await createAppeal.setTribunalAppealReceived();
    await createAppeal.appellantInPerson('No', 'Yes');
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation(detentionLocation);
    await createAppeal.setBailApplication('Yes');
    await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(true);
    await createAppeal.setNationality(true);
    await createAppeal.appellantDetails();
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder('No');
    await createAppeal.hasRemovalDirections('No');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.isHearingRequired(true);
    await createAppeal.uploadAppealDocs();
    await createAppeal.checkMyAnswers();
    await I.clickCloseAndReturnToCaseDetails();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>'+caseId+'<<<<<<<<<<<<<');

    await draftAppeal.submit(false, inTime);

    await removeDetainedStatus.removeStatusAiPNo();
    await I.validateCaseFlagExists('Detained individual', 'Inactive');
    await removeDetainedStatus.validateDataOnAppealTab(detentionLocation);
    await I.logout();

}).retry(3);

// @ts-ignore
Scenario.skip('Admin removes detained status for Legally Represented - Manual',   async ({I, loginPage, removeDetainedStatus}) => {
    await loginPage.signIn(legalAdmin);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await removeDetainedStatus.removeStatusAiPNo();
    await I.validateCaseFlagExists('Detained individual', 'Inactive');
 //   await removeDetainedStatus.validateDataOnAppealTab(detentionLocation);
    await I.logout();
}).retry(3);
