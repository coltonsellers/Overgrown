import React from "react";

export default function WebsiteItem({ title, timeLeft, onDelete, onEdit }) {
  return (
    <tr>
      <td>{title}</td>
      <td>{timeLeft}</td>
      <td>
        <button type="button" className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
        <button type="button" className="btn btn-success ms-1" onClick={onEdit}>
          Edit
        </button>
      </td>
    </tr>
  );
}

/*
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
*/