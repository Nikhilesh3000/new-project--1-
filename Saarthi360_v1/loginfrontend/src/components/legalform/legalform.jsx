import React, { useState, useEffect, useRef } from "react"
import "./legal.css"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import axios from "axios"

// Pincode Input Component
function PincodeInput({ value, onChange, onLocationFetch, className = "" }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock database of pincodes for demo purposes
  const PINCODE_DB = {
    110001: { city: "New Delhi", state: "Delhi", country: "India" },
    110002: { city: "New Delhi", state: "Delhi", country: "India" },
    110003: { city: "New Delhi", state: "Delhi", country: "India" },
    400001: { city: "Mumbai", state: "Maharashtra", country: "India" },
    400002: { city: "Mumbai", state: "Maharashtra", country: "India" },
    400003: { city: "Mumbai", state: "Maharashtra", country: "India" },
    500001: { city: "Hyderabad", state: "Telangana", country: "India" },
    600001: { city: "Chennai", state: "Tamil Nadu", country: "India" },
    700001: { city: "Kolkata", state: "West Bengal", country: "India" },
    560001: { city: "Bangalore", state: "Karnataka", country: "India" },
    380001: { city: "Ahmedabad", state: "Gujarat", country: "India" },
    302001: { city: "Jaipur", state: "Rajasthan", country: "India" },
    226001: { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
    800001: { city: "Patna", state: "Bihar", country: "India" },
    160001: { city: "Chandigarh", state: "Chandigarh", country: "India" },
  }

  const fetchLocationData = async (pincode) => {
    if (pincode.length !== 6) return

    setLoading(true)
    setError("")

    try {
      // First try to get from mock database
      if (PINCODE_DB[pincode]) {
        setTimeout(() => {
          onLocationFetch(PINCODE_DB[pincode])
          setLoading(false)
        }, 500) // Simulate API delay
        return
      }

      // If not in mock DB, try to fetch from API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await response.json()

      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0]
        const locationData = {
          city: postOffice.Block || postOffice.Name,
          state: postOffice.State,
          country: "India",
        }
        onLocationFetch(locationData)
      } else {
        setError("Pincode not found")
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
      setError("Failed to fetch location data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "")
    setError("")

    // Limit to 6 digits
    if (newValue.length <= 6) {
      onChange(newValue)

      // Fetch location data if pincode is 6 digits
      if (newValue.length === 6) {
        fetchLocationData(newValue)
      }
    }
  }

  // Fetch location data on initial render if pincode is already set
  useEffect(() => {
    if (value && value.length === 6) {
      fetchLocationData(value)
    }
  }, [])

  return (
    <div className={`pincode-container ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter 6-digit pincode"
        maxLength={6}
        className="pincode-input"
      />
      {loading && (
        <div className="pincode-loading">
          <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {error && <p className="pincode-error">{error}</p>}
    </div>
  )
}

const LegalForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [directors, setDirectors] = useState([{ name: "", dinNo: "" }])
  const [uploadedFiles, setUploadedFiles] = useState({
    gstCertificate: null,
    contractEmail: null,
  })
  const fileInputRefs = {
    gstCertificate: useRef(null),
    contractEmail: useRef(null),
  }
  const [legalDataList, setLegalDataList] = useState([])
  const [editIndex, setEditIndex] = useState(-1)
  const [currentId, setCurrentId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Basic Company Details
    companyName: "",
    companyConstitution: "",
    website: "",
    address: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
    industry: "",
    subIndustry: "",
    clientStatus: "",
    gstNo: "",
    gstCertificate: null,
    panNo: "",
    uidNo: "",
    tanNo: "",
    dateOfClientAcquired: "",
    emailId: "",
    phoneNumber: "",

    // Contact Person
    contactPersonName: "",
    designation: "",
    contactPhoneNumber: "",
    contactEmailId: "",
    dateOfBirth: "",
    gender: "",
    directors: [{ name: "", dinNo: "" }],

    // Placement Details
    placementFees: "",
    creditPeriod: "",
    replacementPeriod: "",
    additionalPlacementFees: "",

    // Contract Details
    contractNumber: "",
    contractDate: "",
    additionalContractNumber: "",
    contractNeedToSend: "",
    signingAuthorityName: "",
    signingAuthorityDesignation: "",
    contractReceivedDate: "",
    contractReceivedEmailDate: "",
    contractEmail: null,
    contractSent: "Yes",
    contractReceived: "Yes",
    dataUpdate: "Yes",
    gstDataStatus: "",

    // Management Team
    bdMembersName: "",
    teamLeader: "",
    nameOfFranchisee: "",
    nameOfLegalExecutive: "",
  })

  // Fetch all legal data from the backend
  const fetchLegalData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/legals_info")

      // Convert dates from yyyy-mm-dd to dd/mm/yyyy for display
      const formattedData = response.data.map((item) => {
        // Parse directors from JSON string if it's stored as a string
        let parsedDirectors = []
        try {
          parsedDirectors = item.directors ? JSON.parse(item.directors) : []
        } catch (e) {
          console.error("Error parsing directors:", e)
        }

        return {
          ...item,
          directors: parsedDirectors,
          dateOfClientAcquired: item.dateOfClientAcquired ? formatDateForDisplay(item.dateOfClientAcquired) : "",
          dateOfBirth: item.dateOfBirth ? formatDateForDisplay(item.dateOfBirth) : "",
          contractDate: item.contractDate ? formatDateForDisplay(item.contractDate) : "",
          contractReceivedDate: item.contractReceivedDate ? formatDateForDisplay(item.contractReceivedDate) : "",
          contractReceivedEmailDate: item.contractReceivedEmailDate
            ? formatDateForDisplay(item.contractReceivedEmailDate)
            : "",
        }
      })

      setLegalDataList(formattedData)
    } catch (err) {
      console.error("Error fetching legal data:", err)
      setError("Failed to fetch data from server")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchLegalData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "gstNo" && value.length > 15) {
      return
    }

    if (name === "panNo" && value.length > 10) {
      return
    }

    // Capitalize first letter of each word for name fields
    if (
      name === "companyName" ||
      name === "contactPersonName" ||
      name === "signingAuthorityName" ||
      name === "bdMembersName" ||
      name === "teamLeader" ||
      name === "nameOfFranchisee" ||
      name === "nameOfLegalExecutive"
    ) {
      const capitalizedValue = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      setFormData({
        ...formData,
        [name]: capitalizedValue,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handlePincodeChange = (value) => {
    setFormData({
      ...formData,
      pinCode: value,
    })
  }

  const handleLocationFetch = (locationData) => {
    setFormData((prevData) => ({
      ...prevData,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
    }))
  }

  const handlePhoneChange = (value, country, e, formattedValue) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    })
  }

  const handleContactPhoneChange = (value, country, e, formattedValue) => {
    setFormData({
      ...formData,
      contactPhoneNumber: value,
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      })

      setUploadedFiles({
        ...uploadedFiles,
        [name]: {
          name: files[0].name,
          size: files[0].size,
          type: files[0].type,
        },
      })
    }
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDirectorChange = (index, e) => {
    const { name, value } = e.target
    const updatedDirectors = [...directors]

    // Capitalize first letter of each word for director name
    if (name === "name") {
      updatedDirectors[index][name] = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    } else {
      updatedDirectors[index][name] = value
    }

    setDirectors(updatedDirectors)
  }

  const addDirector = () => {
    setDirectors([...directors, { name: "", dinNo: "" }])
  }

  // Format date from yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "" // Check for invalid date
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Format date from dd/mm/yyyy to yyyy-mm-dd for database
  const formatDateForDatabase = (dateString) => {
    if (!dateString) return null

    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    // Convert from dd/mm/yyyy to yyyy-mm-dd
    const parts = dateString.split("/")
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }

    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "" // Check for invalid date
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Prepare data for submission to backend
      const formDataForSubmission = {
        ...formData,
        // Convert dates from dd/mm/yyyy to yyyy-mm-dd for database
        dateOfClientAcquired: formatDateForDatabase(formData.dateOfClientAcquired),
        dateOfBirth: formatDateForDatabase(formData.dateOfBirth),
        contractDate: formatDateForDatabase(formData.contractDate),
        contractReceivedDate: formatDateForDatabase(formData.contractReceivedDate),
        contractReceivedEmailDate: formatDateForDatabase(formData.contractReceivedEmailDate),
        // Store directors as JSON string
        directors: JSON.stringify(directors),
        // Store file names
        gstCertificate: uploadedFiles.gstCertificate ? uploadedFiles.gstCertificate.name : null,
        contractEmail: uploadedFiles.contractEmail ? uploadedFiles.contractEmail.name : null,
      }

      // Remove actual file objects as they can't be sent directly in JSON
      delete formDataForSubmission.gstCertificate
      delete formDataForSubmission.contractEmail

      if (editIndex >= 0) {
        // Update existing record
        await axios.put(`http://localhost:8080/legals_info/${currentId}`, formDataForSubmission)
      } else {
        // Add new record
        await axios.post("http://localhost:8080/legals_info", formDataForSubmission)
      }

      // Refresh the data list
      await fetchLegalData()

      // Reset form
      resetForm()
      setShowForm(false)
      setEditIndex(-1)
      setCurrentId(null)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to save data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      // Basic Company Details
      companyName: "",
      companyConstitution: "",
      website: "",
      address: "",
      pinCode: "",
      city: "",
      state: "",
      country: "",
      industry: "",
      subIndustry: "",
      clientStatus: "",
      gstNo: "",
      gstCertificate: null,
      panNo: "",
      uidNo: "",
      tanNo: "",
      dateOfClientAcquired: "",
      emailId: "",
      phoneNumber: "",

      // Contact Person
      contactPersonName: "",
      designation: "",
      contactPhoneNumber: "",
      contactEmailId: "",
      dateOfBirth: "",
      gender: "",

      // Placement Details
      placementFees: "",
      creditPeriod: "",
      replacementPeriod: "",
      additionalPlacementFees: "",

      // Contract Details
      contractNumber: "",
      contractDate: "",
      additionalContractNumber: "",
      contractNeedToSend: "",
      signingAuthorityName: "",
      signingAuthorityDesignation: "",
      contractReceivedDate: "",
      contractReceivedEmailDate: "",
      contractEmail: null,
      contractSent: "Yes",
      contractReceived: "Yes",
      dataUpdate: "Yes",
      gstDataStatus: "",

      // Management Team
      bdMembersName: "",
      teamLeader: "",
      nameOfFranchisee: "",
      nameOfLegalExecutive: "",
    })
    setDirectors([{ name: "", dinNo: "" }])
    setUploadedFiles({
      gstCertificate: null,
      contractEmail: null,
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditIndex(-1)
    setCurrentId(null)
    resetForm()
  }

  const handleFileButtonClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleEdit = async (id) => {
    try {
      setLoading(true)
      // Fetch the specific record from the backend
      const response = await axios.get(`http://localhost:8080/legals_info/${id}`)
      const recordToEdit = response.data

      // Parse directors from JSON string
      let parsedDirectors = []
      try {
        parsedDirectors = recordToEdit.directors ? JSON.parse(recordToEdit.directors) : []
      } catch (e) {
        console.error("Error parsing directors:", e)
      }

      // Format dates for display
      const formattedRecord = {
        ...recordToEdit,
        dateOfClientAcquired: recordToEdit.dateOfClientAcquired
          ? formatDateForDisplay(recordToEdit.dateOfClientAcquired)
          : "",
        dateOfBirth: recordToEdit.dateOfBirth ? formatDateForDisplay(recordToEdit.dateOfBirth) : "",
        contractDate: recordToEdit.contractDate ? formatDateForDisplay(recordToEdit.contractDate) : "",
        contractReceivedDate: recordToEdit.contractReceivedDate
          ? formatDateForDisplay(recordToEdit.contractReceivedDate)
          : "",
        contractReceivedEmailDate: recordToEdit.contractReceivedEmailDate
          ? formatDateForDisplay(recordToEdit.contractReceivedEmailDate)
          : "",
      }

      setFormData({
        ...formattedRecord,
        gstCertificate: null,
        contractEmail: null,
      })

      if (parsedDirectors.length > 0) {
        setDirectors(parsedDirectors)
      } else {
        setDirectors([{ name: "", dinNo: "" }])
      }

      setUploadedFiles({
        gstCertificate: recordToEdit.gstCertificateFile ? { name: recordToEdit.gstCertificateFile } : null,
        contractEmail: recordToEdit.contractEmailFile ? { name: recordToEdit.contractEmailFile } : null,
      })

      // Find the index in the local array
      const index = legalDataList.findIndex((item) => item.id === id)
      setEditIndex(index)
      setCurrentId(id)
      setShowForm(true)
    } catch (err) {
      console.error("Error fetching record for edit:", err)
      setError("Failed to load record for editing")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        setLoading(true)
        await axios.delete(`http://localhost:8080/legals_info/${id}`)
        // Refresh the data list
        await fetchLegalData()
      } catch (err) {
        console.error("Error deleting record:", err)
        setError("Failed to delete record")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDownload = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add headers
    const headers = [
      "Company Name",
      "Company Constitution",
      "Website",
      "Address",
      "Pin Code",
      "City",
      "State",
      "Country",
      "Industry",
      "Sub Industry",
      "Client Status",
      "GST No",
      "GST Certificate",
      "PAN No",
      "UID No",
      "TAN No",
      "Date of Client Acquired",
      "Email ID",
      "Phone Number",
      "Contact Person Name",
      "Designation",
      "Contact Phone Number",
      "Contact Email ID",
      "Date of Birth",
      "Gender",
      "Director Names",
      "Director DIN Numbers",
      "Placement Fees",
      "Credit Period",
      "Replacement Period",
      "Additional Placement Fees",
      "Contract Number",
      "Contract Date",
      "Additional Contract Number",
      "Contract Need to Send",
      "Signing Authority Name",
      "Signing Authority Designation",
      "Contract Received Date",
      "Contract Received Email Date",
      "Email Upload",
      "Contract Sent",
      "Contract Received",
      "Data Update",
      "GST Data Status",
      "BD Members Name",
      "Team Leader",
      "Name of Franchisee",
      "Name of Legal Executive",
    ]
    csvContent += headers.join(",") + "\r\n"

    // Add data rows
    legalDataList.forEach((record) => {
      // Parse directors if needed
      let directorNames = ""
      let directorDINs = ""

      if (typeof record.directors === "string") {
        try {
          const parsedDirectors = JSON.parse(record.directors)
          directorNames = parsedDirectors.map((d) => d.name).join("; ")
          directorDINs = parsedDirectors.map((d) => d.dinNo).join("; ")
        } catch (e) {
          console.error("Error parsing directors for CSV:", e)
        }
      } else if (Array.isArray(record.directors)) {
        directorNames = record.directors.map((d) => d.name).join("; ")
        directorDINs = record.directors.map((d) => d.dinNo).join("; ")
      }

      const row = [
        `"${record.companyName || ""}"`,
        `"${record.companyConstitution || ""}"`,
        `"${record.website || ""}"`,
        `"${record.address || ""}"`,
        `"${record.pinCode || ""}"`,
        `"${record.city || ""}"`,
        `"${record.state || ""}"`,
        `"${record.country || ""}"`,
        `"${record.industry || ""}"`,
        `"${record.subIndustry || ""}"`,
        `"${record.clientStatus || ""}"`,
        `"${record.gstNo || ""}"`,
        `"${record.gstCertificateFile || ""}"`,
        `"${record.panNo || ""}"`,
        `"${record.uidNo || ""}"`,
        `"${record.tanNo || ""}"`,
        `"${record.dateOfClientAcquired || ""}"`,
        `"${record.emailId || ""}"`,
        `"${record.phoneNumber || ""}"`,
        `"${record.contactPersonName || ""}"`,
        `"${record.designation || ""}"`,
        `"${record.contactPhoneNumber || ""}"`,
        `"${record.contactEmailId || ""}"`,
        `"${record.dateOfBirth || ""}"`,
        `"${record.gender || ""}"`,
        `"${directorNames}"`,
        `"${directorDINs}"`,
        `"${record.placementFees || ""}"`,
        `"${record.creditPeriod || ""}"`,
        `"${record.replacementPeriod || ""}"`,
        `"${record.additionalPlacementFees || ""}"`,
        `"${record.contractNumber || ""}"`,
        `"${record.contractDate || ""}"`,
        `"${record.additionalContractNumber || ""}"`,
        `"${record.contractNeedToSend || ""}"`,
        `"${record.signingAuthorityName || ""}"`,
        `"${record.signingAuthorityDesignation || ""}"`,
        `"${record.contractReceivedDate || ""}"`,
        `"${record.contractReceivedEmailDate || ""}"`,
        `"${record.contractEmailFile || ""}"`,
        `"${record.contractSent || ""}"`,
        `"${record.contractReceived || ""}"`,
        `"${record.dataUpdate || ""}"`,
        `"${record.gstDataStatus || ""}"`,
        `"${record.bdMembersName || ""}"`,
        `"${record.teamLeader || ""}"`,
        `"${record.nameOfFranchisee || ""}"`,
        `"${record.nameOfLegalExecutive || ""}"`,
      ]

      csvContent += row.join(",") + "\r\n"
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "legal_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="legal-wrapper">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <div className="legal-data-container">
        {!showForm ? (
          <div className="legal-data-list">
            <div className="header">
              <h1>Legal Data</h1>
              <p>All the Legal Data are listed here</p>
            </div>
            <div className="search-sort-container">
              <div className="search-container">
                <i className="search-icon">🔍</i>
                <input type="text" placeholder="Search" className="search-input" />
              </div>
              <div className="sort-container">
                <button className="sort-button">
                  <span>Sort by</span>
                </button>
              </div>
              <button className="add-data-button" onClick={() => setShowForm(true)}>
                <span className="plus-icon">+</span> Add Data
              </button>
            </div>

            {legalDataList.length > 0 ? (
              <div className="data-table-wrapper">
                <div className="table-header">
                  <h2>Legal Data</h2>
                  <button className="download-icon-button" onClick={handleDownload}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>COMPANY NAME</th>
                        <th>COMPANY CONSTITUTION</th>
                        <th>WEBSITE</th>
                        <th>ADDRESS</th>
                        <th>PINCODE</th>
                        <th>CITY</th>
                        <th>STATE</th>
                        <th>COUNTRY</th>
                        <th>INDUSTRY</th>
                        <th>SUBINDUSTRY</th>
                        <th>CLIENT STATUS</th>
                        <th>GST NO</th>
                        <th>GST CERTIFICATE</th>
                        <th>PAN NO</th>
                        <th>UID NO</th>
                        <th>TAN NO</th>
                        <th>DATE OF CLIENT ACQUIRED</th>
                        <th>EMAIL ID</th>
                        <th>PHONE NUMBER</th>
                        <th>CONTACT PERSON NAME</th>
                        <th>DESIGNATION</th>
                        <th>PHONE NUMBER</th>
                        <th>EMAIL ID</th>
                        <th>DATE OF BIRTH OF CONTACT PERSON</th>
                        <th>GENDER</th>
                        <th>NAME OF DIRECTOR</th>
                        <th>DIN NO</th>
                        <th>PLACEMENT FEES</th>
                        <th>CREDIT PERIOD</th>
                        <th>REPLACEMENT PERIOD</th>
                        <th>ADDITIONAL PLACEMENT FEES</th>
                        <th>CONTRACT NUMBER</th>
                        <th>CONTRACT DATE</th>
                        <th>ADDITIONAL CONTRACT NUMBER</th>
                        <th>CONTRACT NEED TO SEND?</th>
                        <th>SIGNING AUTHORITY NAME</th>
                        <th>SIGNING AUTHORITY DESIGNATION</th>
                        <th>CONTRACT RECEIVED DATE</th>
                        <th>CONTRACT RECEIVED EMAIL DATE</th>
                        <th>EMAIL UPLOAD</th>
                        <th>CONTRACT SENT</th>
                        <th>CONTRACT RECEIVED</th>
                        <th>DATA UPDATE</th>
                        <th>GST DATA STATUS</th>
                        <th>BD MEMBERS NAME</th>
                        <th>TEAM LEADER</th>
                        <th>NAME OF FRANCHISEE</th>
                        <th>NAME OF LEGAL EXECUTIVE</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {legalDataList.map((record, index) => {
                        // Parse directors if needed
                        let directors = []
                        if (typeof record.directors === "string") {
                          try {
                            directors = JSON.parse(record.directors)
                          } catch (e) {
                            console.error("Error parsing directors:", e)
                          }
                        } else if (Array.isArray(record.directors)) {
                          directors = record.directors
                        }

                        return (
                          <tr key={record.id || index}>
                            <td>{record.companyName}</td>
                            <td>{record.companyConstitution}</td>
                            <td>{record.website}</td>
                            <td>{record.address}</td>
                            <td>{record.pinCode}</td>
                            <td>{record.city}</td>
                            <td>{record.state}</td>
                            <td>{record.country}</td>
                            <td>{record.industry}</td>
                            <td>{record.subIndustry}</td>
                            <td>{record.clientStatus}</td>
                            <td>{record.gstNo}</td>
                            <td>{record.gstCertificateFile}</td>
                            <td>{record.panNo}</td>
                            <td>{record.uidNo}</td>
                            <td>{record.tanNo}</td>
                            <td>{record.dateOfClientAcquired}</td>
                            <td>{record.emailId}</td>
                            <td>{record.phoneNumber}</td>
                            <td>{record.contactPersonName}</td>
                            <td>{record.designation}</td>
                            <td>{record.contactPhoneNumber}</td>
                            <td>{record.contactEmailId}</td>
                            <td>{record.dateOfBirth}</td>
                            <td>{record.gender}</td>
                            <td>{directors.map((d) => d.name).join(", ")}</td>
                            <td>{directors.map((d) => d.dinNo).join(", ")}</td>
                            <td>{record.placementFees}</td>
                            <td>{record.creditPeriod}</td>
                            <td>{record.replacementPeriod}</td>
                            <td>{record.additionalPlacementFees}</td>
                            <td>{record.contractNumber}</td>
                            <td>{record.contractDate}</td>
                            <td>{record.additionalContractNumber}</td>
                            <td>{record.contractNeedToSend}</td>
                            <td>{record.signingAuthorityName}</td>
                            <td>{record.signingAuthorityDesignation}</td>
                            <td>{record.contractReceivedDate}</td>
                            <td>{record.contractReceivedEmailDate}</td>
                            <td>{record.contractEmailFile}</td>
                            <td>{record.contractSent}</td>
                            <td>{record.contractReceived}</td>
                            <td>{record.dataUpdate}</td>
                            <td>{record.gstDataStatus}</td>
                            <td>{record.bdMembersName}</td>
                            <td>{record.teamLeader}</td>
                            <td>{record.nameOfFranchisee}</td>
                            <td>{record.nameOfLegalExecutive}</td>
                            <td className="action-cell">
                              <button className="action-button edit" onClick={() => handleEdit(record.id)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button className="action-button delete" onClick={() => handleDelete(record.id)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-state" onClick={() => setShowForm(true)}>
                <div className="empty-state-content">
                  <span className="plus-icon">+</span>
                  <p>Click here to add Legal Data</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="legal-form">
            <div className="form-header">
              <button className="back-button" onClick={() => handleCancel()}>
                &lt;
              </button>
              <h1>Legal Data</h1>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Basic Company Details */}
              <div className="form-section">
                <h2>Basic Company Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name</label>
                    <select name="companyName" value={formData.companyName} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Company A">Company A</option>
                      <option value="Company B">Company B</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Company Constitution</label>
                    <select
                      name="companyConstitution"
                      value={formData.companyConstitution}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="LLP">LLP</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Pin Code</label>
                    <PincodeInput
                      value={formData.pinCode}
                      onChange={handlePincodeChange}
                      onLocationFetch={handleLocationFetch}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} readOnly />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Industry</label>
                    <select name="industry" value={formData.industry} onChange={handleInputChange}>
                      <option>Select</option>
                      <option>Technology & IT Services</option>
                      <option>Advertising, Media and Entertainment</option>
                      <option>Construction, Real Estate and Infrastructure</option>
                      <option>Manufacturing & Industrial Services</option>
                      <option>Healthcare, Biotechnology & Pharmaceuticals</option>
                      <option>Businesses & Professional Services</option>
                      <option>Retail, Consumer Goods and Lifestyle</option>
                      <option>Energy, Power and Environmental Services</option>
                      <option>Education and Training</option>
                      <option>Travel, Hospitality and Logistics</option>
                      <option>Accounts & Finance</option>
                      <option>Agriculture & Natural Resources</option>
                      <option>Others</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub Industry</label>
                    <select name="subIndustry" value={formData.subIndustry} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>Animation</option>
                      <option>IT Services/Consulting</option>
                      <option>Cybersecurity</option>
                      <option>Data Science</option>
                      <option>Software Development & Publishing</option>
                      <option>Semiconductor</option>
                      <option>Web Development</option>
                      <option>AI & Embedded Systems</option>
                      <option>Cloud Services</option>
                      <option>Enterprise Solutions</option>
                      <option>Technology Solutions</option>
                      <option>Telecommunication</option>
                      <option>Others</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Client Status</label>
                    <select name="clientStatus" value={formData.clientStatus} onChange={handleInputChange}>
                      <option>Select</option>
                      <option>Non Active</option>
                      <option>Active</option>
                      <option>Reallocation</option>
                      <option>Revival</option>
                      <option>City we don't work</option>
                      <option>Black Listed</option>
                      <option>Industry we dont work</option>
                      <option>Company do not exist</option>
                      <option>Old non performance client</option>
                      <option>Company Shut Down</option>
                      <option>Not interested to work</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      GST No. <span className="verify">Verify</span>
                    </label>
                    <input
                      type="text"
                      name="gstNo"
                      value={formData.gstNo}
                      onChange={handleInputChange}
                      maxLength={15}
                    />
                  </div>
                  <div className="form-group">
                    <label>GST Certificate</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        name="gstCertificate"
                        id="gstCertificate"
                        onChange={handleFileChange}
                        className="file-input"
                        ref={fileInputRefs.gstCertificate}
                      />
                      <button
                        type="button"
                        className="file-button"
                        onClick={() => handleFileButtonClick(fileInputRefs.gstCertificate)}
                      >
                        {uploadedFiles.gstCertificate ? uploadedFiles.gstCertificate.name : "Upload document"}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Pan No.</label>
                    <input
                      type="text"
                      name="panNo"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                  </div>
                  <div className="form-group">
                    <label>UID No.</label>
                    <input type="text" name="uidNo" value={formData.uidNo} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Tan No.</label>
                    <input type="text" name="tanNo" value={formData.tanNo} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Date of Client Acquired</label>
                    <div
                      className="custom-date-input"
                      onClick={() => document.getElementById("dateOfClientAcquired").focus()}
                    >
                      <span className="calendar-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="dateOfClientAcquired"
                        name="dateOfClientAcquired"
                        value={formData.dateOfClientAcquired}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                      <span className="date-placeholder">
                        {formData.dateOfClientAcquired ? formatDate(formData.dateOfClientAcquired) : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email ID</label>
                    <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone number</label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: "phoneNumber",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person in company */}
              <div className="form-section">
                <h2>Contact Person in company</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contact person name</label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone number</label>
                    <PhoneInput
                      country={"in"}
                      value={formData.contactPhoneNumber}
                      onChange={handleContactPhoneChange}
                      inputProps={{
                        name: "contactPhoneNumber",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email ID</label>
                    <input
                      type="email"
                      name="contactEmailId"
                      value={formData.contactEmailId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth of contact person</label>
                    <div className="custom-date-input" onClick={() => document.getElementById("dateOfBirth").focus()}>
                      <span className="calendar-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                      <span className="date-placeholder">
                        {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="director-section">
                    {directors.map((director, index) => (
                      <React.Fragment key={index}>
                        <div className="director-row">
                          <div className="director-name-container">
                            <label>Name of Director</label>
                            <div className="director-input">
                              <input
                                type="text"
                                name="name"
                                value={director.name}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="din-input"
                              />
                              {index === directors.length - 1 && (
                                <button type="button" className="add-director" onClick={addDirector}>
                                  +
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="director-din-container">
                            <label>DIN No.</label>
                            <input
                              type="text"
                              name="dinNo"
                              value={director.dinNo}
                              onChange={(e) => handleDirectorChange(index, e)}
                              className="din-input"
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Placement details */}
              <div className="form-section">
                <h2>Placement details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Placement Fees</label>
                    <select name="placementFees" value={formData.placementFees} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>7</option>
                      <option>7.5</option>
                      <option>8</option>
                      <option>8.33</option>
                      <option>9</option>
                      <option>10</option>
                      <option>12.50</option>
                      <option>13</option>
                      <option>16</option>
                      <option>18</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Credit Period</label>
                    <select name="creditPeriod" value={formData.creditPeriod} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>30</option>
                      <option>45</option>
                      <option>60</option>
                      <option>90</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Replacement Period</label>
                    <select name="replacementPeriod" value={formData.replacementPeriod} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option>30</option>
                      <option>45</option>
                      <option>60</option>
                      <option>90</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Additional Placement Fees</label>
                    <select
                      name="additionalPlacementFees"
                      value={formData.additionalPlacementFees}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option>7</option>
                      <option>7.5</option>
                      <option>8</option>
                      <option>8.33</option>
                      <option>9</option>
                      <option>10</option>
                      <option>12.50</option>
                      <option>13</option>
                      <option>16</option>
                      <option>18</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="form-section">
                <h2>Contract Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contract Number</label>
                    <input
                      type="text"
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contract Date</label>
                    <div className="custom-date-input" onClick={() => document.getElementById("contractDate").focus()}>
                      <span className="calendar-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="contractDate"
                        name="contractDate"
                        value={formData.contractDate}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                      <span className="date-placeholder">
                        {formData.contractDate ? formatDate(formData.contractDate) : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Additional Contract Number</label>
                    <input
                      type="text"
                      name="additionalContractNumber"
                      value={formData.additionalContractNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contract Need to Send?</label>
                    <select name="contractNeedToSend" value={formData.contractNeedToSend} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Signing authority name</label>
                    <input
                      type="text"
                      name="signingAuthorityName"
                      value={formData.signingAuthorityName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Signing authority designation</label>
                    <input
                      type="text"
                      name="signingAuthorityDesignation"
                      value={formData.signingAuthorityDesignation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contract received Date</label>
                    <div
                      className="custom-date-input"
                      onClick={() => document.getElementById("contractReceivedDate").focus()}
                    >
                      <span className="calendar-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="contractReceivedDate"
                        name="contractReceivedDate"
                        value={formData.contractReceivedDate}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                      <span className="date-placeholder">
                        {formData.contractReceivedDate ? formatDate(formData.contractReceivedDate) : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Contract received EMAIL date</label>
                    <div
                      className="custom-date-input"
                      onClick={() => document.getElementById("contractReceivedEmailDate").focus()}
                    >
                      <span className="calendar-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="contractReceivedEmailDate"
                        name="contractReceivedEmailDate"
                        value={formData.contractReceivedEmailDate}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                      <span className="date-placeholder">
                        {formData.contractReceivedEmailDate
                          ? formatDate(formData.contractReceivedEmailDate)
                          : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Upload</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        name="contractEmail"
                        id="contractEmail"
                        onChange={handleFileChange}
                        className="file-input"
                        ref={fileInputRefs.contractEmail}
                      />
                      <button
                        type="button"
                        className="file-button"
                        onClick={() => handleFileButtonClick(fileInputRefs.contractEmail)}
                      >
                        {uploadedFiles.contractEmail ? uploadedFiles.contractEmail.name : "Upload document"}
                      </button>
                    </div>
                  </div>
                  <div className="form-group radio-group">
                    <label>Contract Sent?</label>
                    <div className="radio-options">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="contractSent"
                          value="Yes"
                          checked={formData.contractSent === "Yes"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="contractSent"
                          value="No"
                          checked={formData.contractSent === "No"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>
                  <div className="form-group radio-group">
                    <label>Contract Received?</label>
                    <div className="radio-options">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="contractReceived"
                          value="Yes"
                          checked={formData.contractReceived === "Yes"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="contractReceived"
                          value="No"
                          checked={formData.contractReceived === "No"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>
                  <div className="form-group radio-group">
                    <label>Data Update?</label>
                    <div className="radio-options">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="dataUpdate"
                          value="Yes"
                          checked={formData.dataUpdate === "Yes"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="dataUpdate"
                          value="No"
                          checked={formData.dataUpdate === "No"}
                          onChange={handleRadioChange}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>GST Data Status</label>
                    <select name="gstDataStatus" value={formData.gstDataStatus} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Management Team */}
              <div className="form-section">
                <h2>Management Team</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>BD Members Name</label>
                    <select name="bdMembersName" value={formData.bdMembersName} onChange={handleInputChange}>
                      <option>Select</option>
                      <option>BD Member 1</option>
                      <option>BD Member 2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Team Leader</label>
                    <select name="teamLeader" value={formData.teamLeader} onChange={handleInputChange}>
                    <option>Select</option>
                      <option>Team Leader 1</option>
                      <option>Team Leader 2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name of franchisee</label>
                    <select name="nameOfFranchisee" value={formData.nameOfFranchisee} onChange={handleInputChange}>
                      <option>Select</option>
                      <option>Franchise 1</option>
                      <option>Franchise 2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name of Legal Executive</label>
                    <select
                      name="nameOfLegalExecutive"
                      value={formData.nameOfLegalExecutive}
                      onChange={handleInputChange}
                    >
                      <option>Select</option>
                      <option>Deepti Singh</option>
                      <option>Nishi Doshi</option>
                      <option>Princy Abraham</option>
                      <option>Anushree Iyer</option>
                      <option>Mahek Shaikh</option>
                      <option>Legal Team</option>
                      <option>Kavya Sharma</option>
                      <option>Jacob Noel Joji</option>
                      <option>Rashi Chauhan</option>
                      <option>Shilpa Matthew</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalForm

