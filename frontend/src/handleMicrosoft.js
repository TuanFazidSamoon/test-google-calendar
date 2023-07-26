import { PublicClientApplication } from "@azure/msal-browser";

export const useMicrosoft = () => {
  //   const msalConfig = {
  //     auth: {
  //       clientId: "b6386c46-c959-4ff2-b632-3ec873822458",
  //       redirectUri: "http://localhost:3000",
  //     },
  //     cache: {
  //       cacheLocation: "sessionStorage",
  //       storeAuthStateInCookie: false,
  //     },
  //   };

  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: "bc43d618-5cde-471e-8dc5-7998cda16c38",
      redirectUri: "http://localhost:3000",
    },
  });

  const scopes = ["calendars.readwrite"];

  const signIn = async () => {
    try {
      const response = await msalInstance.acquireTokenPopup({ scopes: scopes });
      console.log("response ", response);
      // Handle successful login
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessToken = async () => {
    const accounts = msalInstance.getAllAccounts();
    console.log("accounts ", accounts);
    if (accounts.length === 0) {
        console.log("No accounts detected, please sign in.")
      signIn();
      return null;
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes,
      });

      console.log("token ",response);
      return response.accessToken;
    } catch (error) {
      console.log("Error acquiring access token:", error);
      signIn();
      return null;
    }
  };
  return { signIn, getAccessToken };
};
