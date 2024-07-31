const fs = require('fs');

const path = require('path');

var caseFieldFileName = path.join(__dirname, '../definitions/appeal/json/CaseField.json');
var AuthorisationCaseFieldfileName = path.join(__dirname, '../definitions/appeal/json/AuthorisationCaseField.json');

// Function to read JSON file
const readJSONFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

// Function to check IDs
const checkIDs = async (caseFieldFile, AuthorisationCaseFieldfile) => {
    try {
        const caseFields = await readJSONFile(caseFieldFile);
        const Authorisations = await readJSONFile(AuthorisationCaseFieldfile);

        const caseFieldIds = caseFields
            .filter(entry => entry.FieldType !== 'Label')
            .map(entry => entry.ID)
            .filter(id => !id.includes('progress_') ); // Ignore IDs with 'progress_'

        const AuthorisationsEntries = Authorisations.filter(entry =>
          entry.UserRole === 'caseworker-ia-system' && entry.CRUD === 'CRUD'
        );
        const AuthorisationsIds = AuthorisationsEntries.map(entry => entry.CaseFieldID);

        const missingIDs = caseFieldIds.filter(id => !AuthorisationsIds.includes(id));

        if (missingIDs.length > 0) {
            console.log('The following relevant IDs are missing in the second file with the specified UserRole and CRUD:', missingIDs);
            console.log('Add the following authorisations to AuthorisationCaseField file');
            missingIDs.forEach(element => {
                console.log("{\"LiveFrom\": \"01/01/2018\", \"CaseTypeID\": \"Asylum\", \"CaseFieldID\": \"" + element + "\", \"UserRole\": \"caseworker-ia-system\", \"CRUD\": \"CRUD\"},");
            });
            process.exit(1);
        }
    } catch (error) {
        console.error('Error reading files:', error);
        process.exit(1);
    }
};


checkIDs(caseFieldFileName, AuthorisationCaseFieldfileName);
