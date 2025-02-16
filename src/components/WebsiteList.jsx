import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import WebsiteItem from "./WebsiteItem";

export default function WebsiteList() {
  const [websites, setWebsites] = useState([
    { title: "Buy groceries for next week", timeLeft: "In progress" },
    { title: "Renew car insurance", timeLeft: "In progress" },
    { title: "Sign up for online course", timeLeft: "In progress" },
  ]);

  const [newWebsite, setNewWebsite] = useState(""); // Stores new website name
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility

  // Function to handle adding a new website
  const handleAddWebsite = () => {
    if (newWebsite.trim() === "") return;
    setWebsites([...websites, { title: newWebsite, timeLeft: "In progress" }]);
    setNewWebsite(""); // Clear input
    setModalOpen(false); // Close modal
  };

  // Function to delete a website
  const handleDelete = (index) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  // Function to mark a website as finished
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
                <h4 className="text-center my-3 pb-3">Minimize the amount of time you spend on certain sites! Improve your </h4>

                {/* Modal for Adding a New Website */}
                <MDBModal show={modalOpen} setShow={setModalOpen}>
                  <MDBModalHeader>Add New Website</MDBModalHeader>
                  <MDBModalBody>
                    <MDBInput
                    label="Enter a website here"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    />
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={() => setModalOpen(false)}>
                      Cancel
                    </MDBBtn>
                    <MDBBtn color="success" onClick={handleAddWebsite}>
                      Save
                    </MDBBtn>
                  </MDBModalFooter>
                </MDBModal>

                {/* Buttons to Add New Wesbite */}
                <MDBRow className="d-flex justify-content-center mb-4 pb-2">
                  <MDBCol size="auto">
                    <MDBBtn onClick={() => setModalOpen(true)} color="primary">
                      Add
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>

                {/* Table of Websites */}
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