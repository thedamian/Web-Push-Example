const webpush = require('web-push');
const fs = require('fs');
const vapidKeys = webpush.generateVAPIDKeys()

const dotEnvFileContent = `WEBPUSHPUBLICKEY: ${vapidKeys.publicKey}\nWEBPUSHPRIVATEKEY: ${vapidKeys.privateKey}\n\n`
try {
  fs.writeFileSync('./.env', dotEnvFileContent);
  // file written successfully
} catch (err) {
  console.error("Error writting .env file.",err);
}

console.log("public and private keys have been written to your .env file");
