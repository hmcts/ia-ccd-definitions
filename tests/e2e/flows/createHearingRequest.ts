import { Page } from "@playwright/test";
import { ButtonHelper } from '../helpers/ButtonHelper';


export class CreateHearingRequest {
    private buttonHelper: ButtonHelper;


    constructor(public page: Page) {
        this.buttonHelper = new ButtonHelper(this.page);
    }

    async checkHearingRequirements() {
        await this.buttonHelper.continueButton.click();
    }

    async setAdditionalFacilities(additionalSecurity: string = 'No') {
        // Add facilities here if needed
        await this.page.check(`#additionalSecurity${additionalSecurity}`)
        await this.buttonHelper.continueButton.click();
    }

    async setHearingStage(stage: string = 'SUB') {
        await this.page.check(`#BFA1-${stage}`);
        await this.buttonHelper.continueButton.click();
    }

    async setParticipantAttendance() {
        await this.page.check('#INTER');
        const noOfIndividuals: number = await this.page.locator('.party-row').count();
        for (let i=0; i<noOfIndividuals; i++) {
            await this.page.selectOption(`#partyChannel${i}`, 'In Person');
        }

        await this.buttonHelper.continueButton.click();
    }

    async setVenueLocation(location:string = 'Glasgow') {
        await this.page.locator('#searchVenueLocation').pressSequentially(location);
        await this.page.locator('.mat-option').click();
        await this.page.locator('text=Add location' ).click();
        await this.buttonHelper.continueButton.click();
    }

    async setSpecificJudge(yesNo:string = 'No') {
        if (yesNo === 'No') {
            await this.page.check('#noSpecificJudge');
        }
        await this.buttonHelper.continueButton.click();
    }

    async setPanelRequired(yesNo:string = 'No') {
        if (yesNo === 'No') {
            await this.page.check('#noSpecificPanel');
        }
        await this.buttonHelper.continueButton.click();
    }

    async setLengthDatePriority(length:string[] = ['0', '1', '0'], dateRequired:string = 'No', priority:string = 'Standard') {
        await this.page.fill('#durationdays', length[0]);
        await this.page.fill('#durationhours', length[1]);
        await this.page.fill('#durationmins', length[2]);

        switch (dateRequired) {
            case 'No':
                await this.page.check('#noSpecificDate');
                break;
            case 'Yes':
                await this.page.check('#hearingSingleDate');
                // add date
                break;
            case 'Choose':
                await this.page.check('#hearingDateRange');
                // add date
                break;
        }

        await this.page.check(`#${priority}`);
        await this.buttonHelper.continueButton.click();
    }

    async setLinkedCase(isLinked:string = 'No') {
        await this.page.check(`#${isLinked.toLowerCase()}`);
        await this.buttonHelper.continueButton.click();
    }

    async setAdditionalInstructions() {
        await this.page.fill('#additionalInstructionsTextarea', 'Additional instruction test text.');
        await this.buttonHelper.continueButton.click();
    }

}