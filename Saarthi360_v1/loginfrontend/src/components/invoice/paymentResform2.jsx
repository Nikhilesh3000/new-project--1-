"use client"

import { useState } from "react"
import "./paymentResform2.css"

const PaymentResForm2 = ({ onClose, onSave }) => {
  const [gstPaidReceived, setGstPaidReceived] = useState("")
  const [ourShare, setOurShare] = useState("")
  const [monthOfBill, setMonthOfBill] = useState("")
  const [financialYear, setFinancialYear] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      gstPaidReceived,
      ourShare,
      monthOfBill,
      financialYear,
    })
  }

  return (
    <div className="payment2-form-overlay" onClick={onClose}>
      <div className="payment2-form" onClick={(e) => e.stopPropagation()}>
        <div className="payment2-form-header">
          <h2>Payment Received Details</h2>
          <button className="payment2-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="payment2-form-row">
            <div className="payment2-form-group">
              <label htmlFor="gstPaidReceived">GST Paid or Received</label>
              <select
                id="gstPaidReceived"
                value={gstPaidReceived}
                onChange={(e) => setGstPaidReceived(e.target.value)}
                required
                className="payment2-select"
              >
                <option value="">Select</option>
                <option value="paid">Paid</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div className="payment2-form-group">
              <label htmlFor="ourShare">Our Share</label>
              <input
                type="number"
                id="ourShare"
                value={ourShare}
                onChange={(e) => setOurShare(e.target.value)}
                required
                className="payment2-input"
              />
            </div>
          </div>

          <div className="payment2-form-row">
            <div className="payment2-form-group">
              <label htmlFor="monthOfBill">Month of Bill</label>
              <select
                id="monthOfBill"
                value={monthOfBill}
                onChange={(e) => setMonthOfBill(e.target.value)}
                required
                className="payment2-select"
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            <div className="payment2-form-group">
              <label htmlFor="financialYear">Financial Year</label>
              <select
                id="financialYear"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                required
                className="payment2-select"
              >
                <option value="">Select Year</option>
                <option value="2022-23">2022-23</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
          </div>

          <p className="payment2-form-note">Note: Details will be saved in invoice sheet</p>

          <div className="payment2-form-actions">
            <button type="submit" className="payment2-save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentResForm2

