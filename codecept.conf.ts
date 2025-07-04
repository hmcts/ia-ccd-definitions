import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
import fs from 'fs';


// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/e2e/**/*_test.ts',
  output: './output',
  helpers: {
      Playwright: {
      browser: 'chromium',
      restart: true,
      url: 'https://www.google.co.uk',
      show: true,
      ignoreHTTPSErrors: true,
      bypassCSP: true,
      //waitForAction: 500,
    },
      MyHelper:{
          require: './tests/e2e/helpers/my_helper.ts'
      },
      Expect: {
          require: '@codeceptjs/expect-helper'
      },
      A11yHelper: {
          require: 'codeceptjs-a11y-helper',
          outputDir: 'tests/reports/accessibility',
      },
  },
  include: {
    I: './steps_file',
    loginPage: './tests/e2e/pages/login_page.ts',
    createCasePage: './tests/e2e/pages/createCase_page.ts',
    createAppeal: './tests/e2e/flows/createAppeal.ts',
    serviceRequestPage: './tests/e2e/pages/serviceRequest_page.ts',
    paymentPage: './tests/e2e/pages/payment_page.ts',
    retrieveCase: './tests/e2e/pages/retrieveCase_page.ts',
    draftAppeal: './tests/e2e/flows/events/submitYourAppeal.ts',
    markAppealAsDetained: './tests/e2e/flows/events/markAppealAsDetained.ts',
    s94b: './tests/e2e/flows/events/setS94bStatus.ts',
    updateDetentionLocation: './tests/e2e/flows/events/updateDetentionLocation.ts',
    removeDetainedStatus: './tests/e2e/flows/events/removeDetainedStatus.ts',
    requestHomeOfficeData: './tests/e2e/flows/events/requestHomeOfficeData.ts',
    generateListCMR: './tests/e2e/flows/events/generateListCMRTask.ts',
    respondentEvidenceDirection: './tests/e2e/flows/events/respondentEvidenceDirection.ts',
    homeOfficeBundle: './tests/e2e/flows/events/homeOfficeBundle.ts',
    caseBuildingDirection: './tests/e2e/flows/events/caseBuildingDirection.ts',
    buildYourCase: './tests/e2e/flows/events/buildYourCase.ts',
    respondentReviewDirection: './tests/e2e/flows/events/respondentReviewDirection.ts',
    appealResponse: './tests/e2e/flows/events/uploadAppealResponse.ts',
    reviewHomeOfficeResponse: './tests/e2e/flows/events/reviewHomeOfficeResponse.ts',
    requestHearingRequirements: './tests/e2e/flows/events/requestHearingRequirements.ts',
    submitHearingRequirements: './tests/e2e/flows/events/submitHearingRequirements.ts',
    reviewHearingRequirements: './tests/e2e/flows/events/reviewHearingRequirements.ts',
  },
  mocha:     {
    reporterOptions: {
        'codeceptjs-cli-reporter': {
            stdout:  '-',
            options: {
                verbose: true,
                steps:   true,
            },
        },
        'mochawesome': {
            stdout: '-',
            options: {
                reportDir: 'tests/reports/functional',
                inlineAssets: true,
                overwrite: false,
                json: false,
            },
        },
    },
  },
  async bootstrap() {
      const directoryPath = './tests/reports/accessibility/';

      const fileList = fs.readdirSync(directoryPath);

      fileList.forEach(function (filename) {
        try {
            fs.unlinkSync(directoryPath+filename);
        }
        catch (e) {
            console.log('Couldn\'t delete file: ' + filename);
        }
      });
  },
    name: 'ia-ccd-definitions'
}