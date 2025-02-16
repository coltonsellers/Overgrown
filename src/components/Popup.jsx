import React, { useState, useEffect } from "react";
import WebsiteList from "./WebsiteList";
import cloud from "../assets/clouds2.svg";

export default function Popup() {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    // Fetch websites data from background.js
    chrome.runtime.sendMessage({ type: "getWebsites" }, response => {
      setWebsites(response);
    });
  }, []);

  return (
    <div className="p-4 w-64">
      <img src={cloud} alt="logo" className="cloud" />
      <h1 className="text-lg font-bold mb-2">Screen Time Tracker</h1>
      <WebsiteList websites={websites} />
    </div>
  );
}
