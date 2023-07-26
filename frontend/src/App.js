import "./App.css";
import { useEffect, useState } from "react";
import { handleGoogle } from "./handleGoogle";
import axios from "axios";
import { usePostEventToCalendar } from "./postEvent";

function App() {
  const { postEvent } = usePostEventToCalendar();
  const createEvent = async () => {
    await axios.post("http://localhost:3001/updateanevent");
  };

  const handleAddEvent = () => {
    const eventDetails = {
      subject: "On leave",
      startDate: "2023-07-27T10:00:00Z", // Replace with the desired start date and time in ISO format
      endDate: "2023-07-27T11:00:00Z", // Replace with the desired end date and time in ISO format
    };

    postEvent(eventDetails);
  };
  return (
    <div className="calenderEvent-wrapper">
      <button type="button" onClick={handleGoogle}>
        Google
      </button>

      <button type="button" onClick={createEvent}>
        Create event
      </button>

      <button type="button" onClick={handleAddEvent}>
        Create event to outlook
      </button>
    </div>
  );
}

export default App;
