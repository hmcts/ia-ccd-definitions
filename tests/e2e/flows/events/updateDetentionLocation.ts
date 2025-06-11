const { I } = inject();

class detentionLocation {

    constructor() {
    }

    // async setStatus(isS94b: string = 'Yes'){
    //     await I.selectNextStep('Update s94b status');
    //     await I.waitForElement(`#s94bStatus_${isS94b}`, 60);
    //     await I.click(`#s94bStatus_${isS94b}`);
    //     await I.clickContinue();
    //     await I.clickSubmit();
    // }
}

// For inheritance
//module.exports = new serviceRequestPage();
export = detentionLocation;