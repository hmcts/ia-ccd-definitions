import moment from "moment";
const year = moment().year().toString()
const invalidYear = moment().subtract(100, 'years').year().toString();
const validAriaCodes: string[] = ['HU','DA','DC','EA','PA','RP','LE','LD','LP','LH','LR','IA'];

function getRandomAriaCode() {
    const element: number = Math.floor(Math.random() * validAriaCodes.length);
    return validAriaCodes[element];
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}



export let ariaReferenceNumber = {
        valid: getRandomAriaCode() +'/'+ getRandomIntInclusive(0, 2).toString() + getRandomIntInclusive(0, 9999).toString().padStart(4,"0") + '/' + year,
         duplicate: 'LP/12212/2025',
        invalid: {
            start: 'XX/12345/' + year,
            middle: 'HU/31234/' + year,
            end: 'HU/12345/' + invalidYear,
            all: 'XX/91234/' + invalidYear,
        },

};