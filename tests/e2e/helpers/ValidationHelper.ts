import { Page, expect } from "@playwright/test";
import { TabsHelper } from "./TabsHelper";
import {detentionFacility} from "../fixtures/detentionFacilities";
import {appellant} from '../detainedConfig';
import moment from "moment";

export class ValidationHelper {
    private tabsHelper: TabsHelper;

    constructor(public page: Page) {
        this.tabsHelper = new TabsHelper(this.page);
    }

    async validateCorrectLabelDisplayed(locator: string, label: string) {
        const src:string = await this.page.locator(locator).getAttribute('src');
        await expect(src, 'Expected label not found').toContain(label);
    }

    async validateCaseFlagExists(caseFlag: string, activeInactive: string = 'Active') {
        await this.tabsHelper.selectTab('Case flags');
        const totalTables = await this.page.locator('ccd-case-flag-table').count();
        let flagStatusMatched: boolean = false;

        for (let i = 0; i < totalTables; i++) {
            const table = await this.page.locator('ccd-case-flag-table').nth(i);
            const rows = await table.getByRole('row');
            const caseFlagCount = await rows.filter({hasText: 'Detained individual'}).count();
            if (caseFlagCount > 0) {
                for (let j = 0; j < caseFlagCount; j++) {
                    const targetRow = await rows.filter({hasText: 'Detained individual'}).nth(j);
                    const cellCount = await targetRow.getByRole('cell').count();
                    const flagStatus = await targetRow.getByRole('cell').nth(cellCount - 1).innerText();

                    if (activeInactive === 'Active') {
                        if (flagStatus === activeInactive.toUpperCase()) {
                            flagStatusMatched = true;
                            break;
                        } else {
                            flagStatusMatched = false;
                        }
                    }

                    if (activeInactive === 'Inactive') {
                        if (flagStatus !== activeInactive.toUpperCase()) {
                            flagStatusMatched = false;
                            break;
                        } else {
                            flagStatusMatched = true;
                        }
                    }
                }
            }
        }
        await expect(flagStatusMatched, `Expected flag status not found.  Flag: ${caseFlag} with status: ${activeInactive}`).toEqual(true);
    }


