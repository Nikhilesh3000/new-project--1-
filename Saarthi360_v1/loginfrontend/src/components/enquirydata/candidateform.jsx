"use client"

import { useState } from "react"
import "./candidateform.css"

const CandidateForm = ({ onClose, onSubmit }) => {
  const [candidateData, setCandidateData] = useState({
    candidateName: "",
    mobileNumber: "",
    emailId: "",
    dateOfBirth: "",
    sourceOfCV: "",
    hireFor: "",
    salaryOffer: "",
    dateOfJoining: "",
    yearofexp:"",
  })
 
  // const App = () => {
  //    const getForm = async () => {
  //      try {
  //        const res = await fetch("http://localhost:8080/api/form");
  //        const data = await res.json();
  //        console.log(data);
  //      } catch (error) {
  //        console.error("Error:", error);
  //      }
  //    }};
   
  //    useEffect(() => {
  //      // getForm();
  //    }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCandidateData({
      ...candidateData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(candidateData)
  }

  return (
    <div className="candidate-form-overlay">
      <div className="candidate-form-container">
        <div className="candidate-form-header">
          <h2>Candidate Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="candidate-form-row">
            <div className="candidate-form-field">
              <label>Name of the Candidate</label>
              <input
                type="text"
                name="candidateName"
                value={candidateData.candidateName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="candidate-form-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={candidateData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="candidate-form-row">
            <div className="candidate-form-field">
              <label>Email-ID</label>
              <input type="email" name="emailId" value={candidateData.emailId} onChange={handleInputChange} required />
            </div>

            <div className="candidate-form-field">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={candidateData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
          </div>

          <div className="candidate-form-row">
            <div className="candidate-form-field">
              <label>Source of CV</label>
              <select name="sourceOfCV" value={candidateData.sourceOfCV} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Naukri - Job Posting">Naukri - Job Posting</option>
                <option value="Shine  - Job Posting">Shine  - Job Posting</option>
                <option value="Naukri - Resdex">Naukri - Resdex</option>
                <option value="Naukri - Mass Mail">Naukri - Mass Mail</option>
                <option value="Shine Data Base">Shine Data Base</option>
                <option value="Shine Mass Mail">Shine Mass Mail</option>
                <option value="RMS Data Base">RMS Data Base</option>
                <option value="LinkedIN - Paid Job Slot">LinkedIN - Paid Job Slot</option>
                <option value="LinkedIN - Own Network">LinkedIN - Own Network</option>
                <option value="Monster Job Posting">Monster Job Posting</option>
                <option value="Indeed Free Job Posting">Indeed Free Job Posting</option>
                <option value="Apna Job Posting - Self Paid Subcription">Apna Job Posting - Self Paid Subcription</option>
                <option value="Own Referance">Monster Job Posting</option>
                <option value="Other">Indeed Free Job Posting</option>
              </select>
            </div>

            <div className="candidate-form-field">
              <label>Hire For</label>
              <input type="text" name="hireFor" value={candidateData.hireFor} onChange={handleInputChange} required />
            </div>
          </div>

          
            <div className="candidate-form-field">
              <label>Year Of Experience</label>
              <select name="yearofexp" value={candidateData.yearofexp} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="0-3">0-3</option>
                <option value="4-7">4-7</option>
                <option value="8-12">8-12</option>
                <option value="13-16">13-16</option>
                <option value="16+">16+</option>
                
              </select>
            </div>

          <div className="candidate-form-row">
            <div className="candidate-form-field">
              <label>Salary Offer</label>
              <input
                type="text"
                name="salaryOffer"
                value={candidateData.salaryOffer}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="candidate-form-field">
              <label>Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={candidateData.dateOfJoining}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
          </div>

          <div className="candidate-form-note">
            <p>Note:Fill all the fields</p>
          </div>

          <div className="candidate-form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CandidateForm

