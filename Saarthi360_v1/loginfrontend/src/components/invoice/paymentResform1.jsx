"use client"

import { useState } from "react"
import "./paymentResform1.css"

const PaymentResForm1 = ({ onClose, onSave }) => {
  const [dateReceived, setDateReceived] = useState("")
  const [amountReceived, setAmountReceived] = useState("")
  const [tdsBackend, setTdsBackend] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      dateReceived,
      amountReceived,
      tdsBackend,
    })
  }

  return (
    <div className="payment1-form-overlay" onClick={onClose}>
      <div className="payment1-form" onClick={(e) => e.stopPropagation()}>
        <div className="payment1-form-header">
          <h2>Payment Received Details</h2>
          <button className="payment1-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="payment1-form-row">
            <div className="payment1-form-group">
              <label htmlFor="dateReceived">Date of Received</label>
              <div className="payment1-date-input-container">
                <input
                  type="date"
                  id="dateReceived"
                  value={dateReceived}
                  onChange={(e) => setDateReceived(e.target.value)}
                  required
                  className="payment1-date-input"
                />
              </div>
            </div>

            <div className="payment1-form-group">
              <label htmlFor="amountReceived">Amount Received</label>
              <input
                type="number"
                id="amountReceived"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                required
                className="payment1-input"
              />
            </div>
          </div>

          <div className="payment1-form-row">
            <div className="payment1-form-group">
              <label htmlFor="tdsBackend">TDS (Backend)</label>
              <input
                type="number"
                id="tdsBackend"
                value={tdsBackend}
                onChange={(e) => setTdsBackend(e.target.value)}
                className="payment1-input"
              />
            </div>
          </div>

          <p className="payment1-form-note">Note: Details will be saved in invoice sheet</p>

          <div className="payment1-form-actions">
            <button type="submit" className="payment1-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentResForm1

