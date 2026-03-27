/*
 Checks duplicate rows in definitions/appeal/json/AuthorisationCaseEvent.json
 Duplicate key = CaseEventID + UserRole
 - Prints each duplicate with count and array indices where it occurs
 - Exits with code 1 if duplicates found
*/

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../definitions/appeal/json/AuthorisationCaseEvent.json');

try {
  const raw = fs.readFileSync(targetFile, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    console.error(`Unexpected JSON structure in ${targetFile}. Expected an array.`);
    process.exit(1);
  }

  const keyToIndexesMap = new Map();

  entries.forEach((row, index) => {
    const caseEventId = row && row.CaseEventID ? String(row.CaseEventID) : '';
    const userRole = row && row.UserRole ? String(row.UserRole) : '';
    const key = `${caseEventId}__${userRole}`;

    if (!keyToIndexesMap.has(key)) {
      keyToIndexesMap.set(key, []);
    }
    keyToIndexesMap.get(key).push(index);
  });

  const duplicates = [];
  for (const [key, indices] of keyToIndexesMap.entries()) {
    if (indices.length > 1) {
      const [caseEventId, userRole] = key.split('__');
      duplicates.push({ caseEventId, userRole, count: indices.length, indices });
    }
  }

  if (duplicates.length) {
    console.log('\nAuthorisationCaseEvent duplicates detected:');
    duplicates
      .sort((a, b) => b.count - a.count || a.caseEventId.localeCompare(b.caseEventId) || a.userRole.localeCompare(b.userRole))
      .forEach(({ caseEventId, userRole, count, indices }) => {
        console.log(`- CaseEventID: ${caseEventId}, UserRole: ${userRole} -> ${count} occurrences at indexes [${indices.join(', ')}]`);
      });
    process.exit(1);
  } else {
    console.log('No duplicates found in AuthorisationCaseEvent.');
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}


