var fs = require('fs');
const path = require('path');

var fileName = path.join(__dirname, '../definitions/appeal/json/CaseEventToFields.json');


try {
    const content = fs.readFileSync(fileName, 'utf8');
    const caseEventToFieldJson = JSON.parse(content);

    const keyCountMap = new Map();
    const duplicates = [];

    caseEventToFieldJson.forEach((line, index) => {
        const uniqueKey = line.CaseEventID.concat('-').concat(line.CaseFieldID);

        if (keyCountMap.has(uniqueKey)) {
            keyCountMap.set(uniqueKey, keyCountMap.get(uniqueKey) + 1);
            duplicates.push(uniqueKey);
        } else {
            keyCountMap.set(uniqueKey, 0);
        }
    });

    if (duplicates.length) {
        console.log('\n\rCaseEvent-Casefield row duplications: ')
        duplicates.forEach(duplicate => {
            const parts = duplicate.split('-');
            const caseEventID = parts[0];
            const caseFieldID = parts[1];
            console.log('CaseEventID: ' + caseEventID + 'CaseFieldID: ' + caseFieldID)
        });
    }
} catch (err) {
    console.error(err);
}