// in this file you can append custom step methods to 'I' object
// @ts-ignore
import {detentionFacility} from './tests/e2e/fixtures/detentionFacilities'
import {appellant} from './tests/e2e/detainedConfig'
const { tryTo } = require('codeceptjs/effects')

const goButton: string = '//*[@id="content"]/div[1]/div[2]/ccd-event-trigger/form/button';
const signInButton: string = 'input[value="Sign in"]';

export = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    async clickContinue() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Continue'), urlBefore);
    },

    async clickSaveAndContinue() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Save and continue'), urlBefore);
    },

    async clickStart() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Start'), urlBefore);
    },

    async clickSignIn() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick(signInButton), urlBefore);
    },

    async clickSignOut() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Sign out'), urlBefore);
    },


    async clickSubmit() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Submit'), urlBefore);
    },

    async clickCloseAndReturnToCaseDetails() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Close and Return to case details'), urlBefore);
    },

    async clickSendDirection() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick('Send direction'), urlBefore);
    },

    async clickButtonOrLink(buttonOrLinkText: string) {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.forceClick(buttonOrLinkText), urlBefore);
    },

    async clickButtonOrLinkWithoutRetry(buttonOrLinkText: string) {
      await this.forceClick(buttonOrLinkText);
    },

    async grabCaseNumber() {
      await this.waitForElement('.alert-message');

      let message: string = await this.grabTextFrom('.alert-message');
      let caseId: string = (message.split('#')[1].split(' ')[0]).split('-').join('');
      return caseId;
    },

    async selectNextStep(nextStep: string) {
      let urlBefore = await this.grabCurrentUrl();
      await this.selectOption('#next-step', nextStep);
      await this.waitForEnabled(goButton);
      await this.retryUntilUrlChanges(() => this.forceClick(goButton), urlBefore);
    },

    async retryUntilUrlChanges(action, urlBefore, maxNumberOfTries = 6) {
      let urlAfter;
      console.log('urlBefore>>>>',urlBefore);
      for (let tryNumber = 1; tryNumber <= maxNumberOfTries; tryNumber++) {
        console.log(`Checking if URL has changed, starting try #${tryNumber}`);
        await action();
        await this.sleep(3000 * tryNumber);
        urlAfter = await this.grabCurrentUrl();
        //console.log('urlBefore>>>>',urlBefore);
        //console.log('urlAfter>>>>',urlAfter);
        if (urlBefore !== urlAfter) {
          console.log(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url changed after try #${tryNumber} was executed`);
          break;
        } else {
          console.log(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url did not change after try #${tryNumber} was executed`);
        }
        if (tryNumber === maxNumberOfTries) {
          throw new Error(`Maximum number of tries (${maxNumberOfTries}) has been reached trying to change urls. Before: ${urlBefore}. After: ${urlAfter}`);
        }
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async validateCorrectLabelDisplayed(locator: string, label: string) {
      let src: string = await this.grabAttributeFrom(locator, 'src');
      await this.expectContain(src, label, 'Incorrect or missing Label');
    },

    async validateCaseFlagExists(caseFlag: string, activeInactive: string = 'Active') {
      const tabName: string = 'Case flags';
      await this.selectTab(tabName);
      const hasCaseFlagBeenLocated = await tryTo(() => this.grabTextFrom(locate('tr').inside('ccd-case-flag-table').withText(caseFlag).find('td').withText(activeInactive)));
      this.expectTrue(hasCaseFlagBeenLocated, `Could not locate case flag: ${caseFlag} with status of: ${activeInactive}`)
    },

    async selectTab(tabName: string) {
      const tabLabel: string = 'mat-tab-label-';
      const noOfTabs: number = await this.grabNumberOfVisibleElements('.mat-tab-label-content');

      // as the tab group number changes dependent on the journey we need to ascertain this before
      // we can try and select the relevant tab
      // ie when tabs are displayed after appeal submission they are labelled: #mat-tab-label-0
      // after creating a service request they are labelled: #mat-tab-label-2

      let tabId = await this.grabAttributeFrom('.mat-tab-labels > div', 'id');
      let tabGroupNumber = (tabId.split(tabLabel)[1]).split('-')[0];

      for (let i = 0; i < noOfTabs; i++) {
        let tabLocator: string = `#${tabLabel}${tabGroupNumber}-${i} > div`;

        if (await this.grabTextFrom(tabLocator) === tabName) {
          await this.click(tabLocator)
          break;
        }
      }
    },

    async validateDataOnAppellantTab() {
      const appellantTabDetentionFacilityTypeLocator: string = '//*[@id="case-viewer-field-read--detentionFacility"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-radio-list-field/span';
      const appellantTabDetentionFacilityIrcNameLocator: string = '//*[@id="case-viewer-field-read--ircName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-list-field/span';
      const appellantTabDetentionFacilityPrisonNameLocator: string = '//*[@id="case-viewer-field-read--prisonName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-list-field/span';
      const appellantTabDetentionPrisonNomsNumberLocator: string = '//*[@id="case-viewer-field-read--prisonNOMSNumber"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-complex-field/ccd-read-complex-field-table/div/table/tbody/tr/td/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const appellantTabDetentionBuildingLocator: string = '//*[@id="case-viewer-field-read--detentionBuilding"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const appellantTabDetentionAddressLocator:string = '//*[@id="case-viewer-field-read--detentionAddressLines"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const appellantTabDetentionPostcodeLocator:string = '//*[@id="case-viewer-field-read--detentionPostcode"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const appellantTabOtherFacilityNameLocator: string = '//*[@id="case-viewer-field-read--otherDetentionFacilityName"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-complex-field/ccd-read-complex-field-table/div/table/tbody/tr/td/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const detentionFacilityList: string[] = ['Immigration removal centre', 'Prison', 'Other'];

      await this.selectTab('Appellant');
      const facilityType: string = await this.grabTextFrom(appellantTabDetentionFacilityTypeLocator);
      await this.expectContain(detentionFacilityList, facilityType, 'Invalid Detention facility detected');
      const detentionFacilityName: string = (facilityType === 'Other' ? await this.grabTextFrom(appellantTabOtherFacilityNameLocator) : (facilityType === 'Prison' ? await this.grabTextFrom(appellantTabDetentionFacilityPrisonNameLocator) : await this.grabTextFrom(appellantTabDetentionFacilityIrcNameLocator)));
      const detentionFacilityBuilding: string = await this.grabTextFrom(appellantTabDetentionBuildingLocator);
      const detentionFacilityAddress: string = await this.grabTextFrom(appellantTabDetentionAddressLocator);
      const detentionFacilityPostcode: string = await this.grabTextFrom(appellantTabDetentionPostcodeLocator);

      switch (facilityType) {
        case 'Immigration removal centre':
          await this.expectEqual(detentionFacilityName, detentionFacility.immigrationRemovalCentre.name, 'Immigration removal centre name must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityBuilding, detentionFacility.immigrationRemovalCentre.building, 'Immigration removal centre building must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityAddress, detentionFacility.immigrationRemovalCentre.address, 'Immigration removal centre address must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityPostcode, detentionFacility.immigrationRemovalCentre.postcode, 'Immigration removal centre postcode must exist on the Appellant Tab');
          break;
        case 'Prison':
          await this.expectEqual(detentionFacilityName, detentionFacility.prison.name, 'Prison name must exist on the Appellant Tab');
          await this.expectEqual(await this.grabTextFrom(appellantTabDetentionPrisonNomsNumberLocator), appellant.NOMSNumber, 'NOMS number must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityBuilding, detentionFacility.prison.building, 'Prison building must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityAddress, detentionFacility.prison.address, 'Prison address must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityPostcode, detentionFacility.prison.postcode, 'Prison postcode must exist on the Appellant Tab');
          break;
        case 'Other':
          await this.expectEqual(detentionFacilityName, detentionFacility.other.name, 'Other facility name must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityBuilding, detentionFacility.other.building, 'Other facility building must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityAddress, detentionFacility.other.address, 'Other facility address must exist on the Appellant Tab');
          await this.expectEqual(detentionFacilityPostcode, detentionFacility.other.postcode, 'Other facility postcode must exist on the Appellant Tab');
          break;
      }
    },

    async validateDataOnAppealTab(detentionLocation: string = 'prison') {
      const appealTabInDetentionLocator: string = '//*[@id="case-viewer-field-read--appellantInDetention"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-yes-no-field/span';
      const appealTabCustodialSentenceLocator: string = '//*[@id="case-viewer-field-read--releaseDateProvided"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-yes-no-field/span';
      const appealTabCustodialSentenceReleaseDateLocator: string = '//*[@id="case-viewer-field-read--releaseDate"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-date-field/span';
      const appealTabOnBailLocator: string = '//*[@id="case-viewer-field-read--hasPendingBailApplications"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-fixed-radio-list-field/span';
      const appealTabBailApplicationNumberLocator: string = '//*[@id="case-viewer-field-read--bailApplicationNumber"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-text-field/span';
      const appealTabRemovalDirections: string = '//*[@id="case-viewer-field-read--removalOrderOptions"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-yes-no-field/span';
      const appealTabRemovalDirectionsDate: string = '//*[@id="case-viewer-field-read--removalOrderDate"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-date-field/span';
      const appealTabDetainedDate: string = '//*[@id="case-viewer-field-read--appellantDetainedDate"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-date-field/span';
      const appealTabDetainedReason: string = '//*[@id="case-viewer-field-read--addReasonAppellantWasDetained"]/span/ccd-field-read/div/ccd-field-read-label/div';
      const yesNo: string[] = ['Yes', 'No'];
      let onBail: string;
      const bailApplicationNumber: string = appellant.bailApplicationNumber;
      let tabBailApplicationNumber:string;
      let inDetention: string;
      let hasRemovalDirections: string;
      let tabRemovalDirectionsDate: string;
      let hasCustodialSentence: string;
      let tabCustodialReleaseDate: string;
      let detainedDate: string;
      let detainedReason: string;
      const custodialReleaseDate: string = appellant.custodialSentence.day + ' ' + appellant.custodialSentence.shortMonthDesc + ' ' + appellant.custodialSentence.year;

      await this.selectTab('Appeal');

      inDetention = await this.grabTextFrom(appealTabInDetentionLocator);
      await this.expectContain(yesNo, inDetention, 'A valid Detention flag must exist on the Appeal Tab');

      detainedDate = await this.grabTextFrom(appealTabDetainedDate);
      await this.expectEqual(detainedDate, appellant.detained.date.day + ' ' + appellant.detained.date.shortMonthDesc + ' ' + appellant.detained.date.year);

      detainedReason = await this.grabTextFrom(appealTabDetainedReason);
      await this.expectEqual(detainedReason, appellant.detained.reason, 'The reason for the detention is incorrect on the Appeals Tab');

      hasRemovalDirections = await this.grabTextFrom(appealTabRemovalDirections);
      await this.expectContain(yesNo, hasRemovalDirections, 'A valid Removal Directions flag must exist on the Appeal Tab');

      switch (detentionLocation) {
        case 'immigrationRemovalCentre':
          onBail = await this.grabTextFrom(appealTabOnBailLocator);
          await this.expectContain(yesNo, onBail, 'A valid on bail flag must exist on the Appeal Tab');
          if (onBail === 'Yes') {
            tabBailApplicationNumber = await this.grabTextFrom(appealTabBailApplicationNumberLocator);
            await this.expectEqual(tabBailApplicationNumber, bailApplicationNumber, 'A valid Bail Application Number must exist on the Appeal Tab');
          }
          break;
        default:
          hasCustodialSentence = await this.grabTextFrom(appealTabCustodialSentenceLocator);
          await this.expectContain(yesNo, hasCustodialSentence, 'A valid Custodial Sentence flag must exist on the Appeal Tab');

          if (hasCustodialSentence === 'Yes') {
            tabCustodialReleaseDate = await this.grabTextFrom(appealTabCustodialSentenceReleaseDateLocator);
            await this.expectEqual(tabCustodialReleaseDate, custodialReleaseDate, 'A valid Custodial Release Date must exist on the Appeal Tab');
          } else {
            onBail = await this.grabTextFrom(appealTabOnBailLocator);
            await this.expectContain(yesNo, onBail, 'A valid on bail flag must exist on the Appeal Tab');
            if (onBail === 'Yes') {
              tabBailApplicationNumber = await this.grabTextFrom(appealTabBailApplicationNumberLocator);
              await this.expectEqual(tabBailApplicationNumber, bailApplicationNumber, 'A valid Bail Application Number must exist on the Appeal Tab');
            }
          }
          break;
      }

      if (hasRemovalDirections === 'Yes') {
        tabRemovalDirectionsDate = await this.grabTextFrom(appealTabRemovalDirectionsDate);
        await this.expectEqual(tabRemovalDirectionsDate, appellant.removalDirections.date.day + ' '
            + appellant.removalDirections.date.shortMonthDesc + ' '
            + appellant.removalDirections.date.year +', '
            + appellant.removalDirections.time.hour12NoLeadingZero + ':'
            + appellant.removalDirections.time.minutesWithLeadingZero + ':'
            + appellant.removalDirections.time.secondsWithLeadingZero + ' '
            + appellant.removalDirections.time.amPm
        );
      }
    },

    async logout() {
      await this.clickSignOut();
      await this.waitForElement('#username');
    }

  });
}
