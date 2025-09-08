/*
 * Comprehensive check for mismatches between CaseEventToFields.json and CaseEvent.json
 * where fields have Publish: "Y" but the corresponding events have Publish: "N"
 */

const fs = require('fs');
const path = require('path');

const caseEventToFieldsFile = path.join(__dirname, '../definitions/appeal/json/CaseEventToFields.json');
const caseEventFile = path.join(__dirname, '../definitions/appeal/json/CaseEvent.json');

try {
  // Read both files
  const caseEventToFields = JSON.parse(fs.readFileSync(caseEventToFieldsFile, 'utf8'));
  const caseEvents = JSON.parse(fs.readFileSync(caseEventFile, 'utf8'));

  // Create a map of CaseEventID to Publish value from CaseEvent.json
  const eventPublishMap = new Map();
  caseEvents.forEach(event => {
    if (event.ID) {
      // If Publish is not specified, it defaults to not being published (false)
      const publishValue = event.Publish || "N";
      eventPublishMap.set(event.ID, publishValue);
    }
  });

  // Find fields in CaseEventToFields.json with Publish: "Y"
  const publishYFields = caseEventToFields.filter(field => 
    field.Publish === "Y" && field.CaseEventID
  );

  console.log(`Found ${publishYFields.length} fields with Publish: "Y" in CaseEventToFields.json\n`);

  // Check for mismatches
  const mismatches = [];
  publishYFields.forEach(field => {
    const eventPublish = eventPublishMap.get(field.CaseEventID);
    if (eventPublish === "N") {
      mismatches.push({
        field: field,
        eventId: field.CaseEventID,
        fieldPublish: field.Publish,
        eventPublish: eventPublish,
        caseFieldId: field.CaseFieldID
      });
    }
  });

  if (mismatches.length === 0) {
    console.log("✅ No mismatches found! All fields with Publish: 'Y' have corresponding events with Publish: 'Y'.");
  } else {
    console.log(`❌ Found ${mismatches.length} mismatches:\n`);
    
    // Group by CaseFieldID for better readability
    const mismatchesByField = {};
    mismatches.forEach(mismatch => {
      if (!mismatchesByField[mismatch.caseFieldId]) {
        mismatchesByField[mismatch.caseFieldId] = [];
      }
      mismatchesByField[mismatch.caseFieldId].push(mismatch);
    });

    Object.keys(mismatchesByField).forEach(caseFieldId => {
      console.log(`Field: ${caseFieldId}`);
      mismatchesByField[caseFieldId].forEach(mismatch => {
        console.log(`  - Event: ${mismatch.eventId} (Event Publish: ${mismatch.eventPublish})`);
      });
      console.log('');
    });
    
    console.log("These fields should either:");
    console.log("- Have Publish: 'N' to match their events, or");
    console.log("- The corresponding events should have Publish: 'Y'");
    
    // Check specifically for appellantInDetention
    const appellantInDetentionMismatches = mismatches.filter(m => m.caseFieldId === 'appellantInDetention');
    if (appellantInDetentionMismatches.length > 0) {
      console.log('\n🚨 SPECIFIC ISSUE WITH appellantInDetention:');
      appellantInDetentionMismatches.forEach(mismatch => {
        console.log(`  - Event ${mismatch.eventId} has Publish: "${mismatch.eventPublish}" but field has Publish: "${mismatch.fieldPublish}"`);
      });
    }
    
    process.exit(1);
  }

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
