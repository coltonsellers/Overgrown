import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import WebsiteItem from "./WebsiteItem";

export default function WebsiteList() {
  // Sample state for websites
  const [websites, setWebsites] = useState([
    { title: "Buy groceries for next week", timeLeft: "In progress" },
    { title: "Renew car insurance", timeLeft: "In progress" },
    { title: "Sign up for online course", timeLeft: "In progress" },
  ]);

  // Function to handle delete
  const handleDelete = (index) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  // Function to mark a task as finished
  const handleFinish = (index) => {
    setWebsites(
      websites.map((website, i) =>
        i === index ? { ...website, timeLeft: "Completed" } : website
      )
    );
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol lg="9" xl="7">
            <MDBCard className="rounded-3">
              <MDBCardBody className="p-4">
                <h4 className="text-center my-3 pb-3">To Do App</h4>
                <MDBRow className="row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2">
                  <MDBCol size="12">
                    <MDBInput label="Enter a task here" id="form1" type="text" />
                  </MDBCol>
                  <MDBCol size="12">
                    <MDBBtn type="submit">Save</MDBBtn>
                  </MDBCol>
                  <MDBCol size="12">
                    <MDBBtn type="submit" color="warning">
                      Get tasks
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
                <MDBTable className="mb-4">
                  <MDBTableHead>
                    <tr>
                      <th scope="col">Website</th>
                      <th scope="col">Time Left</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {websites.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No websites being tracked.
                        </td>
                      </tr>
                    ) : (
                      websites.map((website, index) => (
                        <WebsiteItem
                          key={index}
                          title={website.title}
                          timeLeft={website.timeLeft}
                          onDelete={() => handleDelete(index)}
                          onFinish={() => handleFinish(index)}
                        />
                      ))
                    )}
                  </MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}


/*
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
*/