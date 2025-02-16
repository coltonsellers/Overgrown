import React from "react";

export default function WebsiteItem({ title, timeLeft }) {
    return (
        <li className="flex justify-between items-center p-2 border-b">
            <span>{title}</span>
            <span className={`font-bold ${timeLeft <= 5 ? "text-red-500" : "text-black"}`}>
                {timeLeft} min
            </span>
        </li>
    );
};
