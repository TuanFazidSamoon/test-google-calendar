import axios from "axios";

export async function handleGoogle() {
  const { initCodeClient } = window.google.accounts.oauth2;
  const SCOPES =
    "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const CLIENT_ID =
    "";
  if (initCodeClient) {
    const client = initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: "http://localhost:3001",
      ux_mode: "popup",
      prompt: "consent",
      response_type: "code",
      callback: async (response) => {
        console.log(response);
      },
    });

    client.requestCode();
  }
}
