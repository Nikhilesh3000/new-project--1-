"use client"

import { useState } from "react"
import "./creditnoteform.css"

const CreditNoteForm = ({ onClose, onSave }) => {
  const [creditDate, setCreditDate] = useState("")
  const [creditNoteNo, setCreditNoteNo] = useState("")
  const [reasonForCreditNote, setReasonForCreditNote] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      creditDate,
      creditNoteNo,
      reasonForCreditNote,
    })
  }

  return (
    <div className="creditnote-form-overlay" onClick={onClose}>
      <div className="creditnote-form" onClick={(e) => e.stopPropagation()}>
        <div className="creditnote-form-header">
          <h2>Credit Note Details</h2>
          <button className="creditnote-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="creditnote-form-row">
            <div className="creditnote-form-group">
              <label htmlFor="creditDate">Credit/ Cancel Date</label>
              <div className="creditnote-date-input-container">
                <input
                  type="date"
                  id="creditDate"
                  value={creditDate}
                  onChange={(e) => setCreditDate(e.target.value)}
                  required
                  className="creditnote-date-input"
                />
              </div>
            </div>

            <div className="creditnote-form-group">
              <label htmlFor="creditNoteNo">Credit Note No.</label>
              <input
                type="text"
                id="creditNoteNo"
                value={creditNoteNo}
                onChange={(e) => setCreditNoteNo(e.target.value)}
                required
                className="creditnote-input"
              />
            </div>
          </div>

          <div className="creditnote-form-row">
            <div className="creditnote-form-group">
              <label htmlFor="reasonForCreditNote">Reason For Credit Note</label>
              <input
                type="text"
                id="reasonForCreditNote"
                value={reasonForCreditNote}
                onChange={(e) => setReasonForCreditNote(e.target.value)}
                className="creditnote-input"
              />
            </div>
          </div>

          <p className="creditnote-form-note">Note: Details will be saved in invoice sheet</p>

          <div className="creditnote-form-actions">
            <button type="submit" className="creditnote-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreditNoteForm

