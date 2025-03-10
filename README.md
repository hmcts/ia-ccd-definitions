# ia-ccd-definitions

### Purpose
Repo to hold json ccd definition files for IA Team

### Prerequisites
- Node version >=10.16.3
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

`yarn generate-demo`, `yarn generate-ithc`, `yarn generate-perftest`, `yarn generate-aat`, `yarn generate-prod` or `yarn generate-all`

Tasks `yarn generate-prod` and `yarn generate-all` need additional environment variable called `IA_CCD_SECRET_KEY` to decrypt UserProfile tab. Ask someone from IA Team to get correct value.

#### Excel to JSON

Put your Excel file as `definitions/appeal/xlsx/ccd-appeal-config-base.xlsx`

Run command
```
yarn generate-json
```

Your generated JSON files are put to `definitions/appeal/json` folder

#### Callback urls

In dev the callback url will default to http://ia-case-api:8090. If you want to set your own value set an environment 
variable called IA_CASE_URL pointing to the value you want. On some OS's this can be set to 
http://host.docker.internal:8090 rather than setting up ia-case-api to point to the host machine.

#### Create state diagram

To create a state diagram based on the CCD definition run

```
yarn create-state-diagram
```

This will generate an image target/state_diagram.png. If you just want to generate a state diagram for a set of roles
set the environment variable ROLES and a comma separated list of roles.

```
ROLES=role1,role2 yarn create-state-diagram
```

NB. State diagram is produced using plantUml which needs Graphviz see this pages for details and to troubleshoot
https://plantuml.com/graphviz-dot


## Adding Git Conventions

### Include the git conventions.
* Make sure your git version is at least 2.9 using the `git --version` command
* Run the following command:
```
git config --local core.hooksPath .git-config/hooks
```
Once the above is done, you will be required to follow specific conventions for your commit messages and branch names.

If you violate a convention, the git error message will report clearly the convention you should follow and provide
additional information where necessary.

*Optional:*
* Install this plugin in Chrome: https://github.com/refined-github/refined-github

  It will automatically set the title for new PRs according to the first commit message, so you won't have to change it manually.

  Note that it will also alter other behaviours in GitHub. Hopefully these will also be improvements to you.

*In case of problems*

1. Get in touch with your Technical Lead and inform them, so they can adjust the git hooks accordingly
2. Instruct IntelliJ not to use Git Hooks for that commit or use git's `--no-verify` option if you are using the command-line
3. If the rare eventuality that the above is not possible, you can disable enforcement of conventions using the following command

   `git config --local --unset core.hooksPath`

   Still, you shouldn't be doing it so make sure you get in touch with a Technical Lead soon afterwards.
 

# IA CCD Definitions

This repository contains the configuration for Immigration & Asylum CCD definitions.

## CCD Definition Generation

### Using the Unified Script

The project now includes a unified script for generating CCD definitions for different environments and PR configurations.

#### Basic Usage

```bash
# Generate for dev environment (default)
yarn generate-ccd-definition

# Generate for a specific environment
yarn generate-ccd-definition -e aat

# Generate for a preview environment with a specific PR number (required)
yarn generate-ccd-definition -e preview -p 1234

# Generate for a mirrord environment with current username
yarn generate-ccd-definition -e mirrord

# Generate for a mirrord environment with a specific username
yarn generate-ccd-definition -e mirrord -u john.doe

# Generate for a specific service
yarn generate-ccd-definition -e preview -p 1234 -s my-service-api

# Test the configuration without generating files
yarn generate-ccd-definition -e preview -p 1234 -d
```

#### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-e, --env` | Environment (dev, preview, demo, ithc, perftest, aat, prod, mirrord) | `dev` |
| `-p, --pr` | PR number for preview environment (required when `-e preview` is specified) | - |
| `-u, --user` | Username for mirrord environment | Current user (from `whoami`) |
| `-s, --service` | Service name | `ia-case-api` |
| `-d, --dry-run` | Show what would be done without actually generating files | `false` |
| `-h, --help` | Show help message | - |

