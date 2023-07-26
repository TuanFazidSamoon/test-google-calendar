const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const google = require("@googleapis/calendar");
const app = express();
const cors = require("cors");
const event = require("./event.json");

app.use(cors());
app.use(express.json());

const GOOGLE_CLIENT_ID =
  "491217887110-89vldr8je8sdcq2qarc0jheqtmk5u7b6.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URL = "http://localhost:3000";

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);

let token;

async function GetRefreshToken(token) {
  let refreshToken = await oAuth2Client.getToken(token);
  return refreshToken;
}

app.post("/storerefreshtoken", async function (req, res) {
  const _token = await GetRefreshToken(req?.body?.code);
  token = _token;
  res.send("success");
});

async function CreateEvent(data, refreskToken) {
  console.log(refreskToken);
  await oAuth2Client.setCredentials({ refresh_token: refreskToken });
  const calendar = google.calendar("v3");
  const events = await calendar.events.list({
    auth: oAuth2Client,
    calendarId: "primary",
    timeMin: event.start.dateTime,
    timeMax: event.end.dateTime,
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime",
  });

  if (events.data.items.length > 0) {
    for (let i = 0; i < events.data.items.length; i++) {
      const conflictingEvent = events.data.items[i];

      if (conflictingEvent.attendees && conflictingEvent.attendees.length > 0) {
        const attendees = conflictingEvent.attendees;
        const me = attendees?.find((attendee) => attendee.self);
        me.responseStatus = "declined";
        const index = attendees.indexOf(me);
        attendees[index] = me;
        await calendar.events.patch({
          auth: oAuth2Client,
          calendarId: "primary",
          eventId: conflictingEvent.id,
          requestBody: {
            attendees: attendees,
          },
        });
      }
    }
  }
  const res = await calendar.events.insert({
    auth: oAuth2Client,
    calendarId: "primary",
    requestBody: event,
  });
  return res;
}

app.post("/updateanevent", async function (req, res) {
  let refreskToken =
    "1//0gJXpfZ-Qz8zMCgYIARAAGBASNwF-L9Ir-Eb6hgzyzQJKBoStRIpW816DKvbI7Q2ILm5WbG2beE4hsNTKMAeNoJx0uG_FPzeC5Eo";
  let result = await CreateEvent(req.body, refreskToken);
  res.send(result);
  // this result will give you event id you can store it res.send(result)
});
app.listen(3001, () => console.log("Server running on port 3001"));
