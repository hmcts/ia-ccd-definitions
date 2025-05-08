import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/e2e/createDetainedAppeal_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost',
      show: true,
      ignoreHTTPSErrors: true,
    }
  },
  include: {
    I: './steps_file',
    loginPage: './tests/e2e/pages/login.ts',
    createCasePage: './tests/e2e/pages/createCase.ts',
    createAppeal: './tests/e2e/flows/createAppeal.ts',
    retrieveCase: './tests/e2e/pages/retrieveCase.ts',
  },
  name: 'ia-ccd-definitions'
}