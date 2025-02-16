import React, { useState } from "react";

export default function WebsiteList() {
  const [websites, setWebsites] = useState([
    { title: "Buy groceries for next week", timeLeft: "In progress" },
    { title: "Renew car insurance", timeLeft: "In progress" },
    { title: "Sign up for online course", timeLeft: "In progress" },
  ]);

  const [newWebsite, setNewWebsite] = useState("");
  const [newTimeLimit, setNewTimeLimit] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddWebsite = () => {
    if (newWebsite.trim() === "" || newTimeLimit.trim() === "") return;
    if (editIndex !== null) {
      // Update existing website
      const updatedWebsites = websites.map((website, index) =>
        index === editIndex ? { title: newWebsite, timeLeft: newTimeLimit } : website
      );
      setWebsites(updatedWebsites);

      // Send the updated websites data to background.js
      chrome.runtime.sendMessage({ type: "updateWebsites", websites: updatedWebsites });
      setEditIndex(null);
    } else {
      // Add new website
      const newSite = { title: newWebsite, timeLeft: newTimeLimit };
      setWebsites([...websites, newSite]);

      // Send the new website data to background.js
      chrome.runtime.sendMessage({ type: "addWebsite", website: newWebsite, timeLeft: newTimeLimit });
    }
    setNewWebsite("");
    setNewTimeLimit("");
    setModalOpen(false);
  };

  const handleDelete = (index) => {
    const updatedWebsites = websites.filter((_, i) => i !== index);
    setWebsites(updatedWebsites);

    // Send the updated websites data to background.js
    chrome.runtime.sendMessage({ type: "updateWebsites", websites: updatedWebsites });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewWebsite(websites[index].title);
    setNewTimeLimit(websites[index].timeLeft);
    setModalOpen(true);
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-9 col-xl-7">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">
                  Minimize the amount of time you spend on certain sites! Improve your productivity.
                </h4>

                {/* Modal for Adding a New Website */}
                {modalOpen && (
                  <div className="modal">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{editIndex !== null ? "Edit Website" : "Add New Website"}</h5>
                        <button onClick={() => { setModalOpen(false); setEditIndex(null); }}>&times;</button>
                      </div>
                      <div className="modal-body">
                        <input
                          type="text"
                          placeholder="Enter a website here"
                          value={newWebsite}
                          onChange={(e) => setNewWebsite(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Enter a time limit"
                          value={newTimeLimit}
                          onChange={(e) => setNewTimeLimit(e.target.value)}
                        />
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => { setModalOpen(false); setEditIndex(null); }}>
                          Cancel
                        </button>
                        <button className="btn btn-success" onClick={handleAddWebsite}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Button to Add New Website */}
                <div className="row d-flex justify-content-center mb-4 pb-2">
                  <div className="col-auto">
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                      Add
                    </button>
                  </div>
                </div>

                {/* Table of Websites */}
                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">Website</th>
                      <th scope="col">Time Left</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No websites being tracked.
                        </td>
                      </tr>
                    ) : (
                      websites.map((website, index) => (
                        <tr key={index}>
                          <td>{website.title}</td>
                          <td>{website.timeLeft}</td>
                          <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(index)}>
                              Delete
                            </button>
                            <button className="btn btn-success ms-1" onClick={() => handleEdit(index)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
