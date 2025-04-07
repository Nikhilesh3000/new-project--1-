import React, { useState, useEffect } from "react";
import CandidateForm from "./candidateform";
import CreditNoteForm from "./candidateform2";
import RevisionForm from "./candidateform3";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./enquiry.css";
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8080/api';

const Enquiry = () => {
  // State for enquiry data table
  const [enquiryData, setEnquiryData] = useState([]);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showCreditNoteForm, setShowCreditNoteForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    bdMemberName: "",
    teamLeaderName: "",
    franchiseeName: "",
    hrExecutiveName: "",
    designation: "",
    gstNo: "",
    addressLine1: "",
    emailId: "",
    mobileNo: "",
    website: "",
    placementFees: "",
    positionname: "",
    salary: "",
    creditPeriod: "",
    replacementPeriod: "",
    enquiryStatus: "",
    dateOfAllocation: "",
    dateOfReallocation: "",
    newTeamLeader: "",
    nameOfFranchisee: "",
  });

  // Fetch existing enquiries from the backend
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/Enquiries")
        console.log("API Response:", response.data) // Debugging

        // Check if the response has a data property (nested structure)
        const enquiriesData = response.data.data || response.data

        if (!Array.isArray(enquiriesData)) {
          console.error("Unexpected data format:", enquiriesData)
          throw new Error("Unexpected API response format")
        }

        const formattedData = enquiriesData.map((item) => ({
          ...item,
          dateOfAllocation: item.dateOfAllocation ? new Date(item.dateOfAllocation) : null,
          dateOfReallocation: item.dateOfReallocation ? new Date(item.dateOfReallocation) : null,
        }))

        setEnquiryData(formattedData)
      } catch (error) {
        console.error("Error fetching enquiries:", error)
        alert(`Failed to load enquiries: ${error.message}`)
      }
    }
    fetchEnquiries()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Show candidate form when enquiry status is closed
    if (name === "enquiryStatus" && value === "Closed") {
      setShowCandidateForm(true);
    }

    // Show credit note form when enquiry status is credit note
    if (name === "enquiryStatus" && value === "Credit Note") {
      setShowCreditNoteForm(true);
    }

    // Show revision form when enquiry status is revised
    if (name === "enquiryStatus" && value === "Revised") {
      setShowRevisionForm(true);
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting form data:", formData)

    try {
      if (currentEnquiry?.id) {
        // Update existing enquiry
        const response = await axios.put(`http://localhost:8080/api/Enquiries/${currentEnquiry.id}`, formData)
        console.log("Update response:", response.data)

        // Update the enquiry in the state
        setEnquiryData((prevData) => prevData.map((item) => (item.id === currentEnquiry.id ? response.data : item)))

        alert("Enquiry updated successfully!")
      } else {
        // Add new enquiry
        const response = await axios.post("http://localhost:8080/api/Enquiries", formData)
        console.log("Create response:", response.data)

        // Add the new enquiry to the state
        setEnquiryData((prevData) => [...prevData, response.data])

        alert("Enquiry created successfully!")
      }

      resetForm()
    } catch (error) {
      console.error("Error submitting Enquiry:", error)

      // More detailed error message
      let errorMessage = "Submission failed: "
      if (error.response && error.response.data) {
        errorMessage += error.response.data.error || error.response.data.details || error.message
      } else {
        errorMessage += error.message
      }

      alert(errorMessage)
    }
  }

  // Reset form and close it
  const resetForm = () => {
    setFormData({
      companyName: "",
      bdMemberName: "",
      teamLeaderName: "",
      franchiseeName: "",
      hrExecutiveName: "",
      designation: "",
      gstNo: "",
      addressLine1: "",
      emailId: "",
      mobileNo: "",
      website: "",
      placementFees: "",
      positionname: "",
      salary: "",
      creditPeriod: "",
      replacementPeriod: "",
      enquiryStatus: "",
      dateOfAllocation: "",
      dateOfReallocation: "",
      newTeamLeader: "",
      nameOfFranchisee: "",
    });
    setCurrentEnquiry(null);
    setShowEnquiryForm(false);
    setShowCandidateForm(false);
    setShowCreditNoteForm(false);
    setShowRevisionForm(false);
  };

  // Handle edit enquiry
  const handleEdit = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setFormData({
      ...enquiry,
      dateOfAllocation: enquiry.dateOfAllocation ? enquiry.dateOfAllocation.split('T')[0] : "",
      dateOfReallocation: enquiry.dateOfReallocation ? enquiry.dateOfReallocation.split('T')[0] : ""
    });
    setShowEnquiryForm(true);
  };

  // Handle delete enquiry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await axios.delete(`/Enquiries/${id}`);
        setEnquiryData(enquiryData.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        alert('Failed to delete enquiry. Please try again.');
      }
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter and sort data
  const filteredData = enquiryData.filter((item) => {
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = Object.keys(enquiryData[0] || {}).join(",");
    const csvData = enquiryData.map((row) => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(",")
    ).join("\n");
    const csv = `${headers}\n${csvData}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "enquiry_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle candidate form submission
  const handleCandidateSubmit = async (candidateData) => {
    try {
      await axios.post('/CandidateForm', {
        ...candidateData,
        enquiry_id: currentEnquiry.id
      });
      setShowCandidateForm(false);
      alert('Candidate form submitted successfully!');
    } catch (error) {
      console.error('Error submitting candidate form:', error);
      alert('Failed to submit candidate form. Please try again.');
    }
  };

  // Handle credit note form submission
  const handleCreditNoteSubmit = async (creditNoteData) => {
    try {
      await axios.post('/CandidateForm2', {
        ...creditNoteData,
        enquiry_id: currentEnquiry.id
      });
      setShowCreditNoteForm(false);
      alert('Credit note form submitted successfully!');
    } catch (error) {
      console.error('Error submitting credit note form:', error);
      alert('Failed to submit credit note form. Please try again.');
    }
  };

  // Handle revision form submission
  const handleRevisionSubmit = async (revisionData) => {
    try {
      await axios.post('/CandidateForm3', {
        ...revisionData,
        enquiry_id: currentEnquiry.id
      });
      setShowRevisionForm(false);
      alert('Revision form submitted successfully!');
    } catch (error) {
      console.error('Error submitting revision form:', error);
      alert('Failed to submit revision form. Please try again.');
    }
  };


  return (
    <div className="enquiry-container">
      {!showEnquiryForm ? (
        // Enquiry Data Table View
        <div className="enquiry-table-container">
          <div className="enquiry-header">
            <h1>Enquiry Data</h1>
            <p>All the enquiry Data are listed here</p>
            <div className="enquiry-actions">
              <div className="search-sort-wrap">
                <div className="enquiry-search-container">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="enquiry-search-input"
                  />
                  <span className="enquiry-search-icon">🔍</span>
                </div>
                <div className="enquiry-sort-container">
                  <select
                    className="enquiry-sort-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setSortOrder("asc");
                    }}
                  >
                    <option value="">Sort by</option>
                    <option value="companyName">Company Name</option>
                    <option value="bdMemberName">BD Member</option>
                    <option value="enquiryStatus">Enquiry Status</option>
                    <option value="franchiseeName">Franchise</option>
                    <option value="teamLeaderName">Team Leader</option>
                  </select>
                </div>
              </div>
              <button 
                className="enquiry-add-button" 
                onClick={() => {
                  setCurrentEnquiry(null);
                  setShowEnquiryForm(true);
                }}
              >
                + Add Enquiry Data
              </button>
            </div>
          </div>
          <div className="wrapper-enq-table">
            <div className="enquiry-table-container">
              <div className="enquiry-table-header">
                <h2>Enquiry Data</h2>
                <button className="enquiry-download-button" onClick={exportToCSV}>
                  <span className="enquiry-download-icon">↓</span>
                </button>
              </div>
              <div className="enquiry-table-scroll" style={{ overflowX: "auto" }}>
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("companyName")}>COMPANY NAME</th>
                      <th onClick={() => handleSort("bdMemberName")}>NAME OF BD MEMBER</th>
                      <th onClick={() => handleSort("teamLeaderName")}>NAME OF TEAM LEADER</th>
                      <th onClick={() => handleSort("franchiseeName")}>NAME OF FRANCHISE</th>
                      <th onClick={() => handleSort("hrExecutiveName")}>NAME OF HR EXECUTIVE</th>
                      <th onClick={() => handleSort("designation")}>DESIGNATION</th>
                      <th onClick={() => handleSort("gstNo")}>GST NO.</th>
                      <th onClick={() => handleSort("addressLine1")}>ADDRESS</th>
                      <th onClick={() => handleSort("emailId")}>EMAIL ID</th>
                      <th onClick={() => handleSort("mobileNo")}>MOBILE NO.</th>
                      <th onClick={() => handleSort("website")}>WEBSITE</th>
                      <th onClick={() => handleSort("placementFees")}>PLACEMENT FEES</th>
                      <th onClick={() => handleSort("positionname")}>POSITION NAME</th>
                      <th onClick={() => handleSort("salary")}>SALARY</th>
                      <th onClick={() => handleSort("creditPeriod")}>CREDIT PERIOD</th>
                      <th onClick={() => handleSort("replacementPeriod")}>REPLACEMENT PERIOD</th>
                      <th onClick={() => handleSort("enquiryStatus")}>ENQUIRY STATUS</th>
                      <th onClick={() => handleSort("dateOfAllocation")}>DATE OF ALLOCATION</th>
                      <th onClick={() => handleSort("dateOfReallocation")}>DATE OF REALLOCATION</th>
                      <th onClick={() => handleSort("newTeamLeader")}>NEW TEAM LEADER</th>
                      <th onClick={() => handleSort("nameOfFranchisee")}>NAME OF FRANCHISEE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.companyName}</td>
                        <td>{item.bdMemberName}</td>
                        <td>{item.teamLeaderName}</td>
                        <td>{item.franchiseeName}</td>
                        <td>{item.hrExecutiveName}</td>
                        <td>{item.designation}</td>
                        <td>{item.gstNo}</td>
                        <td>{item.addressLine1}</td>
                        <td>{item.emailId}</td>
                        <td>{item.mobileNo}</td>
                        <td>{item.website}</td>
                        <td>{item.placementFees}</td>
                        <td>{item.positionname}</td>
                        <td>{item.salary}</td>
                        <td>{item.creditPeriod}</td>
                        <td>{item.replacementPeriod}</td>
                        <td>{item.enquiryStatus}</td>
                        <td>{item.dateOfAllocation ? new Date(item.dateOfAllocation).toLocaleDateString() : ''}</td>
                        <td>{item.dateOfReallocation ? new Date(item.dateOfReallocation).toLocaleDateString() : ''}</td>
                        <td>{item.newTeamLeader}</td>
                        <td>{item.nameOfFranchisee}</td>
                        <td className="enquiry-action-buttons">
                          <button className="enquiry-edit-button" onClick={() => handleEdit(item)}>
                            <span className="enquiry-edit-icon">✏️</span>
                          </button>
                          <button className="enquiry-delete-button" onClick={() => handleDelete(item.id)}>
                            <span className="enquiry-delete-icon">🗑️</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="add-enquiry-button" onClick={() => {
              setCurrentEnquiry(null);
              setShowEnquiryForm(true);
            }}>
              <span className="enquiry-plus-icon">+</span> Click here to add Enquiry Data
            </div>
          </div>
        </div>
      ) : (
        // Enquiry Form View
        <div className="enquiry-form-container">
          <div className="enquiry-form-header">
            <button className="enquiry-back-button" onClick={resetForm}>
              ← Enquiry Data
            </button>
            <h2>{currentEnquiry ? "Edit Enquiry" : "Add New Enquiry"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="enquiry-form-section">
              <h3>A. Company & Contact Details</h3>

              <div className="enquiry-form-field">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Name of BD Members</label>
                  <select 
                    name="bdMemberName" 
                    value={formData.bdMemberName} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Member 1">Member 1</option>
                    <option value="Member 2">Member 2</option>
                  </select>
                </div>

                <div className="enquiry-form-field">
                  <label>Name of Team Leader</label>
                  <select 
                    name="teamLeaderName" 
                    value={formData.teamLeaderName} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Leader 1">Leader 1</option>
                    <option value="Leader 2">Leader 2</option>
                  </select>
                </div>

                <div className="enquiry-form-field">
                  <label>Name of Franchisee</label>
                  <select 
                    name="franchiseeName" 
                    value={formData.franchiseeName} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Franchise 1">Franchise 1</option>
                    <option value="Franchise 2">Franchise 2</option>
                  </select>
                </div>
              </div>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Name of HR Executive</label>
                  <input
                    type="text"
                    name="hrExecutiveName"
                    value={formData.hrExecutiveName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Designation</label>
                  <input 
                    type="text" 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>GST No.</label>
                  <input 
                    type="text" 
                    name="gstNo" 
                    value={formData.gstNo} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="enquiry-form-field">
                <label>Address Line 1</label>
                <input 
                  type="text" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Email ID *</label>
                  <input 
                    type="email" 
                    name="emailId" 
                    value={formData.emailId} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Mobile Number *</label>
                  <PhoneInput
                    country={'in'}
                    value={formData.mobileNo}
                    onChange={(value, country, e, formattedValue) => {
                      setFormData({
                        ...formData,
                        mobileNo: value
                      });
                    }}
                    inputProps={{
                      name: 'mobileNo',
                      required: true
                    }}
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Website</label>
                  <input 
                    type="url" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            <div className="enquiry-form-section">
              <h3>B. HR Executive Details</h3>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Placement Fees</label>
                  <select 
                    name="placementFees" 
                    value={formData.placementFees} 
                    onChange={handleInputChange}
                  >
                    <option>Select</option>
                    <option>7</option>
                    <option>7.5</option>
                    <option>8</option>
                    <option>8.33</option>
                    <option>9</option>
                    <option>10</option>
                    <option>12.50</option>
                    <option>13</option>
                    <option>16</option>
                    <option>18</option>
                  </select>
                </div>

                <div className="enquiry-form-field">
                  <label>Credit Period</label>
                  <select 
                    name="creditPeriod" 
                    value={formData.creditPeriod} 
                    onChange={handleInputChange}
                  >
                    <option>Select</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>90</option>
                  </select>
                </div>

                <div className="enquiry-form-field">
                  <label>Replacement Period</label>
                  <select 
                    name="replacementPeriod" 
                    value={formData.replacementPeriod} 
                    onChange={handleInputChange}
                  >
                    <option>Select</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>90</option>
                  </select>
                </div>
              </div>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Position Name</label>
                  <input 
                    type="text" 
                    name="positionname" 
                    value={formData.positionname} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Date of Allocation</label>
                  <input
                    type="date"
                    name="dateOfAllocation"
                    value={formData.dateOfAllocation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Salary Range</label>
                  <select 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Salary Range</option>
                    <option value="1-3">1-3L</option>
                    <option value="4-6">4-6L</option>
                    <option value="7-10">7-10L</option>
                    <option value="11-15">11-15L</option>
                    <option value="16+">16L+</option>
                  </select>
                </div>
              </div>

              <div className="enquiry-form-field">
                <label>Enquiry Status *</label>
                <select 
                  name="enquiryStatus" 
                  value={formData.enquiryStatus} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="inprogress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Credit Note">Credit Note</option>
                  <option value="offered and accepted">Offered and Accepted</option>
                  <option value="offered and rejected">Offered and Rejected</option>
                  <option value="Revised">Revised</option>
                  <option value="position hold">Position hold</option>
                  <option value="internally closed">Internally closed</option>
                </select>
              </div>
            </div>

            <div className="enquiry-form-section">
              <h3>C. Billing & Relocation</h3>

              <div className="enquiry-form-row">
                <div className="enquiry-form-field">
                  <label>Date of Reallocation</label>
                  <input
                    type="date"
                    name="dateOfReallocation"
                    value={formData.dateOfReallocation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Name of New Team Leader</label>
                  <input 
                    type="text" 
                    name="newTeamLeader" 
                    value={formData.newTeamLeader} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="enquiry-form-field">
                  <label>Name of Franchisee</label>
                  <input
                    type="text"
                    name="nameOfFranchisee"
                    value={formData.nameOfFranchisee}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="enquiry-form-actions">
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {currentEnquiry ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

{showCandidateForm && (
        <CandidateForm 
          onClose={() => setShowCandidateForm(false)} 
          onSubmit={handleCandidateSubmit} 
        />
      )}
      {showCreditNoteForm && (
        <CreditNoteForm
          onClose={() => setShowCreditNoteForm(false)}
          onSubmit={handleCreditNoteSubmit}
        />
      )}
      {showRevisionForm && (
        <RevisionForm
          onClose={() => setShowRevisionForm(false)}
          onSubmit={handleRevisionSubmit}
        />
      )}
    </div>
  );
};

export default Enquiry;