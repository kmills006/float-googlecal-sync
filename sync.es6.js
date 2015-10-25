"use strict";

require('es6-promise').polyfill();

// Check For Arguments
var program = require('commander');

program
  .version('0.0.1')
  .option('-t --floatTaskId [floatTaskId]', 'Float Task Id')
  .option('-p --floatPeopleId [floatPeopleId]', 'Float People Id')
  .parse(process.argv);

const floatPeopleId = program.floatPeopleId || 142306;
const floatTaskId = program.floatTaskId || '';

const fs = require('fs');
const readfill = require('readline');

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
