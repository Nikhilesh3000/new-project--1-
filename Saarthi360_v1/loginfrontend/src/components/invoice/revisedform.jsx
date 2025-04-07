"use client"

import { useState } from "react"
import "./revisedform.css"

const RevisedForm = ({ onClose, onSave }) => {
  const [paidOnDate, setPaidOnDate] = useState("")
  const [soaNo, setSoaNo] = useState("")
  const [debitCorrectionFile, setDebitCorrectionFile] = useState(null)
  const [revisionDetails, setRevisionDetails] = useState("")

  const handleFileChange = (e) => {
    setDebitCorrectionFile(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      paidOnDate,
      soaNo,
      debitCorrectionFile,
      revisionDetails,
    })
  }

  return (
    <div className="revised-form-overlay" onClick={onClose}>
      <div className="revised-form" onClick={(e) => e.stopPropagation()}>
        <div className="revised-form-header">
          <h2>Revised Details</h2>
          <button className="revised-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="revised-form-row">
            <div className="revised-form-group">
              <label htmlFor="paidOnDate">Paid On Date</label>
              <div className="revised-date-input-container">
                <input
                  type="date"
                  id="paidOnDate"
                  value={paidOnDate}
                  onChange={(e) => setPaidOnDate(e.target.value)}
                  required
                  className="revised-date-input"
                />
              </div>
            </div>

            <div className="revised-form-group">
              <label htmlFor="soaNo">SOA No.</label>
              <input
                type="text"
                id="soaNo"
                value={soaNo}
                onChange={(e) => setSoaNo(e.target.value)}
                required
                className="revised-input"
              />
            </div>
          </div>

          <div className="revised-form-row">
            <div className="revised-form-group">
              <label htmlFor="debitCorrectionFile">Add Debit Correction</label>
              <input
                type="file"
                id="debitCorrectionFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="revised-file-input"
              />
            </div>
          </div>

          <div className="revised-form-row">
            <div className="revised-form-group">
              <label htmlFor="revisionDetails">Revision Details</label>
              <textarea
                id="revisionDetails"
                value={revisionDetails}
                onChange={(e) => setRevisionDetails(e.target.value)}
                className="revised-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="revised-form-actions">
            <button type="submit" className="revised-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RevisedForm

