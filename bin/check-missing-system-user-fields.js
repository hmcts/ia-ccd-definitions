const fs = require('fs');
const path = require('path');

const appealCaseFieldPath = path.join(__dirname, '../definitions/appeal/json/CaseField.json');
const appealAuthorisationCaseFieldPath = path.join(__dirname, '../definitions/appeal/json/AuthorisationCaseField.json');
const bailCaseFieldPath = path.join(__dirname, '../definitions/bail/json/CaseField.json');
const bailAuthorisationCaseFieldPath = path.join(__dirname, '../definitions/bail/json/AuthorisationCaseField.json');

try {
    const appealCaseField = fs.readFileSync(appealCaseFieldPath, 'utf8');
    const appealAuthCaseField = fs.readFileSync(appealAuthorisationCaseFieldPath, 'utf8');
    handleContent(appealCaseField, appealAuthCaseField);
    const bailCaseField = fs.readFileSync(bailCaseFieldPath, 'utf8');
    const bailAuthCaseField = fs.readFileSync(bailAuthorisationCaseFieldPath, 'utf8');
    handleContent(bailCaseField, bailAuthCaseField);
} catch (error) {
    console.error('Error reading files:', error);
    process.exit(1);
}

function handleContent(content, contentAuth) {
    const caseFields = JSON.parse(content)
    const Authorisations = JSON.parse(contentAuth)

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
}
