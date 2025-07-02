import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer, legalRepresentative, legalAdmin} from '../detainedConfig'

let caseId: string;
const inTime:boolean = false;
const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
//const detentionLocation: string = 'immigrationRemovalCentre';
//const detentionLocation: string = 'prison';
const detentionLocation: string = 'other';
Feature('Detained Appeal - Represented @OutOfCountryLegalRepresented');


Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Out of Country Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal, serviceRequestPage, paymentPage}) => {
    const typeOfAppeal: string = 'RPS';

    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('No');
    await createAppeal.outOfCountryDecision('refusalOfProtection', inTime);
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);
    await createAppeal.setAppellentContactPreference('EMAIL');
    await createAppeal.setOutOfCountryAddress('Yes');
    await createAppeal.hasSponsor('Yes');
    await createAppeal.hasDepotationOrder("Yes");
    await createAppeal.hasNewMatters('No');
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

    await draftAppeal.submit(true, inTime);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        // create service request
        await serviceRequestPage.createServiceRequest();

        // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
        await paymentPage.makePayment('CC', caseId);
    }

    await I.logout();
});



