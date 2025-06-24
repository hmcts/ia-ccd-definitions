import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative, legalAdmin} from '../detainedConfig'

let caseId: string;
const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
//const detentionLocation: string = 'immigrationRemovalCentre';
//const detentionLocation: string = 'prison';
const detentionLocation: string = 'other';
Feature('Detained Appeal - Represented @NonDetainedToDetainedRepresented');


Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Non-Detained Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal, serviceRequestPage, paymentPage}) => {
    const typeOfAppeal: string = 'RPS';

    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('No');
    await createAppeal.setHomeOfficeDetails(true); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);
    await createAppeal.setAppellentContactPreference('EMAIL');
    await createAppeal.setAppellentsAddress('nonDetained','Yes');
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder("No");
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
    await createAppeal.agreeToDeclaration(true);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        // create service request
        await serviceRequestPage.createServiceRequest();

        // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
        await paymentPage.makePayment('CC', caseId);
    }

    await I.logout();
});


// @ts-ignore
Scenario('Legal Officer creates Respondent Direction',   async ({I, loginPage, retrieveCase, markAppealAsDetained, updateDetentionLocation}) => {


    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await I.selectNextStep('Mark appeal as detained');
    await markAppealAsDetained.setAsDetained(detentionLocation);
    await updateDetentionLocation.validateDataUpdated(detentionLocation);
    await I.validateCaseFlagExists('Detained individual', 'Active');
    await I.selectTab('Overview');
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await I.logout();
}).retry(3);
