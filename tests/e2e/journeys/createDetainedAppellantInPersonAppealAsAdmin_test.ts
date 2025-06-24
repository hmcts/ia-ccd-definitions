import {envUrl, legalAdmin} from '../detainedConfig'

let caseId: string;
let inTime: boolean = true;
const detentionLocation: string = 'immigrationRemovalCentre';

Feature('Detained Appeal - Legal Admin @LegalAdminDetainedAppellantInPerson');


Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-ignore
Scenario('Create Detained Appeal - Appellant In Person as Legal Admin - ' + (inTime ? 'In Time' : 'Out of Time'),   async ({I, loginPage, createCasePage, createAppeal}) => {
    //const typeOfAppeal: string = 'EEA'; // Refusal under EEA regulations (payment required)
    //const typeOfAppeal: string = 'RHR'; // Refusal human rights (payment required)
    const typeOfAppeal: string  = 'DC'; // Deprivation of citizenship (no payment required)
    //const typeOfAppeal: string  = 'EU'; // Refusal of application under the EU Settlement Scheme (payment required)
    //const typeOfAppeal: string = 'RPS'; // Revocation of a protection status (no payment required)

    await loginPage.signIn(legalAdmin);
    await createCasePage.createCase();

    // Before you start page
    await I.clickContinue();
    await createAppeal.setTribunalAppealReceived();
    await createAppeal.appellantInPerson('Yes');
    await createAppeal.locationInUK('Yes');
    await createAppeal.inDetention('Yes');
    await createAppeal.setDetentionLocation(detentionLocation);
    await createAppeal.setBailApplication('No');
    await createAppeal.setHomeOfficeDetails(true); //false if out of time
    await createAppeal.uploadNoticeOfDecision();
    await createAppeal.setTypeOfAppeal(typeOfAppeal);
    await createAppeal.setAppellantBasicDetails(true);
    await createAppeal.setNationality(true);
    await createAppeal.appellantDetails();
    await createAppeal.hasSponsor('No');
    await createAppeal.hasDepotationOrder('No');
    await createAppeal.hasRemovalDirections('No');
    // await createAppeal.hasNewMatters('Yes');
    await createAppeal.hasOtherAppeals('No');
    // await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);

    if (typeOfAppeal !== 'RPS' && typeOfAppeal !== 'DC') {
        await createAppeal.hasFeeRemission('No');
    }

    await createAppeal.uploadAppealDocs();
    await createAppeal.checkMyAnswers();
    await I.clickCloseAndReturnToCaseDetails();
    //

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>'+caseId+'<<<<<<<<<<<<<');
    //

    await I.selectNextStep('Submit your appeal');
    if (!inTime) {
       await createAppeal.setAppealOutOfTime();
    }

    await createAppeal.agreeToDeclaration(false, inTime);

}).retry(3);

