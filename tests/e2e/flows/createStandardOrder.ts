import ExpectHelper = CodeceptJS.ExpectHelper;

const { I } = inject();
class createStandardOrder {

    constructor() {
        //insert your locators
        // this.button = '#button'
    }
    // insert your methods here

    async isCorrectLabelDisplayed(label: string) {console.log('label>>>', label);
         let src:string = await I.grabAttributeFrom('//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img', 'src');

        // @ts-expect-error
        await I.expectContain(src, label, 'Incorrect or missing Label');

    }
}

// For inheritance
//module.exports = new detentionPage();
export = createStandardOrder;