    async validateDataOnAppellantTab() {
        const detentionFacilityList: string[] = ['Immigration removal centre', 'Prison', 'Other'];
        const otherFacilityNameLocator: string = '#case-viewer-field-read--otherDetentionFacilityName';
        const detentionFacilityPrisonNameLocator: string = '#case-viewer-field-read--prisonName';
        const detentionFacilityIrcNameLocator: string = '#case-viewer-field-read--ircName';
        const detentionBuildingLocator: string = '#case-viewer-field-read--detentionBuilding';
        const detentionAddressLocator: string = '#case-viewer-field-read--detentionAddressLines';
        const detentionPostcodeLocator: string = '#case-viewer-field-read--detentionPostcode';
        const detentionPrisonNomsNumberLocator: string = '#case-viewer-field-read--prisonNOMSNumber > span > ccd-field-read > div > ccd-field-read-label > div > ccd-read-complex-field > ccd-read-complex-field-table > div > table > tbody > tr > td > span > ccd-field-read > div > ccd-field-read-label > div > ccd-read-text-field > span';


       //await this.page.waitForTimeout(6000); // waits for 2 seconds

        await this.tabsHelper.selectTab('Appellant');

        const facilityType:string = await this.page.locator('#case-viewer-field-read--detentionFacility').innerText();
        await expect(detentionFacilityList, `Invalid detention facility detected: ${facilityType}`).toContain(facilityType);

        const detentionFacilityName: string = (facilityType === 'Other' ? await this.page.locator(otherFacilityNameLocator).innerText() : (facilityType === 'Prison' ? await this.page.locator(detentionFacilityPrisonNameLocator).innerText() : await this.page.locator(detentionFacilityIrcNameLocator).innerText()));

        const detentionFacilityBuilding: string = await this.page.locator(detentionBuildingLocator).innerText();
        const detentionFacilityAddress: string = await this.page.locator(detentionAddressLocator).innerText();
        const detentionFacilityPostcode: string = await this.page.locator(detentionPostcodeLocator).innerText();

        switch (facilityType) {
            case 'Immigration removal centre':
                await expect(detentionFacilityName, `${facilityType} name must exist on the Appellant Tab`).toEqual(detentionFacility.immigrationRemovalCentre.name)
                await expect(detentionFacilityBuilding, `${facilityType} building must exist on the Appellant Tab`).toEqual(detentionFacility.immigrationRemovalCentre.building);
                await expect(detentionFacilityAddress, `${facilityType} address must exist on the Appellant Tab`).toEqual(detentionFacility.immigrationRemovalCentre.address);
                await expect(detentionFacilityPostcode, `${facilityType} postcode must exist on the Appellant Tab`).toEqual(detentionFacility.immigrationRemovalCentre.postcode);
                break;
            case 'Prison':
                await expect(detentionFacilityName, `${facilityType} name must exist on the Appellant Tab`).toEqual(detentionFacility.prison.name);
                await expect(await this.page.locator(detentionPrisonNomsNumberLocator).innerText(), 'NOMS number must exist on the Appellant Tab').toEqual(appellant.NOMSNumber);
                await expect(detentionFacilityBuilding, `${facilityType} building must exist on the Appellant Tab`).toEqual(detentionFacility.prison.building);
                await expect(detentionFacilityAddress, `${facilityType} address must exist on the Appellant Tab`).toEqual(detentionFacility.prison.address);
                await expect(detentionFacilityPostcode, `${facilityType} postcode must exist on the Appellant Tab`).toEqual(detentionFacility.prison.postcode)
                break;
            case 'Other':
                await expect(detentionFacilityName, `${facilityType} facility name must exist on the Appellant Tab`).toEqual(detentionFacility.other.name);
                await expect(detentionFacilityBuilding, `${facilityType} facility building must exist on the Appellant Tab`).toEqual(detentionFacility.other.building);
                await expect(detentionFacilityAddress, `${facilityType} facility address must exist on the Appellant Tab`).toEqual(detentionFacility.other.address);
                await expect(detentionFacilityPostcode, `${facilityType} facility postcode must exist on the Appellant Tab`).toEqual(detentionFacility.other.postcode);
                break;
        }
    }


