import moment from "moment";
const todayPlus60days = moment().add(60, 'days');

export const envUrl = 'https://xui-ia-case-api-pr-2525.preview.platform.hmcts.net';

export const lawFirmUser = {
    email:"ialegalreporgcreator12@mailnesia.com",
    password: "Aldg@teT0wer"
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
    bailApplicationNumber: 'AB/01234',

}

 export const legalRepresentative = {
    company: 'Legal Rep Company',
    name: 'Steve',
    familyName: 'Legal',
    mobile: '02089998888',
    reference: 'ABCDE12345',
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