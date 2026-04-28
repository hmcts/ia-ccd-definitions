var CryptoJS = require('crypto-js');
var fs = require('fs');

var fileName = 'target/appeal/json/UserProfile.json';
var fileNameBail = 'target/bail/json/UserProfile.json';
var content = fs.readFileSync(fileName, 'utf8');
var contentBail = fs.readFileSync(fileNameBail, 'utf8');

// Decrypt
var bytes  = CryptoJS.AES.decrypt(content.toString(), process.env.IA_CCD_SECRET_KEY);
var bytesBail  = CryptoJS.AES.decrypt(bytesBail.toString(), process.env.IA_CCD_SECRET_KEY);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
var plaintextBail = bytesBail.toString(CryptoJS.enc.Utf8);

fs.writeFileSync(fileName, plaintext);
fs.writeFileSync(fileNameBail, plaintextBail);
