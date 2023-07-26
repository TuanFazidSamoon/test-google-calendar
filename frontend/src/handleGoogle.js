import axios from "axios";

export async function handleGoogle() {
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";
  const client = window.google.accounts.oauth2.initCodeClient({
    client_id: "491217887110-89vldr8je8sdcq2qarc0jheqtmk5u7b6.apps.googleusercontent.com",
    scope: SCOPES,
    ux_mode: "popup",
    callback: async (response) => {
      console.log(response);
      try {
        if (!response.code) {
          return;
        }
        await axios
          .post("http://localhost:3001/storerefreshtoken", {
            code: response.code,
          })
          .then((response) => response.json())
          .then((data) => console.log("success"));
      } catch (error) {
        console.log(error);
      }
    },
  });
  client.requestCode();
}