    async validateDataOnAppealTab(detentionLocation: string = 'prison', checkForDetainedDate:boolean) {
        const inDetentionLocator:string = '#case-viewer-field-read--appellantInDetention';
        const detainedDateLocator: string = '#case-viewer-field-read--appellantDetainedDate';
        const detainedReasonLocator: string = '#case-viewer-field-read--addReasonAppellantWasDetained';
        const removalDirectionsLocator: string = '#case-viewer-field-read--removalOrderOptions';
        const appealTabOnBailLocator: string = '#case-viewer-field-read--hasPendingBailApplications';
        const bailApplicationNumberLocator: string = '#case-viewer-field-read--bailApplicationNumber';
        const custodialSentenceLocator: string = '#case-viewer-field-read--releaseDateProvided';
        const custodialSentenceReleaseDateLocator: string = '#case-viewer-field-read--releaseDate';
        const removalDirectionsDateLocator: string = '#case-viewer-field-read--removalOrderDate';

        const yesNo: string[] = ['Yes', 'No'];
        let onBail: string;
        let bailApplicationNumber:string;
        let removalDirectionsDate: string;
        let hasCustodialSentence: string;
        let custodialReleaseDate: string;
        let detainedDate: string;
        let detainedReason: string;

        await this.tabsHelper.selectTab('Appeal');

        const inDetention = await this.page.locator(inDetentionLocator).innerText();
        await expect(yesNo, `An invalid Detention flag: ${inDetention} found on the Appeal Tab.`).toContain(inDetention);

        if (checkForDetainedDate) {
             detainedDate = await this.page.locator(detainedDateLocator).innerText();
             await expect(detainedDate, 'Incorrect detained date found on Appeals Tab').toEqual(appellant.detained.date.day + ' ' + appellant.detained.date.shortMonthDesc + ' ' + appellant.detained.date.year);

             detainedReason = await this.page.locator(detainedReasonLocator).innerText();
             await expect(detainedReason, `The reason: ${detainedReason} for the detention is incorrect on the Appeal Tab`).toEqual(appellant.detained.reason);
        }

        const hasRemovalDirections = await this.page.locator(removalDirectionsLocator).innerText();
        await expect(yesNo, `An invalid Removal Directions flag: ${hasRemovalDirections} found on the Appeal Tab`).toContain(hasRemovalDirections);

        switch (detentionLocation) {
            case 'immigrationRemovalCentre':
                onBail = await this.page.locator(appealTabOnBailLocator).innerText();
                await expect(yesNo, `An invalid Bail flag: ${onBail} found on the Appeal Tab`).toContain(onBail);

                if (onBail === 'Yes') {
                    bailApplicationNumber = await this.page.locator(bailApplicationNumberLocator).innerText();
                    await expect(bailApplicationNumber, 'A valid Bail Application Number must exist on the Appeal Tab').toEqual(appellant.bailApplicationNumber);
                }
                break;
            default:
                hasCustodialSentence = await this.page.locator(custodialSentenceLocator).innerText();
                await expect(yesNo, `An invalid Custodial Sentence flag: ${hasCustodialSentence} found on the Appeal Tab`).toContain(hasCustodialSentence);

                if (hasCustodialSentence === 'Yes') {
                    custodialReleaseDate = await this.page.locator(custodialSentenceReleaseDateLocator).innerText();
                    await expect(custodialReleaseDate, 'A valid Custodial Release Date must exist on the Appeal Tab').toEqual(appellant.custodialSentence.day + ' ' + appellant.custodialSentence.shortMonthDesc + ' ' + appellant.custodialSentence.year);
                } else {
                    onBail = await this.page.locator(appealTabOnBailLocator).innerText();
                    await expect(yesNo, `An invalid Bail flag: ${onBail} found on the Appeal Tab`).toContain(onBail);

                    if (onBail === 'Yes') {
                        bailApplicationNumber = await this.page.locator(bailApplicationNumberLocator).innerText();
                        await expect(bailApplicationNumber, 'A valid Bail Application Number must exist on the Appeal Tab').toEqual(appellant.bailApplicationNumber);
                    }
                }
                break;
        }

        if (hasRemovalDirections === 'Yes') {
            removalDirectionsDate = await this.page.locator(removalDirectionsDateLocator).innerText();
            await expect(removalDirectionsDate, 'Incorrect removal date found on Appeal Tab')
                .toEqual(appellant.removalDirections.date.day + ' '
                + appellant.removalDirections.date.shortMonthDesc + ' '
                + appellant.removalDirections.date.year +', '
                + appellant.removalDirections.time.hour12NoLeadingZero + ':'
                + appellant.removalDirections.time.minutesWithLeadingZero + ':'
                + appellant.removalDirections.time.secondsWithLeadingZero + ' '
                + appellant.removalDirections.time.amPm);
        }
    }

    async validateComplyDate(daysToAdd: number) {
        const complyDate: string = await this.page.locator('#sendDirectionDateDue-day').inputValue() + '-'
            + await this.page.locator('#sendDirectionDateDue-month').inputValue() + '-'
            + await this.page.locator('#sendDirectionDateDue-year').inputValue();
        const todayPlusDays = moment().add(daysToAdd, 'days').format('DD-MM-YYYY');

        await expect(complyDate, `Request respondent evidence comply date should be ${daysToAdd} days from today: ${todayPlusDays}.`).toEqual(todayPlusDays)
      //  await this.expectDeepEqual(complyDate, todayPlusDays, `Request respondent evidence comply date should be ${daysToAdd} days from today: ${todayPlusDays}.`);
    }

}