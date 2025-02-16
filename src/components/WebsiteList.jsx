import React from "react";
import WebsiteItem from "./WebsiteItem";

export default function WebsiteList({ websites }) {
    return (
        <div>
            {websites.length === 0 ? (
                <p className="text-gray-500">No websites being tracked.</p>
            ) : (
                <ul>
                    {websites.map((website, index) => (
                        <WebsiteItem key={index} title={website.title} timeLeft={website.timeLeft} />
                    ))}
                </ul>
            )}
        </div>
    );
};