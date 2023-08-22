import "./App.css";
import { useEffect, useState } from "react";
import { handleGoogle } from "./handleGoogle";
import axios, { AxiosHeaders } from "axios";
import { usePostEventToCalendar } from "./postEvent";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

function App() {
  const { postEvent } = usePostEventToCalendar();
  // const login = useGoogleLogin({
  //   onSuccess: codeResponse => console.log(codeResponse),
  //   flow: 'auth-code',
  // });
  const callBackend = async () => {
    const res = await axios.get("http://localhost:3001/storerefreshtoken");
    window.location.replace(res.data);
  };

  const createEvent = async () => {
    await axios.post("http://localhost:3001/updateanevent");
  };

  const deleteEvent = async () => {
    await axios.delete("http://localhost:3001/deleteEvent");
  };
  const handleAddEvent = () => {
    const eventDetails = {
      subject: "On leave",
      startDate: "2023-07-28T10:00:00Z", // Replace with the desired start date and time in ISO format
      endDate: "2023-07-28T11:00:00Z", // Replace with the desired end date and time in ISO format
    };

    postEvent(eventDetails);
  };

  const handleRedirect = async () => {
    await axios.get(
      "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&include_granted_scopes=true&response_type=code&prompt=consent&client_id=1025558390382-c02ij08afj9l005k842ho3vkgcukd4ml.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3001"
    );
  };

  const createCalendar = async () => {
    await axios.post("http://localhost:3001/createCalendar");
  };
  return (
    <div className="calenderEvent-wrapper">
      <button type="button" onClick={callBackend}>
        Google
      </button>

      <a href="https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&include_granted_scopes=true&response_type=code&prompt=consent&client_id=1025558390382-c02ij08afj9l005k842ho3vkgcukd4ml.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3001">
        <button type="button" onClick={handleRedirect}>
          Google anayak
        </button>
      </a>

      <button type="button" onClick={createEvent}>
        Create event
      </button>

      <button type="button" onClick={handleAddEvent}>
        Create event to outlook
      </button>

      <button type="button" onClick={deleteEvent}>
        Delete
      </button>
      <button type="button" onClick={createCalendar}>
        Create a secondary calendar
      </button>

      <GoogleOAuthProvider></GoogleOAuthProvider>
    </div>
  );
}

export default App;
