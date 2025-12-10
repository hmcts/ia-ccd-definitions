import moment from "moment";
const year = moment().year().toString()
const invalidYear = moment().subtract(100, 'years').year().toString();

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export const ariaReferenceNumbers = {
        valid: 'HU/'+ getRandomIntInclusive(0, 2) + getRandomIntInclusive(0, 9999) + '/' + year,
        invalid: {
            start: 'XX/12345/' + year,
            middle: 'HU/31234/' + year,
            end: 'HU/12345/' + invalidYear,
            all: 'XX/91234/' + invalidYear,
        },

};