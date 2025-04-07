
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./jobInvoiceForm.css"

const JobInvoiceForm = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    kindlyShareName: "",
    contactPerson: "",
    nameOfTeamLeader: "",
    doYouHaveGstNo: "",
    gstNo: "",
    detailsOfJobPortal: "",
    noOfLoginForNaukri: "",
    noOfJobSlotForLinkedin: "",
    amountPaidWithoutGst: "",
    gstAmount: "",
    totalAmountPaid: "",
    dateOfPayment: "",
    paymentScreenshot: null,
    billDate: "",
    billNo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [filePreview, setFilePreview] = useState(null)

  // ✅ Input and file handling
  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file") {
      const file = files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("File size exceeds 5MB limit")
          return
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: file,
        }))

        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }))
    }
  }

  // Calculate total amount when amount or GST changes
  useEffect(() => {
    if (formData.amountPaidWithoutGst || formData.gstAmount) {
      const amount = Number.parseFloat(formData.amountPaidWithoutGst) || 0
      const gst = Number.parseFloat(formData.gstAmount) || 0
      setFormData((prevData) => ({
        ...prevData,
        totalAmountPaid: (amount + gst).toString(),
      }))
    }
  }, [formData.amountPaidWithoutGst, formData.gstAmount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Create a FormData object to handle file uploads
      const submitData = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "paymentScreenshot" && formData[key]) {
          submitData.append(key, formData[key])
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key])
        }
      })

      let response

      if (initialData?.id) {
        // Update existing record
        response = await axios.put(`http://localhost:8080/api/JobInvoice/${initialData.id}`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      } else {
        // Create new record
        response = await axios.post("http://localhost:5000/api/JobInvoice", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      // Call the parent component's onSave function with the response data
      onSave(response.data)
    } catch (err) {
      console.error("Error saving job invoice data:", err)
      setError(err.response?.data?.error || "Failed to save job invoice data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="job-invoice-form-overlay" onClick={onClose}>
      <div className="job-invoice-form" onClick={(e) => e.stopPropagation()}>
        <div className="job-invoice-form-header">
          <h2>Job Invoice Sheet</h2>
          <button className="job-invoice-close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="job-invoice-error-message">{error}</div>}

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="kindlyShareName">Kindly Share Name (As Per Agreement)</label>
              <input
                type="text"
                id="kindlyShareName"
                name="kindlyShareName"
                value={formData.kindlyShareName}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="nameOfTeamLeader">Name of Team Leader</label>
              <input
                type="text"
                id="nameOfTeamLeader"
                name="nameOfTeamLeader"
                value={formData.nameOfTeamLeader}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="doYouHaveGstNo">Do You Have GST No</label>
              <select
                id="doYouHaveGstNo"
                name="doYouHaveGstNo"
                value={formData.doYouHaveGstNo}
                onChange={handleChange}
                className="job-invoice-select"
                disabled={isSubmitting}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="gstNo">Please Mention Your GST No If Any</label>
              <input
                type="text"
                id="gstNo"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting || formData.doYouHaveGstNo !== "Yes"}
              />
            </div>
          </div>

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="detailsOfJobPortal">Details Of Job Portal Taken (As Per Planning Sheet)</label>
              <input
                type="text"
                id="detailsOfJobPortal"
                name="detailsOfJobPortal"
                value={formData.detailsOfJobPortal}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="noOfLoginForNaukri">No Of Login For Naukri</label>
              <input
                type="number"
                id="noOfLoginForNaukri"
                name="noOfLoginForNaukri"
                value={formData.noOfLoginForNaukri}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="noOfJobSlotForLinkedin">No Of Job Slot For LinkedIn</label>
              <input
                type="number"
                id="noOfJobSlotForLinkedin"
                name="noOfJobSlotForLinkedin"
                value={formData.noOfJobSlotForLinkedin}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="amountPaidWithoutGst">Amount Paid - Without GST</label>
              <input
                type="number"
                id="amountPaidWithoutGst"
                name="amountPaidWithoutGst"
                value={formData.amountPaidWithoutGst}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="gstAmount">GST Amount</label>
              <input
                type="number"
                id="gstAmount"
                name="gstAmount"
                value={formData.gstAmount}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="totalAmountPaid">Total Amount Paid</label>
              <input
                type="number"
                id="totalAmountPaid"
                name="totalAmountPaid"
                value={formData.totalAmountPaid}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={true}
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="dateOfPayment">Date Of Payment</label>
              <input
                type="date"
                id="dateOfPayment"
                name="dateOfPayment"
                value={formData.dateOfPayment}
                onChange={handleChange}
                className="job-invoice-date-input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="job-invoice-form-row">
            <div className="job-invoice-form-group">
              <label htmlFor="paymentScreenshot">Payment Screenshot</label>
              <input
                type="file"
                id="paymentScreenshot"
                name="paymentScreenshot"
                onChange={handleChange}
                className="job-invoice-file-input"
                disabled={isSubmitting}
                accept="image/*,.pdf"
              />
              <div className="job-invoice-file-info">
                {formData.paymentScreenshot ? formData.paymentScreenshot.name : "No File Chosen"} (Max 5 MB)
              </div>
              {filePreview && (
                <div className="job-invoice-file-preview">
                  <img
                    src={filePreview || "/placeholder.svg"}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                </div>
              )}
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="billDate">Bill Date</label>
              <input
                type="date"
                id="billDate"
                name="billDate"
                value={formData.billDate}
                onChange={handleChange}
                className="job-invoice-date-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="job-invoice-form-group">
              <label htmlFor="billNo">Bill No.</label>
              <input
                type="text"
                id="billNo"
                name="billNo"
                value={formData.billNo}
                onChange={handleChange}
                className="job-invoice-input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="job-invoice-form-actions">
            <button type="submit" className="job-invoice-save-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobInvoiceForm
