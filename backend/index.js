const { OAuth2Client, JWT } = require("google-auth-library");
const express = require("express");
const google = require("@googleapis/calendar");
const app = express();
const cors = require("cors");
const event = require("./event.json");
const credentials = require("./calendar-test-393506-111708867617.json");

app.use(cors());

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const GOOGLE_CLIENT_ID =
  "";
const GOOGLE_CLIENT_SECRET = "";
const REDIRECT_URL = "http://localhost:3001";

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar",
];

let token;

async function GetRefreshToken(token) {
  let refreshToken = await oAuth2Client.getToken(token);
  // console.log("refreshToken ", refreshToken);
  return refreshToken;
}

app.get("/", async function (req, res) {
  console.log("req ");
  console.log("req ", req);
  res.status(302).redirect("https://www.youtube.com");
});

app.get("/storerefreshtoken", async function (req, res) {
  const authorizationUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    include_granted_scopes: true,
    response_type: "code",
    prompt: "consent",
  });

  console.log("authorizationUrl ", authorizationUrl);
  // res.status(302).redirect(authorizationUrl);
  // res.writeHead(302, { Location: "https://leaveapplication.rootcode.software/signin" });
  // res.end();
  res.send(authorizationUrl);
  // res.status(302).redirect(authorizationUrl);
  // console.log("Sssssssssss")
  // console.loig("req ", req)
  // const _token = await GetRefreshToken(req?.body?.code);
  // token = _token;
  // res.send("success");
});

async function CreateEvent(data, refreskToken) {
  await oAuth2Client.setCredentials({
    access_token: token?.tokens?.refreshToken,
  });

  // const auth = new google.auth.GoogleAuth({
  //   keyFile: credentials,
  //   scopes: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar"],
  // })
  const calendar = google.calendar({
    version: "v3",
    auth: oAuth2Client,
  });

  // const userEmail = "fazid.samoon@rootcodelabs.com";
  // const authClient = await auth.getClient();
  // authClient.subject = userEmail;
  // const x = await calendar.acl.insert({
  //   auth: oAuth2Client,
  //   calendarId: "primary",
  //   requestBody: {
  //     role: "writer",
  //     scope: {
  //       type: "user",
  //       value: "testing-google-caendar-api@calendar-test-393506.iam.gserviceaccount.com",
  //     },
  //   },
  // });
  // console.log("acl ", x)
  const calendarList = await calendar.calendarList.list({
    auth: oAuth2Client,
  });
  // console.log("calendar list ", calendarList.data.items);
  const events = await calendar.events.list({
    auth: oAuth2Client,
    calendarId: "primary",
    timeMin: event.start.dateTime,
    timeMax: event.end.dateTime,
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime",
  });

  console.log(events.data.items);
  // if (events.data.items.length > 0) {
  //   for (let i = 0; i < events.data.items.length; i++) {
  //     const conflictingEvent = events.data.items[i];

  //     if (conflictingEvent.attendees && conflictingEvent.attendees.length > 0) {
  //       const attendees = conflictingEvent.attendees;
  //       const me = attendees?.find((attendee) => attendee.self);
  //       me.responseStatus = "declined";
  //       const index = attendees.indexOf(me);
  //       attendees[index] = me;
  //       await calendar.events.patch({
  //         auth: oAuth2Client,
  //         calendarId: "primary",
  //         eventId: conflictingEvent.id,
  //         requestBody: {
  //           attendees: attendees,
  //           visibility: "public",
  //         },
  //       });
  //     }
  //   }
  // }
  // const res = await calendar.events.insert({
  //   auth: oAuth2Client,
  //   calendarId: "primary",
  //   requestBody: event,
  // });
  // console.log("event ", res);
  // return res;
}

app.post("/updateanevent", async function (req, res) {
  let refreskToken = token?.tokens?.access_token;
  let result = await CreateEvent(req.body, refreskToken);
  res.send(result);
  // await oAuth2Client.setCredentials({
  //   access_token: token?.tokens?.access_token,
  // });
  // const auth = new google.auth.GoogleAuth({
  //   keyFile: credentials,
  //   scopes: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar"],
  //   credentials: {
  //     client_email: credentials.client_email,
  //     private_key: credentials.private_key
  //   },
  //   projectId: credentials.project_id
  // })
  // const googleCalendar = google.calendar("v3");
  // const calendars = await googleCalendar.calendarList.list({
  //   auth: oAuth2Client
  // })

  // console.log(calendars)
  // const calendars = new googleCalendar.calendarList.get({
  //   auth: new google.auth.JWT(
  //     credentials.client_email,
  //     credentials,
  //     credentials.private_key,
  //     ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
  //     "fazid.samoon@rootcodelabs.com"
  //   )
  // })
  // const event = await calendars.events.get({
  //   calendarId: 'fazid.samoon@rootcodelabs.com',
  //   eventId: 's9cop56rl26srs40irsl72edsg'
  // });

  // console.log(event.data)
  // await calendars.events.update({
  //   calendarId: 'fazid.samoon@rootcodelabs.com',
  //   eventId: 's9cop56rl26srs40irsl72edsg',
  //   requestBody: {
  //     ...event.data,
  //     description: 'Updated description helo hello',
  //     summary: 'Updated Summary wada karapn'
  //   }
  // });
});

app.delete("/deleteEvent", async function (req, res) {
  console.log("ssssssssssssssssssssss");
  let refreskToken = token?.tokens?.refresh_token;
  await oAuth2Client.setCredentials({ refresh_token: refreskToken });
  const calendar = google.calendar("v3");

  await calendar.events.delete({
    auth: oAuth2Client,
    calendarId: "fazid.samoon@rootcodelabs.com",
    eventId: "brjvgugkf2la6hk2airhhgchjk",
    oauth_token: refreskToken,
  });
  res.send("success");
});

app.post("/createCalendar", async function (req, res) {
  await oAuth2Client.setCredentials({
    access_token: token?.tokens?.access_token,
  });
  const calendar = google.calendar("v3");
  const response = await calendar.calendars.insert({
    auth: oAuth2Client,
    requestBody: {
      summary: "MyLeave Calendar",
    },
  });
  console.log("calendar ", response);
  res.send("success");
});

app.delete("/deleteEventFromService", async function (req, res) {
  const googleClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  const calendar = google.calendar("v3");
  try {
    // const createdEvent = await calendar.events.delete({
    //   auth: googleClient,
    //   calendarId: "tuan.fazid@gmail.com",
    //   eventId: "3vf5q6s7ctbgj3iekha9n09k8c",
    // })

    const createdEvent = await calendar.events.insert({
      auth: googleClient,
      calendarId: "tuan.fazid@gmail.com",
      requestBody: event,
    });

    console.log("deleted event ", createdEvent);
  } catch (error) {
    console.log("error ", error);
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
