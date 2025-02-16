import React, { useState, useEffect } from "react";
import WebsiteList from "./WebsiteList";

export default function Popup() {
    const [websites, setWebsites] = useState([]);

    return (
        <div className="p-4 w-64">
            <h1 className="text-lg font-bold mb-2">Screen Time Tracker</h1>
            <WebsiteList websites={websites} />
        </div>
    );
};
