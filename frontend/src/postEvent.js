import { Client } from "@microsoft/microsoft-graph-client";
import { useMicrosoft } from "./handleMicrosoft";

export const usePostEventToCalendar = () => {
  const { getAccessToken } = useMicrosoft();

  const postEvent = async (eventDetails) => {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.log("Unable to get access token.");
        return;
      }

      // Initialize Microsoft Graph client with the access token
      const client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });

      // Construct the event object
      const event = {
        subject: eventDetails.subject,
        start: {
          dateTime: eventDetails.startDate,
          timeZone: "UTC", // Replace with the desired time zone
        },
        end: {
          dateTime: eventDetails.endDate,
          timeZone: "UTC", // Replace with the desired time zone
        },
      };

      // Post the event to the user's calendar
      await client.api("/me/events").post(event);

      console.log("Event successfully posted to the calendar.");
    } catch (error) {
      console.log("Error posting event to the calendar:", error);
    }
  };

  return { postEvent };
};
