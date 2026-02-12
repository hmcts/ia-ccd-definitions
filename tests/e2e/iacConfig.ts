import moment from "moment";
const todayPlus60days = moment().add(60, 'days');
const yesterday = moment().subtract(1, 'days');
const todayPlus10days = moment().add(10, 'days');
const monthAgo = moment().subtract(1, 'month');

export const runningEnv =  process.env.ENVIRONMENT;

export const envUrl: string = process.env.ENVIRONMENT === 'preview' ? 'https://xui-ia-case-api-pr-3023.preview.platform.hmcts.net' : (process.env.ENVIRONMENT === 'demo' ? 'https://manage-case.demo.platform.hmcts.net' : 'https://manage-case.aat.platform.hmcts.net');


export const idamApiBaseUrl: string = process.env.ENVIRONMENT === 'preview' ? 'https://idam-api.aat.platform.hmcts.net' : 'https://idam-api.demo.platform.hmcts.net';
export const authProviderApiBaseUrl: string = process.env.ENVIRONMENT === 'preview' ? 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal' : 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal';
export const ccdDataStoreApiBaseUrl: string = process.env.ENVIRONMENT === 'preview' ? 'https://ccd-data-store-api-ia-case-api-pr-3023.preview.platform.hmcts.net' : (process.env.ENVIRONMENT === 'demo' ? 'http://ccd-data-store-api-demo.service.core-compute-demo.internal' : 'http://ccd-data-store-api-aat.service.core-compute-aat.internal');
export const documentManagementStoreApiBaseUrl: string = process.env.ENVIRONMENT === 'preview' ? 'http://dm-store-aat.service.core-compute-aat.internal' : 'http://dm-store-demo.service.core-compute-demo.internal';
export const microService: string = 'iac';
export const secret: string = process.env.ENVIRONMENT === 'preview' ? 'AAAAAAAAAAAAAAAC' : (process.env.ENVIRONMENT === 'demo' ? 'BXFBY3ZPZ6HCP4MQ' : process.env.S2S_SECRET);



export const createCase = {
    jurisdictionCode: 'IA',
    caseTypeCode: 'Asylum',
    eventCode: 'startAppeal',
}

export const superUserCredentials = {
    username: 'ia.super.ccd@gmail.com',
    password: 'AldgateT0wer'
}

export const legalRepresentativeCredentials = {
    username: ['preview', 'aat'].includes(process.env.ENVIRONMENT) ? 'ialegalreporgcreator12@mailnesia.com' : 'ialegalreporgcreator12@mailinator.com',
    password: ['preview', 'aat'].includes(process.env.ENVIRONMENT) ? 'Aldg@teT0wer' : 'AldgateT0wer',
}

export const legalOfficerCredentials = {
    username: process.env.ENVIRONMENT === 'preview' ? 'CRD_func_test_aat_stcw@justice.gov.uk' : (process.env.ENVIRONMENT === 'demo' ? 'CRD_func_test_demo_stcwuser053@justice.gov.uk' : 'CRD_func_test_aat_stcw@justice.gov.uk'),
    password: 'AldgateT0wer'
}

export const legalOfficerAdminCredentials = {
    username: process.env.ENVIRONMENT === 'preview' ? "CRD_func_test_aat_adm66@justice.gov.uk" : (process.env.ENVIRONMENT === 'demo' ? 'CRD_func_test_demo_admuser045@justice.gov.uk' : 'CRD_func_test_aat_ctscAdm1@justice.gov.uk'),
    password: 'AldgateT0wer',
}

export const listingOfficerCredentials = {
    username: process.env.ENVIRONMENT === 'preview' ? 'CRD_func_test_aat_stcw@justice.gov.uk' : (process.env.ENVIRONMENT === 'demo' ? 'CRD_func_test_demo_stcwuser053@justice.gov.uk' : 'CRD_func_test_aat_stcw22@justice.gov.uk'),
    password: 'AldgateT0wer'
}

export const homeOfficeOfficerCredentials = {
    username: 'ia.respondentoffice.ccd@gmail.com',
    password: 'AldgateT0wer'
}

export const judgeCredentials = {
    username: ['preview', 'aat'].includes(process.env.ENVIRONMENT) ? 'ia.iacjudge.ccd@gmail.com' : 'Gupta.Singh1@ejudiciary.net',
    password: ['preview', 'aat'].includes(process.env.ENVIRONMENT) ? 'AldgateT0wer' : 'Testing123'
}



export const outOfCountryAddress = '123 Example Street, Example City, Example Country, AB12 3CD';


export const appellant = {
    title: 'Mr',
    givenNames: 'David',
    familyName: 'Smith',
    dob: {
        day: 10,
        month: 6,
        year: 1990
    },
    address: {
        addressLine1: 'Buckingham Palace',
        postTown: 'London',
        postcode: 'SW1A 1AA',
        country: 'United Kingdom'
    },
    outsideUKAddress: {
        addressLine1: 'Outside UK address 1',
        addressLine2: 'Outside UK address 2',
        addressLine3: 'Outside UK address 3',
        addressLine4: 'Outside UK address 4',
        country: 'USA'
    },
    mobile: '07890667755',
    email: 'appellantEmail@test.com',
    NOMSNumber: '123456',
    custodialSentence: {
        day: todayPlus60days.date(),
        month: todayPlus60days.month()+1,
        shortMonthDesc: todayPlus60days.format('MMM'),
        longMonthDesc: todayPlus60days.format('MMMM'),
        year: todayPlus60days.year(),
    },
    detained: {
        date: {
            day: yesterday.date(),
            month: yesterday.month() + 1,
            shortMonthDesc: yesterday.format('MMM'),
            longMonthDesc: yesterday.format('MMMM'),
            year: yesterday.year(),
        },
        reason: 'Reason for the appellant being detained',
    },
    removalDirections: {
        date: {
            day: todayPlus10days.date(),
            month: todayPlus10days.month() + 1,
            shortMonthDesc: todayPlus10days.format('MMM'),
            longMonthDesc: todayPlus10days.format('MMMM'),
            year: todayPlus10days.year(),
        },
        time: {
            hour24: todayPlus10days.format('HH'),
            hour12NoLeadingZero: todayPlus10days.format('h'),
            minutesWithLeadingZero: '07', // hard coded as if the scenario fails the minutes will have changed as the config will be reloaded and moment rereun
            secondsWithLeadingZero: '22', // hard coded as if the scenario fails the seconds will have changed as the config will be reloaded and moment rereun
            amPm: todayPlus10days.format('A'),
        },
    },
    detentionRemoval: {
        date: {
        day: monthAgo.date().toString(),
        month: (monthAgo.month() + 1).toString(),
        year: monthAgo.year().toString(),
        },
        reason: 'Testing reason why appellant was removed from detention.',
    },
    bailApplicationNumber: 'AB/01234',
}

 export const legalRepresentative = {
    company: 'Legal Rep Company',
    name: 'Steve',
    familyName: 'Legal',
    mobile: '02089998888',
    email: 'legalRepEmail@test.com',
    reference: 'ABCDE12345',
     address: {
        addressLine1: '16 Deans Yard',
        postTown: 'London',
        postcode: 'SW1P 3PA',
       country: 'United Kingdom'
     },
 }

 export const sponsor = {
    givenNames: 'Fred William',
    familyName: 'Sponsor',
     address: {
        addressLine1: '66 Pall Mall',
        postTown: 'London',
        postcode: 'SW1A 1AB',
        country: 'United Kingdom'
     },
    email: 'sponsorEmail@test.com',
    mobile: '07890675887',
 }