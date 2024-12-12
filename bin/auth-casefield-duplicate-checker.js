var fs = require('fs');
const path = require('path');

var fileName = path.join(__dirname, '../definitions/appeal/json/AuthorisationCaseField.json');


try {
    const content = fs.readFileSync(fileName, 'utf8');
    const caseEventToFieldJson = JSON.parse(content);

    const keyCountMap = new Map();
    const duplicates = new Set();

    caseEventToFieldJson.forEach((line, index) => {
        const uniqueKey = line.CaseFieldID.concat('+').concat(line.UserRole);
        if (keyCountMap.has(uniqueKey)) {
            keyCountMap.set(uniqueKey, keyCountMap.get(uniqueKey) + 1);
            duplicates.add(uniqueKey);
        } else {
            keyCountMap.set(uniqueKey, 1);
        }
    });

    if (duplicates.size) {
        console.log('\n\rCaseFieldID-UserRole row duplications: ')
        duplicates.forEach(duplicate => {
            const parts = duplicate.split('+');
            const caseFieldID = parts[0];
            const userRole = parts[1];
            console.log('CaseFieldID: ' + caseFieldID + ', UserRole: ' + userRole)
        });
        process.exit(1);
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}