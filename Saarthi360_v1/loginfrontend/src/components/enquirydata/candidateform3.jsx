"use client"

import { useState } from "react"
import "./candidateform3.css"

 const App = () => {
    const getForm = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/form");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }};
  
    // useEffect(() => {
    //   // getForm();
    // }, []);
const RevisionForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    billDate: "",
    billNo: "",
    revisionDetails: "",
  })


  // const App = () => {
  //     const getForm = async () => {
  //       try {
  //         const res = await fetch("http://localhost:8080/api/form");
  //         const data = await res.json();
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error:", error);
  //       }
  //     }};
    
  //     useEffect(() => {
  //       // getForm();
  //     }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="revision-form-overlay">
      <div className="revision-form-container">
        <div className="revision-form-header">
          <h2>Candidate Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="revision-form-field">
            <label htmlFor="candidateName">Candidate Name</label>
            <input
              type="text"
              id="candidateName"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="revision-form-row">
            <div className="revision-form-field">
              <label htmlFor="billDate">Bill Date</label>
              <input
                type="date"
                id="billDate"
                name="billDate"
                value={formData.billDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="revision-form-field">
              <label htmlFor="billNo">Bill No.</label>
              <input
                type="text"
                id="billNo"
                name="billNo"
                value={formData.billNo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="revision-form-field">
            <label htmlFor="revisionDetails">Details for revision</label>
            <select
              id="revisionDetails"
              name="revisionDetails"
              value={formData.revisionDetails}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Change In CTC And Bill Amount">Change In CTC And Bill Amount</option>
              <option value="Change In Name of company">Change In Name of company</option>
              <option value="Change In date of bill">Department Change</option>
              <option value="location_change">Change In Address</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="revision-form-note">
            <p>Note: Fill all the details</p>
          </div>

          <div className="revision-form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RevisionForm

