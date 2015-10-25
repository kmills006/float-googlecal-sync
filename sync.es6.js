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

  // Authorize Google
  authorizeGoogle(googleConfig, getEvents)
  .then(auth => { return getEvents(auth); })
  .then(events => {
    console.log('events: ', events);
  });

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

      /*console.log(floatTasks);*/
    }
  });
});

// Google
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const SCOPES = ['http://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
                   process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

function authorizeGoogle(credentials) {
  return new Promise((resolve, reject) => {
    const clientSecret = credentials.installed.clientSecret;
    const clientId = credentials.installed.clientId;
    const redirectUrl = credentials.installed.redirectUris[0];
    const auth = new googleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        throw new Error('No token found..');
      } else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(oauth2Client);
      }
    });
  });
}

function getEvents(auth) {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar('v3');

    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: (new Date().toISOString()),
    }, (err, response) => {
      if (err) { throw new Error('Could not connect to Google Calendar.'); }

      var events = response.items;

      if (events.length === 0) {
        console.log('No upcoming events found.');
      } else {
        console.log(`${events.length} events found`);

        resolve(events.map((e) => {
          return {
            eventId: e.id,
            summary: e.summary,
            eventStatus: e.status,
            start: e.start.dateTime,
            endTime: e.end.dateTime,
          };
        }));
      }
    });
  });
};
