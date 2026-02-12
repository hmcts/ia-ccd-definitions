# IA CCD Definitions

### Purpose
Repo to hold JSON CCD definition files for the IA team.

### Prerequisites
- Node version >=10.16.3
- yarn version >=1.16.x
- `CCD_DOCKER_PATH` environment variable. Only for `upload` task.
- `IA_CCD_SECRET_KEY` environment variable. Only for generating CCD Definitions for PROD.

Helpful link to set up specific Node version:

https://davidwalsh.name/upgrade-nodejs

(Use `latest` instead of `stable`.)

Yarn command to upgrade version:
```
yarn upgrade --latest
```

Remove Node version from your local in case you have conflicts.

### Settings
There are a few commands to run before using the `ia-ccd-definitions` converter:

Clone the project to your local:
```
git clone --recursive https://github.com/hmcts/ia-ccd-definitions.git
```
(HTTPS) or
```
git clone --recursive git@github.com:hmcts/ia-ccd-definitions.git
```
(SSH).  The `--recursive` ensures that the contents of the inner `ccd-definition-processor` repo are also fetched; otherwise, this directory will remain empty and the following commands won't work.

Change directory:
```
cd ia-ccd-definitions
```

Install the necessary Yarn libraries:
```
yarn install
```

Set the local repo up for `ccd-definition-processor`:
```
yarn setup
```

### Usage

#### JSON to Excel

Make your desired changes in the `definitions/appeal/json/*.json` files.  Then run:
```
yarn generate-dev
```
The resulting Excel file is written to the `target/appeal/xlsx` folder.

You can run the `upload` task to generate an Excel file based on JSON and upload it directly to the Dev environment. This requires the environment variable `CCD_DOCKER_PATH` to be set.
```
yarn upload
```

If you need CCD Definitions Excel files for environments other than Dev, there are specific tasks to use:

`yarn generate-demo`, `yarn generate-ithc`, `yarn generate-perftest`, `yarn generate-aat`, `yarn generate-prod` or `yarn generate-all`

Tasks `yarn generate-prod` and `yarn generate-all` need an additional environment variable called `IA_CCD_SECRET_KEY` to decrypt the UserProfile tab. Ask someone from IA Team to give you the correct value.

#### Excel to JSON

Call your Excel file `definitions/appeal/xlsx/ccd-appeal-config-base.xlsx` and run the command:
```
yarn generate-json
```

Your resulting JSON files will appear in the `definitions/appeal/json` folder.

#### Callback URLs

In Dev the callback URL will default to http://ia-case-api:8090. If you want to set your own value, set an environment 
variable called `IA_CASE_URL` pointing to the value you want. On some operating systems this can be set to 
http://host.docker.internal:8090 rather than setting up `ia-case-api` to point to the host machine.

#### Create state diagram

To create a state diagram based on the CCD definition, run:

```
yarn create-state-diagram
```

This will generate an image written to `target/state_diagram.png`. If you just want to generate a state diagram for a set of roles,
set the environment variable `ROLES` and a comma separated list of roles.

```
ROLES=role1,role2
yarn create-state-diagram
```

**Note**: The state diagram is produced using [PlantUML](https://plantuml.com/) which needs [Graphviz](https://graphviz.org/); see these pages for details and to troubleshoot:

https://plantuml.com/graphviz-dot


## Adding Git Conventions

### Include the git conventions.
* Make sure your Git version is at least 2.9 using the `git --version` command
* Run the following command:
```
git config --local core.hooksPath .git-config/hooks
```
Once the above is done, you will be required to follow specific conventions for your commit messages and branch names.

If you violate a convention, the Git error message will report clearly the convention you should follow and provide
additional information where necessary.

*Optional:*
* Install this plugin in Chrome: https://github.com/refined-github/refined-github

  It will automatically set the title for new PRs according to the first commit message, so you won't have to change it manually.

  Note that it will also alter other behaviour in GitHub. Hopefully these will also be useful to you.

*In case of problems*

1. Get in touch with your Technical Lead and inform them, so they can adjust the git hooks accordingly
2. Instruct IntelliJ not to use Git Hooks for that commit or use git's `--no-verify` option if you are using the command-line
3. In the rare event that the above is not possible, you can disable enforcement of conventions using the following command

   `git config --local --unset core.hooksPath`

   Still, you shouldn't have to do this, so make sure you get in touch with a Technical Lead soon afterwards.

## CCD Definition Generation

### Using the Unified Script

The project now includes a unified script for generating CCD definitions for different environments and PR configurations.

#### Basic Usage

```bash
# Generate for dev environment (default)
yarn generate

# Generate for a specific environment
yarn generate -e aat

# Generate for a preview environment with a specific PR number (required)
yarn generate -e preview -p 1234

# Generate for a mirrord environment with current username
yarn generate -e mirrord

# Generate for a mirrord environment with a specific username
yarn generate -e mirrord -u sabah

# Generate for a specific service
yarn generate -e preview -p 1234 -s my-service-api

# Test the configuration without generating files
yarn generate -e preview -p 1234 -d
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

These legacy scripts are still available but will be deprecated in future releases:

- `bin/generate-dev.sh`
- `bin/generate-preview.sh`
- `bin/generate-demo.sh`
- `bin/generate-ithc.sh`
- `bin/generate-perftest.sh`
- `bin/generate-aat.sh`
- `bin/generate-prod.sh`

# Environment-based CCD Definition Filtering

## Purpose

This repository uses an environment-based filtering mechanism to include/exclude CCD JSON definition files at generation time.

The goal is to control which features are available in each environment (e.g. preview/demo vs aat/prod), using filename conventions and optional overrides.

---

## How the mechanism works

1. A generation script determines the current environment (for example from `CCD_ENV`).
2. It maps environment → exclusion patterns (for example `*-prod.json` or `*-nonprod.json`).
3. The exclusion patterns are passed to the definition processor as `-e` parameters.
4. The processor generates the final `.xlsx` from JSON, skipping files that match exclusions.

In short:

- `generate-*` script chooses exclusions
- `process-definition.sh` forwards exclusions
- `json2xlsx` applies them during generation

---

## Naming convention

To use this mechanism consistently, JSON files should follow these conventions:

- `*-nonprod.json` → only for non-prod-like environments
- `*-prod.json` → only for prod-like environments
- environment-specific files can also be handled by folder layout (e.g. `env/<environment>/...`) depending on repository setup

> Important: repo already selects env-specific files by folder copy (e.g. env-specific `UserProfile.json`), we may not need to exclude `UserProfile.json` globally.

---

## Default environment rules

Example default mapping:

- `prod`, `aat`, `staging`  
  Exclude: `*-nonprod.json`

- `preview`, `demo`, `perftest`, `ithc`, `dev`, `local`  
  Exclude: `*-prod.json`

If your repository requires additional exclusions (e.g. shuttered/unshuttered or feature-specific files), append those patterns in the same mapping logic.

---

## Override mechanism (for testing)

To test custom combinations without changing script code, use an override env variable:

```bash
CCD_EXCLUDED_FILENAME_PATTERNS='*-prod.json,SomeFeature.json' CCD_ENV=prod bash -x bin/generate-excel.sh
```
## Usage

Generate for preview: 
```bash 
CCD_ENV=preview bash -x bin/generate-excel.sh
```
Generate for prod:
```bash 
CCD_ENV=prod bash -x bin/generate-excel.sh
```
Generate with explicit override:
```bash 
CCD_ENV=prod CCD_EXCLUDED_FILENAME_PATTERNS='*-nonprod.json' bash -x bin/generate-excel.sh
```