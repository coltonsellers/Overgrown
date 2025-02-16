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
