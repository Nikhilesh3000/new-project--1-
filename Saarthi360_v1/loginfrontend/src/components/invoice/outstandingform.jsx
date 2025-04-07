"use client"

import { useState } from "react"
import "./outstandingform.css"

const OutstandingForm = ({ onClose, onSave }) => {
  const [billDate, setBillDate] = useState("")
  const [billNumber, setBillNumber] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      billDate,
      billNumber,
    })
  }

  return (
    <div className="outstanding-form-overlay" onClick={onClose}>
      <div className="outstanding-form" onClick={(e) => e.stopPropagation()}>
        <div className="outstanding-form-header">
          <h2>Outstanding Details</h2>
          <button className="outstanding-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="outstanding-form-row">
            <div className="outstanding-form-group">
              <label htmlFor="billDate">Bill Date</label>
              <div className="outstanding-date-input-container">
                <input
                  type="date"
                  id="billDate"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  required
                  className="outstanding-date-input"
                />
              </div>
            </div>

            <div className="outstanding-form-group">
              <label htmlFor="billNumber">Bill Number</label>
              <input
                type="text"
                id="billNumber"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                required
                className="outstanding-input"
              />
            </div>
          </div>

          <p className="outstanding-form-note">Note: Details will be saved in invoice sheet</p>

          <div className="outstanding-form-actions">
            <button type="submit" className="outstanding-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OutstandingForm

