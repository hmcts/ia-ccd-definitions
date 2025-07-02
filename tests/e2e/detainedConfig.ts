import moment from "moment";
const todayPlus60days = moment().add(60, 'days');
const yesterday = moment().subtract(1, 'days');
const todayPlus10days = moment().add(10, 'days');
const monthAgo = moment().subtract(1, 'month');

export const runningEnv =  process.env.ENVIRONMENT;

export const envUrl: string = process.env.ENVIRONMENT === 'preview' ? 'https://xui-ia-case-api-pr-2525.preview.platform.hmcts.net' : 'https://manage-case.demo.platform.hmcts.net';

export const createCase = {
    jurisdictionCode: 'IA',
    caseTypeCode: 'Asylum',
    eventCode: 'startAppeal',
}

export const lawFirmUser = {
    email: process.env.ENVIRONMENT === 'preview' ? "ialegalreporgcreator12@mailnesia.com" : "ialegalreporgcreator12@mailinator.com",
    password: process.env.ENVIRONMENT === 'preview' ? "Aldg@teT0wer" : 'AldgateT0wer',
}

export const legalOfficer = {
    email:"ia.caseofficer.ccd@gmail.com",
    password: " AldgateT0wer"
}

export const legalAdmin = {
    email:"ia.adm1nofficer.ccd@gmail.com",
    password: " AldgateT0wer"
}

export const homeOfficeOfficer = {
    email:"ia.respondentoffice.ccd@gmail.com",
    password: " AldgateT0wer"
}


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
            minutesWithLeadingZero: '07', // hard coded as if the scenario fails this minutes will have changed as the config will be reloaded and moment rereun
            secondsWithLeadingZero: '22', // hard coded as if the scenario fails this minutes will have changed as the config will be reloaded and moment rereun
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