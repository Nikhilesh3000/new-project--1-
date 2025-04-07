// "use client"

// import { useState, useEffect } from "react"
// import "./jobInvoiceForm.css"

// const JobInvoiceForm = ({ onClose, onSave, initialData }) => {
//   const [formData, setFormData] = useState({
//     kindlyShareName: "",
//     contactPerson: "",
//     nameOfTeamLeader: "",
//     doYouHaveGstNo: "",
//     gstNo: "",
//     detailsOfJobPortal: "",
//     noOfLoginForNaukri: "",
//     noOfJobSlotForLinkedin: "",
//     amountPaidWithoutGst: "",
//     gstAmount: "",
//     totalAmountPaid: "",
//     dateOfPayment: "",
//     paymentScreenshot: null,
//     billDate: "",
//     billNo: "",
//   })

//   // Initialize form with initial data if editing
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         ...initialData,
//         paymentScreenshot: null, // Reset file input
//       })
//     }
//   }, [initialData])

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target

//     if (type === "file") {
//       setFormData({
//         ...formData,
//         [name]: files[0],
//       })
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       })
//     }
//   }

//   // Calculate total amount when amount or GST changes
//   useEffect(() => {
//     if (formData.amountPaidWithoutGst && formData.gstAmount) {
//       const amount = Number.parseFloat(formData.amountPaidWithoutGst) || 0
//       const gst = Number.parseFloat(formData.gstAmount) || 0
//       setFormData({
//         ...formData,
//         totalAmountPaid: (amount + gst).toString(),
//       })
//     }
//   }, [formData.amountPaidWithoutGst, formData.gstAmount, formData])

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <div className="job-invoice-form-overlay" onClick={onClose}>
//       <div className="job-invoice-form" onClick={(e) => e.stopPropagation()}>
//         <div className="job-invoice-form-header">
//           <h2>Job Invoice Sheet</h2>
//           <button className="job-invoice-close-btn" onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="kindlyShareName">Kindly Share Name (As Per Agreement)</label>
//               <input
//                 type="text"
//                 id="kindlyShareName"
//                 name="kindlyShareName"
//                 value={formData.kindlyShareName}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="contactPerson">Contact Person</label>
//               <input
//                 type="text"
//                 id="contactPerson"
//                 name="contactPerson"
//                 value={formData.contactPerson}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="nameOfTeamLeader">Name of Team Leader</label>
//               <input
//                 type="text"
//                 id="nameOfTeamLeader"
//                 name="nameOfTeamLeader"
//                 value={formData.nameOfTeamLeader}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="doYouHaveGstNo">Do You Have GST No</label>
//               <select
//                 id="doYouHaveGstNo"
//                 name="doYouHaveGstNo"
//                 value={formData.doYouHaveGstNo}
//                 onChange={handleChange}
//                 className="job-invoice-select"
//               >
//                 <option value="">Select</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="gstNo">Please Mention Your GST No If Any</label>
//               <input
//                 type="text"
//                 id="gstNo"
//                 name="gstNo"
//                 value={formData.gstNo}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="detailsOfJobPortal">Details Of Job Portal Taken (As Per Planning Sheet)</label>
//               <input
//                 type="text"
//                 id="detailsOfJobPortal"
//                 name="detailsOfJobPortal"
//                 value={formData.detailsOfJobPortal}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="noOfLoginForNaukri">No Of Login For Naukri</label>
//               <input
//                 type="text"
//                 id="noOfLoginForNaukri"
//                 name="noOfLoginForNaukri"
//                 value={formData.noOfLoginForNaukri}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="noOfJobSlotForLinkedin">No Of Job Slot For LinkedIn</label>
//               <input
//                 type="text"
//                 id="noOfJobSlotForLinkedin"
//                 name="noOfJobSlotForLinkedin"
//                 value={formData.noOfJobSlotForLinkedin}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="amountPaidWithoutGst">Amount Paid - Without GST</label>
//               <input
//                 type="number"
//                 id="amountPaidWithoutGst"
//                 name="amountPaidWithoutGst"
//                 value={formData.amountPaidWithoutGst}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="gstAmount">GST Amount</label>
//               <input
//                 type="number"
//                 id="gstAmount"
//                 name="gstAmount"
//                 value={formData.gstAmount}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="totalAmountPaid">Total Amount Paid</label>
//               <input
//                 type="number"
//                 id="totalAmountPaid"
//                 name="totalAmountPaid"
//                 value={formData.totalAmountPaid}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//                 readOnly
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="dateOfPayment">Date Of Payment</label>
//               <input
//                 type="date"
//                 id="dateOfPayment"
//                 name="dateOfPayment"
//                 value={formData.dateOfPayment}
//                 onChange={handleChange}
//                 className="job-invoice-date-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-row">
//             <div className="job-invoice-form-group">
//               <label htmlFor="paymentScreenshot">Payment Screenshot</label>
//               <input
//                 type="file"
//                 id="paymentScreenshot"
//                 name="paymentScreenshot"
//                 onChange={handleChange}
//                 className="job-invoice-file-input"
//               />
//               <div className="job-invoice-file-info">No File Chosen (Max 5 MB)</div>
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="billDate">Bill Date</label>
//               <input
//                 type="date"
//                 id="billDate"
//                 name="billDate"
//                 value={formData.billDate}
//                 onChange={handleChange}
//                 className="job-invoice-date-input"
//               />
//             </div>

//             <div className="job-invoice-form-group">
//               <label htmlFor="billNo">Bill No.</label>
//               <input
//                 type="text"
//                 id="billNo"
//                 name="billNo"
//                 value={formData.billNo}
//                 onChange={handleChange}
//                 className="job-invoice-input"
//               />
//             </div>
//           </div>

//           <div className="job-invoice-form-actions">
//             <button type="submit" className="job-invoice-save-btn">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default JobInvoiceForm



"use client"

import { useState, useEffect } from "react"
// import fetch from "fetch"
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
      const submitData = new FormData()
  
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key])
        }
      })
  
      let response
  
      if (initialData?.id) {
        // Update existing record
        response = await fetch(`http://localhost:8080/api/jobinvoice/${initialData.id}`, {
          method: "PUT",
          body: submitData,
        })
      } else {
        // Create new record
        response = await fetch("http://localhost:8080/api/jobinvoice", {
          method: "POST",
          body: submitData,
        })
      }
  
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData)
      }
  
      const responseData = await response.json()
      onSave(responseData)
    } catch (err) {
      console.error("Error saving job invoice data:", err)
      setError(err.message || "Failed to save job invoice data. Please try again.")
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

