const { I } = inject();

class GenerateListCMR {

    constructor() {
    }

    async createTask() {
        await I.clickButtonOrLink('Generate');
    };
}

// For inheritance
//module.exports = new serviceRequestPage();
export = GenerateListCMR;