#### URL Construction

The script dynamically constructs URLs based on the environment and parameters:

- **Preview**: `http://${SERVICE}-pr-${PR_NUMBER}-java` (PR number is required)
- **Mirrord**: `http://${SERVICE}-${USERNAME}-java` (uses current username if not specified)
- **Other environments**: Uses the URL from package.json configuration

#### NPM Scripts

The following npm scripts are available for convenience:

```bash
# Generate for dev environment
yarn generate-dev

# Generate for preview environment with a specific PR number
# Method: Set PR_NUMBER environment variable
PR_NUMBER=1234 yarn generate-preview

# Generate for mirrord environment with current username
yarn generate-mirrord

# Generate for mirrord environment with a specific username
# Method: Set USERNAME environment variable
USERNAME=sabah yarn generate-mirrord-user

# Generate for demo environment
yarn generate-demo

# Generate for ithc environment
yarn generate-ithc

# Generate for perftest environment
yarn generate-perftest

# Generate for aat environment
yarn generate-aat

# Generate for prod environment
yarn generate-prod

# Generate for all environments
yarn generate-all
```

### Configuration

The configuration for different environments is stored in `package.json` under the `config` section. For dynamic environments like `preview` and `mirrord`, only the AAC URL is stored in the configuration, while the service URL is constructed dynamically by the script.

### Legacy Scripts

The legacy scripts are still available but will be deprecated in future releases:

- `bin/generate-dev.sh`
- `bin/generate-preview.sh`
- `bin/generate-demo.sh`
- `bin/generate-ithc.sh`
- `bin/generate-perftest.sh`
- `bin/generate-aat.sh`
- `bin/generate-prod.sh`

## Development

### Prerequisites

- Node.js (>=10.16.3)
- Yarn (>=1.16.x)
- `CCD_DOCKER_PATH` environment variable (only for `upload` task)
- `IA_CCD_SECRET_KEY` environment variable (only for generating CCD Definitions for PROD)

### Setup

```bash
yarn install
yarn setup
```

### Testing

To test the generation of CCD definitions:

```bash
yarn generate-dev
```

This will generate the CCD definition for the dev environment and run validation checks.

### Callback URLs

In dev, the callback URL will default to http://ia-case-api:8090. If you want to set your own value, set an environment variable called IA_CASE_URL pointing to the value you want. On some OS's this can be set to http://host.docker.internal:8090 rather than setting up ia-case-api to point to the host machine.

### Create State Diagram

To create a state diagram based on the CCD definition run:

```bash
yarn create-state-diagram
```

This will generate an image target/state_diagram.png. If you just want to generate a state diagram for a set of roles, set the environment variable ROLES and a comma-separated list of roles:

```bash
ROLES=role1,role2 yarn create-state-diagram
```

NB. State diagram is produced using plantUml which needs Graphviz. See this page for details and to troubleshoot: https://plantuml.com/graphviz-dot

## Git Conventions

### Include the git conventions
* Make sure your git version is at least 2.9 using the `git --version` command
* Run the following command:
```
git config --local core.hooksPath .git-config/hooks
```
Once the above is done, you will be required to follow specific conventions for your commit messages and branch names.

If you violate a convention, the git error message will report clearly the convention you should follow and provide additional information where necessary.

*Optional:*
* Install this plugin in Chrome: https://github.com/refined-github/refined-github

  It will automatically set the title for new PRs according to the first commit message, so you won't have to change it manually.

  Note that it will also alter other behaviours in GitHub. Hopefully these will also be improvements to you.

*In case of problems*

1. Get in touch with your Technical Lead and inform them, so they can adjust the git hooks accordingly
2. Instruct IntelliJ not to use Git Hooks for that commit or use git's `--no-verify` option if you are using the command-line
3. If the rare eventuality that the above is not possible, you can disable enforcement of conventions using the following command

   `git config --local --unset core.hooksPath`

   Still, you shouldn't be doing it so make sure you get in touch with a Technical Lead soon afterwards.
 
