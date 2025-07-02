const { I } = inject();

class RequestHomeOfficeData {

    constructor() {

    }

    async matchAppellantDetails() {
        await I.waitForElement('#homeOfficeAppellantsList');
        await I.clickContinue();
        await I.clickButtonOrLink('Request Home Office data');
        await I.see('You have matched the appellant details');
        await I.clickCloseAndReturnToCaseDetails();
    };
}

// For inheritance
//module.exports = new serviceRequestPage();
export = RequestHomeOfficeData;