var CryptoJS = require('crypto-js');
var fs = require('fs');

var fileName = 'definitions/appeal/env/prod/UserProfile.json';
var content = fs.readFileSync(fileName, 'utf8');

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(content, process.env.IA_CCD_SECRET_KEY);

fs.writeFileSync(fileName, ciphertext);