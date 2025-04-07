"use client"

import { useState} from "react"
import "./candidateform2.css"

//  const App = () => {
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

const CreditNoteForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    billNo: "",
    serviceCharge: "",
    billdate: "",
    reasonForCreditNote: "",
  })


  

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
    <div className="credit-note-overlay">
      <div className="credit-note-container">
        <div className="credit-note-header">
          <h2>Credit Note Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="credit-note-row">
            <div className="credit-note-field">
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

            <div className="credit-note-field">
              <label>Bill Date</label>
              <input
                type="date"
                name="billdate"
                value={formData.billdate}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>

            <div className="credit-note-field">
              <label htmlFor="serviceCharge">Service Charge</label>
              <input
                type="number"
                id="serviceCharge"
                name="serviceCharge"
                value={formData.serviceCharge}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="credit-note-row">
            

            <div className="credit-note-field">
              <label htmlFor="reasonForCreditNote">Reason for Credit Note</label>
              <select
                id="reasonForCreditNote"
                name="reasonForCreditNote"
                value={formData.reasonForCreditNote}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="candidateleft">Candidate Left</option>
                
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="credit-note-note">
            <p>Note:Fill all the details</p>
          </div>

          <div className="credit-note-actions">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreditNoteForm

