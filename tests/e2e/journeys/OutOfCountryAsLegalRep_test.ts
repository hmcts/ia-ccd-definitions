import {lawFirmUser, envUrl} from '../detainedConfig'

let caseId: string;
const inTime:boolean = true;

Feature('Detained Appeal - Represented @OutOfCountryLegalRepresented');


Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-expect-error stop warning
Scenario('Create Out of Country Appeal as Legal Representative',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal}) => {
    const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required) "revocationOfProtection"

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
    await createAppeal.hasDeportationOrder('Yes');
    await createAppeal.hasNewMatters('No');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);
    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await draftAppeal.submit(true, inTime);

    await I.logout();
});


