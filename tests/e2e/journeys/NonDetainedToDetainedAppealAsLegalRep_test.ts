import {lawFirmUser, envUrl, legalOfficer} from '../detainedConfig'

let caseId: string;
const inTime: boolean = true;
const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
const detentionLocation: string = 'immigrationRemovalCentre';

Feature('Detained Appeal - Represented @NonDetainedToDetainedRepresented');

Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-expect-error stop warning
Scenario('Create Non-Detained Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal}) => {
    const typeOfAppeal: string = 'deprivation'; // Deprivation of citizenship (no payment required)

    await loginPage.signIn(lawFirmUser);
    await createCasePage.createCase();
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('No');
    await createAppeal.setHomeOfficeDetails(inTime); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(false);
    await createAppeal.setNationality(true);
    await createAppeal.setAppellentsAddress('nonDetained','Yes');
    await createAppeal.setAppellentContactPreference('EMAIL');
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDeportationOrder("No");
    await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);
    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await draftAppeal.submit(true, inTime);
    await I.logout();
}).retry(3);


// @ts-expect-error stop warning
Scenario('Legal Officer creates Respondent Direction',   async ({I, loginPage, retrieveCase, markAppealAsDetained, updateDetentionLocation}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await markAppealAsDetained.setAsDetained(detentionLocation);
    await updateDetentionLocation.validateDataUpdated(detentionLocation, true);
    await I.validateCaseFlagExists('Detained individual', 'Active');
    await I.selectTab('Overview');
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await I.logout();
}).retry(3);
