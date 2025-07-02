const { I } = inject();

class GenerateListCMR {

    constructor() {
    }

    async createTask() {
        await I.selectNextStep('Generate List CMR Task');
        await I.clickButtonOrLink('Generate');
    };
}

// For inheritance
//module.exports = new serviceRequestPage();
export = GenerateListCMR;