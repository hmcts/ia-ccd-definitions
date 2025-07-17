import {lawFirmUser, envUrl, legalOfficer, homeOfficeOfficer} from '../detainedConfig'

let caseId: string = '1752655171618589';
const inTime: boolean = true;
const cmrListing: boolean = true;

const detainedRepresentedImageLocator: string = '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img';
const detainedRepresentedS94bImageLocator: string = '//*[@id="journey_type_legal_rep_detained_s9"]/dt/ccd-markdown/div/markdown/p/img';
const detentionLocation: string = 'immigrationRemovalCentre';
//const detentionLocation: string = 'prison';
//const detentionLocation: string = 'other';

    //const typeOfAppeal: string = 'refusalOfEu'; // Refusal under EEA regulations (payment required)
    //const typeOfAppeal: string = 'refusalOfHumanRights'; // Refusal human rights (payment required)
    //const typeOfAppeal: string  = 'deprivation'; // Deprivation of citizenship (no payment required)
    //const typeOfAppeal: string  = 'euSettlementScheme'; // Refusal of application under the EU Settlement Scheme (payment required)
    //const typeOfAppeal: string = 'revocationOfProtection'; // Revocation of a protection status (no payment required)
    const typeOfAppeal:string = 'protection'; // Refusal of protection claim (payment required)


    Feature('Detained Appeal - Represented @LegalRepDetainedRepresented');

Before(async({ I }) => {
    await I.amOnPage(envUrl);
})

// @ts-expect-error stop warning
Scenario('Create Detained Appeal as Legal Representative ' + (inTime ? 'In Time' : 'Out of Time') + ' and ' + (cmrListing ? 'with' : 'without') + ' CMR listing',   async ({I, loginPage, createCasePage, createAppeal, draftAppeal, serviceRequestPage, paymentPage}) => {
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
    await createAppeal.hasDeportationOrder('No');
    await createAppeal.hasRemovalDirections('No');
    await createAppeal.hasNewMatters('No');
    await createAppeal.hasOtherAppeals('No');
    await createAppeal.setLegalRepresentativeDetails();
    await createAppeal.isHearingRequired(true);

    if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
        await createAppeal.hasFeeRemission('No');
    }

    if (typeOfAppeal === 'protection') {
        await createAppeal.setPayNowLater('Now');
    }

    await createAppeal.checkMyAnswers();

    caseId = await I.grabCaseNumber();
    console.log('caseId>>>>>>>>>>>>>>>' + caseId + '<<<<<<<<<<<<<<<<<<<');

    await draftAppeal.submit(true, inTime);

    if (typeOfAppeal !== 'revocationOfProtection' && typeOfAppeal !== 'deprivation') {
        // create service request
       await serviceRequestPage.createServiceRequest();

        // make payment - will remove caseId from parameters and function when successful payment hyperlink points to correct env
       await paymentPage.makePayment('CC', caseId);
    }

    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Legal Officer adds s94b appeal status, updates detention location and creates Respondent Direction',   async ({I, loginPage, retrieveCase, respondentEvidenceDirection, s94b, updateDetentionLocation, requestHomeOfficeData, generateListCMR}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);

    await s94b.setStatus('Yes');
    await I.validateCorrectLabelDisplayed(detainedRepresentedImageLocator, 'legally_represented_detained_appeal');
    await I.validateCorrectLabelDisplayed(detainedRepresentedS94bImageLocator, 'legalRep_detained_s9');
    await I.validateCaseFlagExists('Detained individual', 'Active');
    await updateDetentionLocation.changeLocation(detentionLocation === 'prison' ? 'other' : (detentionLocation === 'other' ? 'immigrationRemovalCentre' : 'prison'), detentionLocation === 'prison' ? false:  (detentionLocation === 'other' ? true : false));
    await updateDetentionLocation.validateDataUpdated(detentionLocation);

    if (typeOfAppeal === 'revocationOfProtection' || typeOfAppeal === 'protection') {
        await requestHomeOfficeData.matchAppellantDetails();
    }

    await generateListCMR.createTask();
    await respondentEvidenceDirection.submit();
    await I.logout();
}).retry(3)



// @ts-expect-error stop warning
Scenario('Home Office Officer (respondent) review appeal and upload Home Office bundle',   async ({I, loginPage, homeOfficeBundle}) => {
    await loginPage.signIn(homeOfficeOfficer);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await homeOfficeBundle.upload();
    await I.logout();
}).retry(3);


// @ts-expect-error stop warning
Scenario('Legal Officer directs appellant/Legal Rep to build case',   async ({I, loginPage, retrieveCase, caseBuildingDirection}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details', 60);
    await caseBuildingDirection.submit();
    await I.logout();
}).retry(3);


// @ts-expect-error stop warning
Scenario('Appellant/Legal Rep build case',   async ({I, loginPage, buildYourCase}) => {
    await loginPage.signIn(lawFirmUser);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await buildYourCase.build();
    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Legal Officer creates Respondent Review Direction',   async ({I, loginPage, retrieveCase, respondentReviewDirection}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await respondentReviewDirection.submit();
    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Home Office Officer (respondent) responds to appeal response from Appellant/Legal Rep',   async ({I, loginPage, appealResponse}) => {
    await loginPage.signIn(homeOfficeOfficer);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details',60);
    await appealResponse.upload();
    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Legal Officer directs appellant/legal rep to Review Home Office response',   async ({I, loginPage, retrieveCase, reviewHomeOfficeResponse}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details',60);
    await reviewHomeOfficeResponse.submit();
    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Appellant/legal rep request and submit hearing requirements',   async ({I, loginPage, requestHearingRequirements, submitHearingRequirements}) => {
    await loginPage.signIn(lawFirmUser);
    await I.amOnPage(envUrl + '/cases/case-details/' + caseId);
    await I.waitForText('Case details', 60);
    await requestHearingRequirements.submit();
    await submitHearingRequirements.submit();
    await I.logout();
}).retry(3);

// @ts-expect-error stop warning
Scenario('Legal Officer to review hearing requirements',   async ({I, loginPage, retrieveCase, reviewHearingRequirements}) => {
    await loginPage.signIn(legalOfficer);
    await retrieveCase.getCase(caseId);
    await I.waitForText('Case details', 60);
    await reviewHearingRequirements.submit();
    await I.logout();
}).retry(3);