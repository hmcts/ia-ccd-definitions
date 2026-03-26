import { APIRequestContext, expect } from '@playwright/test';

export async function callHomeOfficeStatutoryTimeframeApi(
  request: APIRequestContext,
  caseId: string
): Promise<void> {

  const baseUrl =
    process.env.HOME_OFFICE_API_URL ??
    'https://ia-case-api-pr-3075-home-office-integration-api.preview.platform.hmcts.net';

  const s2sToken = process.env.S2S_TOKEN;         
  const accessToken = process.env.ACCESS_TOKEN;

  if (!baseUrl || !s2sToken || !accessToken) {
    throw new Error(
      'HOME_OFFICE_API_URL, S2S_TOKEN or ACCESS_TOKEN is not set in environment variables'
    );
  }

  // Remove accidental % if present
  const cleanS2SToken = s2sToken.replace(/%$/, '');
  const cleanAccessToken = accessToken.replace(/%$/, '');

  const response = await request.post(
    `${baseUrl}/home-office-statutory-timeframe-status`,
    {
      headers: {
        'Content-Type': 'application/json',
        'ServiceAuthorization': `Bearer ${cleanS2SToken}`,
        'Authorization': `Bearer ${cleanAccessToken}`,
      },
      data: {
        ccdCaseId: Number(caseId),
        uan: '12345',
        familyName: 'Admin',
        givenNames: 'Ram',
        dateOfBirth: '1990-06-10',
        stf24weeks: {
          status: 'Yes',
          cohorts: [],
        },
        timeStamp: new Date().toISOString(),
      },
    }
  );

  console.log('Home Office STF API Status:', response.status());
  console.log('Home Office STF API Body:', await response.text());

  expect(response.status()).toBe(200);
}
