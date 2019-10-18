# ia-ccd-definitions

### Purpose
Repo to hold json ccd definition files for IA Team

### Prerequisites
- Node version >=11.x
- yarn version >=1.19.x

Helpful link to set up specific Node version:
https://davidwalsh.name/upgrade-nodejs
Use latest instead of stable

Remove Node version from your local in case you have got conflicts

### Settings
There are a few command to run setup ia-definitions converter:

Clone project to your local
```
git clone git@github.com:hmcts/ia-ccd-definitions.git
```

change folder
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

##### Excel to JSON

put your Excel file as `definitions/appeal/xlsx/ccd-appeal-config-base.xlsx`

run command
```
yarn generate-json
```

your generated JSON files are put to `definitions/appeal/json` folder

##### JSON to Excel

make your desired changes in `definitions/appeal/json/*.json` files

run command
```
yarn generate-excel
```

your generated Excel file is put to `definitions/appeal/xlsx` folder