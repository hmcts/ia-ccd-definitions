import { test as base } from '@playwright/test';

type myFixtures = {
    testUser;
  }


export const test = base.extend<myFixtures>({
    /*eslint no-empty-pattern: ["error", { "allowObjectPatternsAsParameters": true }]*/
    testUser: async ({}, use) => {
        const user = {
            email: '123@gmail.com',
            password: 'securepassword123'
        };
        await use(user);
    },


});