var CryptoJS = require("crypto-js");
var fs = require('fs');

var content = fs.readFileSync('target/appeal/json/UserProfile.json', 'utf8');

// Decrypt
var bytes  = CryptoJS.AES.decrypt(content.toString(), process.env.IA_CCD_SECRET_KEY);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);

fs.writeFileSync('target/appeal/json/UserProfile.json', plaintext);