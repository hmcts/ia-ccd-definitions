var CryptoJS = require("crypto-js");
var fs = require('fs');

var content = fs.readFileSync('definitions/appeal/env/prod/UserProfile.json', 'utf8');

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(content, process.env.IA_CCD_SECRET_KEY);

fs.writeFileSync('definitions/appeal/env/prod/UserProfile.json', ciphertext);