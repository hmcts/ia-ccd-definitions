# ia-ccd-definitions

### Purpose
Repo to hold json ccd definition files for IA Team

### Prerequisites
- Node version >=11.x
- yarn version >=1.16.x
- `CCD_DOCKER_PATH` environment variable. Only for `upload` task.
- `IA_CCD_SECRET_KEY` environment variable. Only for generating CCD Definitions for PROD.

Helpful link to set up specific Node version:
https://davidwalsh.name/upgrade-nodejs
Use `latest` instead of `stable`

yarn command to upgrade version
```
yarn upgrade --latest
```

Remove Node version from your local in case you have got conflicts

### Settings
There are a few commands to run before using ia-definitions converter:

Clone project to your local
```
git clone git@github.com:hmcts/ia-ccd-definitions.git
```

Change folder
```
cd ia-ccd-definitions
```

Install needed yarn libs
```
yarn install
```

Setup local repo for `ccd-definition-processor`
```
yarn setup
```

### Usages

#### JSON to Excel

Make your desired changes in `definitions/appeal/json/*.json` files

Run command
```
yarn generate-dev
```

Your generated Excel file is put to `target/appeal/xlsx` folder

You can run upload task to generate excel based on JSON files and upload the file directly to dev environment. The task needs to have `CCD_DOCKER_PATH` pre-set.
```
yarn upload
```

If you need CCD Definitions Excel files for environments other than DEV,
there are specific tasks to use:

`yarn generate-demo`, `yarn generate-aat` `yarn generate-prod` or `yarn generate-all`

Tasks `yarn generate-prod` and `yarn generate-all` need additional environment variable called `IA_CCD_SECRET_KEY` to decrypt UserProfile tab. Ask someone from IA Team to get correct value.

#### Excel to JSON

Put your Excel file as `definitions/appeal/xlsx/ccd-appeal-config-base.xlsx`

Run command
```
yarn generate-json
```

Your generated JSON files are put to `definitions/appeal/json` folder
