"use strict";

require('es6-promise').polyfill();

// Check For Arguments
const cliArgs = require("command-line-args");
const cli = cliArgs([
  { name: 'floatPeopleId', alias: 'p', type: Number, },
  { name: 'floatTaskId', alias: 't', type: Number, defaultOption: false },
]);

const argsPassed = cli.parse();

if (!argsPassed.floatPeopleId) {
  throw new Error('Float People ID must be present. Aborting...');
}


// Set Float IDs
const floatPeopleId = argsPassed.floatPeopleId;
const floatTaskId = argsPassed.floatTaskId || '';


// File System && Readline
const fs = require('fs');
const readfill = require('readline');


// Read Secrets
function getSecrets() {
  return new Promise((resolve, reject) => {
    fs.readFile('secrets.json', (err, content) => {
      if (err) {
        console.log('Error loading secrets file.. ', err);
        reject(err);
      }

      resolve(JSON.parse(content));
    });
  });
};


// Execute Sync
getSecrets()
.then(secrets => {
  const floatConfig = secrets.floatSchedule;
  const googleConfig = secrets.google;

  const popsicle = require('popsicle');

  popsicle({
    method: 'GET',
    url: floatConfig.apiUrl + 'tasks',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${floatConfig.apiToken}`,
    },
    query: {
      people_id: floatPeopleId,
    },
  })
  .then(function (res) {
    if (res.status != 200) {
      console.log('Could not receive tasks for Float People ID: ', floatPeopleId);
      throw new Error();
    } else {
      const floatTasks = res.body.people[0].tasks;

      console.log(floatTasks);
    }
  });
});
