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
  await oAuth2Client.setCredentials({
    access_token: token?.tokens?.access_token,
  }); 
  const calendar = google.calendar("v3");
  calendar.acl.insert({
    auth: oAuth2Client,
    calendarId: "primary",
    requestBody: {
      role: "writer",  
      scope: {
        type: "group",
        value: "myleave-calendar-test@googlegroups.com",
      },
    },
  })  
  const calendarList = await calendar.calendarList.list({
    auth: oAuth2Client,
  });
  console.log("calendar list ", calendarList.data.items)
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
        console.log("sssss ", conflictingEvent.id);
        await calendar.events.patch({
          auth: oAuth2Client,
          calendarId: "primary",
          eventId: conflictingEvent.id,
          requestBody: {
            attendees: attendees,
            visibility: "public",

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

  console.log("event ", res);
  return res; 
}  
 
app.post("/updateanevent", async function (req, res) {
  let refreskToken = token?.tokens?.access_token;
  let result = await CreateEvent(req.body, refreskToken);
  res.send(result);
  // this result will give you event id you can store it res.send(result)
}); 
 
app.delete("/deleteEvent", async function (req, res) {
  console.log("ssssssssssssssssssssss")
  let refreskToken = token?.tokens?.refresh_token;
  await oAuth2Client.setCredentials({ refresh_token: refreskToken });
  const calendar = google.calendar("v3");

  // const a = await calendar.events.list({
  //   auth: oAuth2Client,
  //   calendarId: "fazidsamoon331@gmail.com",

  // })  
 
 
  await calendar.events.delete({
    auth: oAuth2Client, 
    // calendarId: "p32s9b4k2s6r800o",
    calendarId: "fazidsamoon331@gmail.com",
    eventId: "kgl4etp94lb9n0u3k7v6ptrs00", 
    oauth_token: refreskToken
  });
  res.send("success"); 
});

app.listen(3001, () => console.log("Server running on port 3001"));
  