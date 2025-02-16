import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

export default function WebsiteItem({ title, timeLeft, onDelete, onEdit }) {
  return (
    <tr>
      <td>{title}</td>
      <td>{timeLeft}</td>
      <td>
        <MDBBtn type="button" color="danger" onClick={onDelete}>
          Delete
        </MDBBtn>
        <MDBBtn type="button" color="success" className="ms-1" onClick={onEdit}>
          Edit
        </MDBBtn>
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