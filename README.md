# ia-ccd-definitions

### Purpose
Repo to hold json ccd definition files for IA Team

### Prerequisites
- Node version >=11.x
- yarn version >=1.19.x

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

#### Excel to JSON

Put your Excel file as `definitions/appeal/xlsx/ccd-appeal-config-base.xlsx`

Run command
```
yarn generate-json
```

Your generated JSON files are put to `definitions/appeal/json` folder

#### JSON to Excel

Make your desired changes in `definitions/appeal/json/*.json` files

Run command
```
yarn generate-excel
```

Your generated Excel file is put to `definitions/appeal/xlsx` folder
