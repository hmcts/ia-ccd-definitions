const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, '../definitions/appeal/json');

try {
    const files = fs.readdirSync(jsonDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let hasErrors = false;
    
    console.log(`Validating ${jsonFiles.length} JSON files...`);
    
    jsonFiles.forEach(file => {
        const filePath = path.join(jsonDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
            console.log(`✓ ${file} - Valid JSON`);
        } catch (error) {
            console.error(`✗ ${file} - Invalid JSON: ${error.message}`);
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        console.error('\nJSON validation failed!');
        process.exit(1);
    } else {
        console.log('\nAll JSON files are valid!');
    }
} catch (error) {
    console.error('Error reading JSON directory:', error);
    process.exit(1);
} 