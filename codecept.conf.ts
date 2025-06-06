import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/e2e/*_test.ts',
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
  },
  include: {
    I: './steps_file',
    loginPage: './tests/e2e/pages/login_page.ts',
    createCasePage: './tests/e2e/pages/createCase_page.ts',
    createAppeal: './tests/e2e/flows/createAppeal.ts',
    serviceRequestPage: './tests/e2e/pages/serviceRequest_page.ts',
    paymentPage: './tests/e2e/pages/payment_page.ts',
    retrieveCase: './tests/e2e/pages/retrieveCase_page.ts',
    createDirection: './tests/e2e/flows/createDirection.ts',
    homeOffice: './tests/e2e/pages/uploadHomeOfficeBundle_page.ts',
    markAppealAsDetained: './tests/e2e/flows/events/markAppealAsDetained.ts',
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
                reportDir: 'tests/reports',
                inlineAssets: true,
                overwrite: false,
                json: false,
            },
        },
    },
  },
  name: 'ia-ccd-definitions'
}