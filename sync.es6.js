"use strict";

console.log('Sync Float Schedule with Google Calendar');

require('es6-promise').polyfill();

const fs = require('fs');
const readfill = require('readline');

function getSecrets() {
  return new Promise((resolve, reject) => {
    fs.readFile('secrets.json', (err, content) => {
      if (err) {
        console.log('Error loading secrets file.. ', err);
      }

      resolve(JSON.parse(content));
    });
  });
};

getSecrets()
.then(secrets => {
  console.log('secrets: ', secrets);
});
