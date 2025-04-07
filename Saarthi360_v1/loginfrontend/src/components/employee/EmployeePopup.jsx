"use client"

import { Trash2, Download } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import PerformanceView from "./performance-view"
import jsPDF from "jspdf"
import EmployeeForm from "./EmployeeForm" // without the 'components' folder
import "./EmployeePopup.css"

// Assuming updateEmployee is an API call or function defined elsewhere
// You might need to adjust the import path based on your project structure
import { updateEmployee } from "./api" // Example import

const EmployeePopup = ({ employee = {}, onClose, onViewDetails, onEdit, onDelete }) => {
  // Ensure employee is an object even if it's undefined or null
  const employeeData = employee || {}
  const [showPerformance, setShowPerformance] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const downloadRef = useRef(null)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [formReadOnly, setFormReadOnly] = useState(true)

  const handlePerformanceClick = () => {
    setShowPerformance(true)
  }

  const handleBackToDetails = () => {
    setShowPerformance(false)
  }

  const handleDownloadClick = (e) => {
    e.stopPropagation() // Prevent event bubbling
    setShowDownloadOptions(!showDownloadOptions)
  }

  const handleDownloadFormat = (format, e) => {
    e.stopPropagation() // Prevent event bubbling
    e.preventDefault() // Prevent default behavior

    // Handle download based on format (CSV or PDF)
    console.log(`Downloading as ${format}...`, employeeData)

    if (format === "csv") {
      // Generate and download CSV with all employee details
      const csvRows = []

      // CSV Header
      csvRows.push(
        [
          "Name",
          "Email",
          "Phone",
          "Designation",
          "Department",
          "Joining Date",
          "Address",
          "City",
          "State",
          "Country",
          "Emergency Contact",
          "Aadhar Card No",
          "PAN Card",
          "UAN Number",
          "Basic Salary",
          "Branch Office",
          "Education",
          "Institute",
          "Bank Name",
          "Account Number",
        ].join(","),
      )

      // CSV Data
      csvRows.push(
        [
          employeeData.name || "",
          employeeData.email || "",
          employeeData.phone || "",
          employeeData.designation || "",
          employeeData.department || "",
          employeeData.joiningDate || "",
          employeeData.address || "",
          employeeData.city || "",
          employeeData.state || "",
          employeeData.country || "",
          employeeData.emergencyContactName || "",
          employeeData.aadharCardNo || "",
          employeeData.panCard || "",
          employeeData.uanNumber || "",
          employeeData.basicSalary || "",
          employeeData.branchOfficeName || "",
          employeeData.educationQualification || "",
          employeeData.nameOfInstitute || "",
          employeeData.bankName || "",
          employeeData.bankACNumber || "",
        ].join(","),
      )

      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${employeeData.name || "employee"}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else if (format === "pdf") {
      // Create a detailed PDF with employee data
      try {
        // Create a new PDF document
        const doc = new jsPDF()

        // Add content to the PDF
        doc.setFontSize(18)
        doc.text("Employee Details", 105, 20, { align: "center" })

        // Personal Information
        doc.setFontSize(14)
        doc.text("Personal Information", 20, 30)
        doc.setFontSize(10)
        doc.text(`Name: ${employeeData.name || ""}`, 20, 40)
        doc.text(`Email: ${employeeData.email || ""}`, 20, 45)
        doc.text(`Phone: ${employeeData.phone || ""}`, 20, 50)
        doc.text(`Date of Birth: ${employeeData.dateOfBirth || ""}`, 20, 55)
        doc.text(`Gender: ${employeeData.gender || ""}`, 20, 60)

        // Address
        doc.setFontSize(14)
        doc.text("Address", 20, 70)
        doc.setFontSize(10)
        doc.text(`${employeeData.address || ""}`, 20, 75)
        doc.text(`${employeeData.city || ""}, ${employeeData.state || ""}, ${employeeData.country || ""}`, 20, 80)
        doc.text(`Pin Code: ${employeeData.pinCode || ""}`, 20, 85)

        // Employment Details
        doc.setFontSize(14)
        doc.text("Employment Details", 20, 95)
        doc.setFontSize(10)
        doc.text(`Designation: ${employeeData.designation || ""}`, 20, 100)
        doc.text(`Department: ${employeeData.department || ""}`, 20, 105)
        doc.text(`Joining Date: ${employeeData.joiningDate || ""}`, 20, 110)
        doc.text(`Branch: ${employeeData.branchOfficeName || ""}`, 20, 115)

        // Identification
        doc.setFontSize(14)
        doc.text("Identification", 20, 125)
        doc.setFontSize(10)
        doc.text(`Aadhar Card: ${employeeData.aadharCardNo || ""}`, 20, 130)
        doc.text(`PAN Card: ${employeeData.panCard || ""}`, 20, 135)
        doc.text(`UAN Number: ${employeeData.uanNumber || ""}`, 20, 140)

        // Education
        doc.setFontSize(14)
        doc.text("Education", 20, 150)
        doc.setFontSize(10)
        doc.text(`Qualification: ${employeeData.educationQualification || ""}`, 20, 155)
        doc.text(`Institute: ${employeeData.nameOfInstitute || ""}`, 20, 160)
        doc.text(`Location: ${employeeData.locationOfInstitute || ""}`, 20, 165)

        // Salary Details
        doc.setFontSize(14)
        doc.text("Salary Details", 20, 175)
        doc.setFontSize(10)
        doc.text(`Basic Salary: ${employeeData.basicSalary || ""}`, 20, 180)
        doc.text(`Bank Name: ${employeeData.bankName || ""}`, 20, 185)
        doc.text(`Account Number: ${employeeData.bankACNumber || ""}`, 20, 190)

        // Emergency Contact
        doc.setFontSize(14)
        doc.text("Emergency Contact", 20, 200)
        doc.setFontSize(10)
        doc.text(`Name: ${employeeData.emergencyContactName || ""}`, 20, 205)
        doc.text(`Relation: ${employeeData.emergencyContactRelation || ""}`, 20, 210)
        doc.text(`Phone: ${employeeData.emergencyNumber || ""}`, 20, 215)

        // Save the PDF
        doc.save(`${employeeData.name || "employee"}.pdf`)
      } catch (error) {
        console.error("Error generating PDF:", error)
        alert("Could not generate PDF. Please try again.")
      }
    }

    setShowDownloadOptions(false)
  }

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle button clicks
  const handleViewDetailsClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Viewing details for employee:", employeeData)
    setFormReadOnly(true)
    setShowEmployeeForm(true)
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Editing employee:", employeeData)
    setFormReadOnly(false)
    setShowEmployeeForm(true)
    if (onEdit) onEdit()
  }

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) onDelete()
  }

  const handleCloseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClose) onClose()
  }

  const handleFormSave = async (data) => {
    try {
      if (employee?.id) {
        console.log("Updating employee with ID:", employee.id)
        console.log("Update data:", data)
        const updatedEmployee = await updateEmployee(employee.id, data)
        console.log("Update successful:", updatedEmployee)
        alert("Employee updated successfully!")
        onClose()
        // Refresh the employee list if needed
        window.location.reload()
      }
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update employee: " + error.message)
    }
  }

  const handleFormCancel = () => {
    setShowEmployeeForm(false)
  }

  if (showEmployeeForm) {
    return (
      <EmployeeForm
        employee={employeeData}
        readOnly={formReadOnly}
        isEdit={!formReadOnly}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    )
  }

  if (showPerformance) {
    return <PerformanceView onBack={handleBackToDetails} employee={employeeData} />
  }

  return (
    <div className="employeepopup-wrapper">
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <button className="back-button" onClick={handleCloseClick}>
            &lt; Back to Grid
          </button>
          <div className="header-actions">
            <button className="view-details-button" onClick={handleViewDetailsClick}>
              View Details
            </button>

            <div className="download-container" ref={downloadRef}>
              <button className="download-button" onClick={handleDownloadClick}>
                <Download size={18} />
              </button>

              {showDownloadOptions && (
                <div className="download-options">
                  <button className="download-option" onClick={(e) => handleDownloadFormat("csv", e)}>
                    CSV
                  </button>
                  <button className="download-option" onClick={(e) => handleDownloadFormat("pdf", e)}>
                    PDF
                  </button>
                </div>
              )}
            </div>

            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>

            <button className="delete-button" onClick={handleDeleteClick}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="popup-content">
          <div className="employee-header">
            <div className="employee-profile">
              <div className="employee-avatar-container">
                {employeeData.picture ? (
                  <img
                    src={employeeData.picture || "/placeholder.svg"}
                    alt={employeeData.name || "Employee"}
                    className="employee-avatar"
                  />
                ) : (
                  <div className="employee-avatar-placeholder">{(employeeData.name || "E").charAt(0)}</div>
                )}
              </div>

              <div className="employee-info">
                <h2 className="employee-name">{employeeData.name || "Robert Fox"}</h2>
                <p className="employee-designation">{employeeData.designation || "UX/UI Designer"}</p>
              </div>
            </div>

            <button className="performance-button" onClick={handlePerformanceClick}>
              Performance
            </button>
          </div>

          <div className="details-container">
            <div className="detail-row">
              <div className="detail-label">Joining Date:</div>
              <div className="detail-value">{employeeData.joiningDate || "N/A"}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Designation:</div>
              <div className="detail-value">{employeeData.designation || "N/A"}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Department:</div>
              <div className="detail-value">{employeeData.department || "N/A"}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Email:</div>
              <div className="detail-value">{employeeData.email || "N/A"}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Phone:</div>
              <div className="detail-value">{employeeData.phone || "N/A"}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Branch Office:</div>
              <div className="detail-value">{employeeData.branchOfficeName || "N/A"}</div>
            </div>

            <div className="detail-row detail-row-last">
              <div className="detail-label">Address:</div>
              <div className="detail-value">
                {employeeData.address
                  ? `${employeeData.address}, ${employeeData.city || ""}, ${employeeData.state || ""}, ${employeeData.country || ""}`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default EmployeePopup

