import { Page, expect } from "@playwright/test";
import { TabsHelper } from "./TabsHelper";
import {detentionFacility} from "../fixtures/detentionFacilities";


export class ValidationHelper {
    private tabsHelper: TabsHelper;

    constructor(public page: Page) {
        this.tabsHelper = new TabsHelper(this.page);
    }

    async validateCorrectLabelDisplayed(locator: string, label: string) {
        const src:string = await this.page.locator(locator).getAttribute('src');
        await expect(src).toContain(label);
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
        await expect(flagStatusMatched).toEqual(true);
    }


    async validateDataOnAppellantTab() {

        // const appellantTabDetentionFacilityTypeLocator: string = '//*[@id="case-viewer-field-read--detentionFacility"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-radio-list-field/span';
        // const appellantTabDetentionFacilityIrcNameLocator: string = '//*[@id="case-viewer-field-read--ircName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-list-field/span';
        // const appellantTabDetentionFacilityPrisonNameLocator: string = '//*[@id="case-viewer-field-read--prisonName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-list-field/span';
        // const appellantTabDetentionPrisonNomsNumberLocator: string = '//*[@id="case-viewer-field-read--prisonNOMSNumber"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-complex-field/ccd-read-complex-field-table/div/table/tbody/tr/td/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
        // const appellantTabDetentionBuildingLocator: string = '//*[@id="case-viewer-field-read--detentionBuilding"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
        // const appellantTabDetentionAddressLocator:string = '//*[@id="case-viewer-field-read--detentionAddressLines"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
        // const appellantTabDetentionPostcodeLocator:string = '//*[@id="case-viewer-field-read--detentionPostcode"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
        //const appellantTabOtherFacilityNameLocator: string = '//*[@id="case-viewer-field-read--otherDetentionFacilityName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-complex-field/ccd-read-complex-field-table/div/table/tbody/tr/td/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
        const detentionFacilityList: string[] = ['Immigration removal centre', 'Prison', 'Other'];
        const appellantTabOtherFacilityNameLocator: string = '#case-viewer-field-read--otherDetentionFacilityName';
        const appellantTabDetentionFacilityPrisonNameLocator: string = '#case-viewer-field-read--prisonName';
        const appellantTabDetentionFacilityIrcNameLocator: string = '#case-viewer-field-read--ircName';
        const appellantTabDetentionBuildingLocator: string = '#case-viewer-field-read--detentionBuilding';
        const appellantTabDetentionAddressLocator: string = '#case-viewer-field-read--detentionAddressLines';
        const appellantTabDetentionPostcodeLocator: string = '#case-viewer-field-read--detentionPostcode';


       //await this.page.waitForTimeout(6000); // waits for 2 seconds

        await this.tabsHelper.selectTab('Appellant');
        const facilityType:string = await this.page.locator('#case-viewer-field-read--detentionFacility').innerText();
        await expect(detentionFacilityList).toContain(facilityType);

        const detentionFacilityName: string = (facilityType === 'Other' ? await this.page.locator(appellantTabOtherFacilityNameLocator).innerText() : (facilityType === 'Prison' ? await this.page.locator(appellantTabDetentionFacilityPrisonNameLocator).innerText() : await this.page.locator(appellantTabDetentionFacilityIrcNameLocator).innerText()));
        console.log('detentionFacilityName>>> ', detentionFacilityName);

         const detentionFacilityBuilding: string = await this.page.locator(appellantTabDetentionBuildingLocator).innerText();
         const detentionFacilityAddress: string = await this.page.locator(appellantTabDetentionAddressLocator).innerText();
         const detentionFacilityPostcode: string = await this.page.locator(appellantTabDetentionPostcodeLocator).innerText();
        console.log('detentionFacilityBuilding>>> ', detentionFacilityBuilding);
        console.log('detentionFacilityAddress>>> ', detentionFacilityAddress);
        console.log('detentionFacilityPostcode>>> ', detentionFacilityPostcode);
        //
        // switch (facilityType) {
        //     case 'Immigration removal centre':
        //         await this.expectEqual(detentionFacilityName, detentionFacility.immigrationRemovalCentre.name, 'Immigration removal centre name must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityBuilding, detentionFacility.immigrationRemovalCentre.building, 'Immigration removal centre building must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityAddress, detentionFacility.immigrationRemovalCentre.address, 'Immigration removal centre address must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityPostcode, detentionFacility.immigrationRemovalCentre.postcode, 'Immigration removal centre postcode must exist on the Appellant Tab');
        //         break;
        //     case 'Prison':
        //         await this.expectEqual(detentionFacilityName, detentionFacility.prison.name, 'Prison name must exist on the Appellant Tab');
        //         await this.expectEqual(await this.grabTextFrom(appellantTabDetentionPrisonNomsNumberLocator), appellant.NOMSNumber, 'NOMS number must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityBuilding, detentionFacility.prison.building, 'Prison building must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityAddress, detentionFacility.prison.address, 'Prison address must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityPostcode, detentionFacility.prison.postcode, 'Prison postcode must exist on the Appellant Tab');
        //         break;
        //     case 'Other':
        //         await this.expectEqual(detentionFacilityName, detentionFacility.other.name, 'Other facility name must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityBuilding, detentionFacility.other.building, 'Other facility building must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityAddress, detentionFacility.other.address, 'Other facility address must exist on the Appellant Tab');
        //         await this.expectEqual(detentionFacilityPostcode, detentionFacility.other.postcode, 'Other facility postcode must exist on the Appellant Tab');
        //         break;
        // }
    }
}