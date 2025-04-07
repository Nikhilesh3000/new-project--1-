"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Upload, ChevronDown, Check } from "lucide-react"
import "./EmployeeForm.css"
// Add at the top of EmployeeForm.jsx (with other imports)
import { createEmployee, updateEmployee } from "./api"

const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const EmployeeForm = ({ onSave, onCancel, employee = null, readOnly = false, isEdit = false }) => {
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [newBranch, setNewBranch] = useState("")
  const [branchOffices, setBranchOffices] = useState(["Mumbai HQ", "Delhi Office", "Bangalore Office"])
  const [formData, setFormData] = useState(
    employee
      ? {
          ...employee,
        }
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          alternativeNumber: "",
          dateOfBirth: "",
          gender: "",
          emergencyNumber: "",
          emergencyContactName: "",
          emergencyContactRelation: "",
          address: "",
          pinCode: "",
          area: "",
          city: "",
          state: "",
          country: "",
          designation: "",
          joiningDate: "",
          department: "",
          branchOfficeName: "",
          locationOfBranch: "",
          aadharCardNo: "",
          panCard: "",
          uanNumber: "",
          esiRegistrationNumber: "",
          pfNumber: "",
          educationQualification: "",
          nameOfInstitute: "",
          locationOfInstitute: "",
          passOutYear: "",
          offerLetterSent: "",
          offerLetterDate: "",
          offerLetterDoc: null,
          appointmentLetterSent: "",
          appointmentLetterDate: "",
          appointmentLetterDoc: null,
          eligibleForPromotion: "",
          promotionDate: "",
          promotionDate2: "",
          promotionDoc: null,
          promotionDoc2: null,
          designationPromotion: "",
          startDate: "",
          endDate: "",
          basicSalary: "",
          hra: "yes",
          conveyanceAllowance: "yes",
          medicalAllowance: "yes",
          epfEmployee: "yes",
          epfEmployer: "yes",
          otherExpenses: "yes",
          professionalTax: "yes",
          gratuityProvision: "yes",
          eligibleForIncentive: "yes",
          bankACName: "",
          bankName: "",
          bankACNumber: "",
          branchName: "",
          pfACNumber: "",
          payDate: "",
          ifsc: "",
          picture: "",
          resume: null,
          resignationLetter: "",
          relievingLetter: "",
          lor: "",
          certification: "",
          termination: "",
          emailDeleted: "",
          reasonForLeaving: "",
          aadharCardImage: null,
          nameOfCompany: "",
          position: "",
          periodOfWorking: "",
          workStartDate: "",
          workEndDate: "",
          jobDescription: "",
        },
  )

  const [errors, setErrors] = useState({})
  const [previewImage, setPreviewImage] = useState(null)
  const [aadharCardImage, setAadharCardImage] = useState(null)
  const [panCardImage, setPanCardImage] = useState(null)
  const [aadharVerified, setAadharVerified] = useState(false)
  const [panVerified, setPanVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedAltCountry, setSelectedAltCountry] = useState(null)
  const [selectedEmgCountry, setSelectedEmgCountry] = useState(null)
  const [departments, setDepartments] = useState(["Design", "Development", "HR", "Marketing", "Sales"])
  const [designations, setDesignations] = useState([
    "UX/UI Designer",
    "Frontend Developer",
    "Backend Developer",
    "HR Manager",
    "Project Manager",
  ])
  const [educationQualifications, setEducationQualifications] = useState([
    "SSC",
    "HSC",
    "Bachelor's",
    "Master's",
    "PhD",
  ])
  const [newDepartment, setNewDepartment] = useState("")
  const [newDesignation, setNewDesignation] = useState("")
  const [newEducation, setNewEducation] = useState("")
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [showAddDesignation, setShowAddDesignation] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)

  const [showCountryList, setShowCountryList] = useState(false)
  const [showAltCountryList, setShowAltCountryList] = useState(false)
  const [showEmgCountryList, setShowEmgCountryList] = useState(false)
  const [bankDetails, setBankDetails] = useState({ branchName: "", bankName: "" })
  const countryListRef = useRef(null)
  const altCountryListRef = useRef(null)
  const emgCountryListRef = useRef(null)

  // Function to fetch bank details by IFSC code
  const fetchBankDetailsByIFSC = async (ifscCode) => {
    if (ifscCode.length === 11) {
      try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`)
        const data = await response.json()
        if (data && data.BANK && data.BRANCH) {
          setBankDetails({
            branchName: data.BRANCH,
            bankName: data.BANK,
          })
          setFormData((prev) => ({
            ...prev,
            branchName: data.BRANCH,
            bankName: data.BANK,
          }))
        }
      } catch (error) {
        console.error("Error fetching bank details:", error)
      }
    }
  }

  // Handle IFSC code change
  const handleIFSCChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      ifsc: value,
    }))
    fetchBankDetailsByIFSC(value)
  }

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryListRef.current && !countryListRef.current.contains(event.target)) {
        setShowCountryList(false)
      }
      if (altCountryListRef.current && !altCountryListRef.current.contains(event.target)) {
        setShowAltCountryList(false)
      }
      if (emgCountryListRef.current && !emgCountryListRef.current.contains(event.target)) {
        setShowEmgCountryList(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Fetch countries data
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const data = await response.json()
        setCountries(data)

        // Set default country (India)
        const india = data.find((country) => country.name.common === "India")
        if (india) {
          setSelectedCountry(india)
          setSelectedAltCountry(india)
          setSelectedEmgCountry(india)
        }
      } catch (error) {
        console.error("Error fetching countries:", error)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (employee) {
      console.log("Loading employee data into form:", employee)

      // Create a copy of the employee data
      const formattedEmployee = { ...employee }

      // Split name into first, middle, and last name if it exists as a single field
      if (formattedEmployee.name && !formattedEmployee.firstName) {
        const nameParts = formattedEmployee.name.split(" ")
        formattedEmployee.firstName = nameParts[0] || ""
        formattedEmployee.lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
        formattedEmployee.middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : ""
      }

      // Set image previews if they exist
      if (formattedEmployee.picture) {
        setPreviewImage(formattedEmployee.picture)
      }

      if (formattedEmployee.aadharCardImage) {
        setAadharCardImage(formattedEmployee.aadharCardImage)
        setAadharVerified(true)
      }

      if (formattedEmployee.panCardImage) {
        setPanCardImage(formattedEmployee.panCardImage)
        setPanVerified(true)
      }

      // Convert boolean values to "yes"/"no" for radio buttons
      const booleanFields = [
        "offerLetterSent",
        "appointmentLetterSent",
        "eligibleForPromotion",
        "hra",
        "conveyanceAllowance",
        "medicalAllowance",
        "epfEmployee",
        "epfEmployer",
        "otherExpenses",
        "professionalTax",
        "gratuityProvision",
        "eligibleForIncentive",
      ]

      booleanFields.forEach((field) => {
        if (formattedEmployee[field] === 1 || formattedEmployee[field] === true) {
          formattedEmployee[field] = "yes"
        } else if (formattedEmployee[field] === 0 || formattedEmployee[field] === false) {
          formattedEmployee[field] = "no"
        }
      })

      setFormData(formattedEmployee)
    }
  }, [employee])

  // Handle pincode change to auto-fill city, state, and country
  useEffect(() => {
    if (formData.pinCode && formData.pinCode.length === 6) {
      // Call the API to get location data based on pincode
      const fetchPincodeData = async () => {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pinCode}`)
          const data = await response.json()

          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0]
            setFormData((prev) => ({
              ...prev,
              city: postOffice.District || "",
              state: postOffice.State || "",
              country: "India",
            }))
          }
        } catch (error) {
          console.error("Error fetching pincode data:", error)

          // Fallback for specific pincode (as in original code)
          if (formData.pinCode === "421202") {
            setFormData((prev) => ({
              ...prev,
              city: "Mumbai",
              state: "Maharashtra",
              country: "India",
            }))
          }
        }
      }

      fetchPincodeData()
    }
  }, [formData.pinCode])

  const handleChange = (e) => {
    const { name, value } = e.target

    // For phone fields, only allow digits and limit to 10 characters
    if (name === "phone" || name === "alternativeNumber" || name === "emergencyNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData({
        ...formData,
        [name]: digitsOnly,
      })
    }
    // For Aadhar card, only allow digits and limit to 12 characters
    else if (name === "aadharCardNo") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12)
      setFormData({
        ...formData,
        [name]: digitsOnly,
      })
    }
    // For PAN card, convert to uppercase and limit to 10 characters
    else if (name === "panCard") {
      const formattedValue = value.toUpperCase().slice(0, 10)
      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    }
    // For UAN number, only allow digits and limit to 12 characters
    else if (name === "uanNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12)
      setFormData({
        ...formData,
        [name]: digitsOnly,
      })
    }
    // For ESI registration number, only allow digits and limit to 10 characters
    else if (name === "esiRegistrationNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData({
        ...formData,
        [name]: digitsOnly,
      })
    }
    // Auto-capitalize first letter of name fields
    else if (name === "firstName" || name === "middleName" || name === "lastName") {
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
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

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Resize the image before setting it
        const resizedImage = await resizeImage(file)
        setPreviewImage(resizedImage)
        setFormData({
          ...formData,
          picture: resizedImage,
        })
      } catch (error) {
        console.error("Error resizing image:", error)
      }
    }
  }

  const handleAadharCardUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Resize the image before setting it
        const resizedImage = await resizeImage(file)
        setAadharCardImage(resizedImage)
        setFormData({
          ...formData,
          aadharCardImage: resizedImage,
        })
  
        // Set verification to true immediately
        setAadharVerified(true)
      } catch (error) {
        console.error("Error resizing image:", error)
      }
    }
  }

  const handlePanCardUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Resize the image before setting it
        const resizedImage = await resizeImage(file)
        setPanCardImage(resizedImage)
        setFormData({
          ...formData,
          panCardImage: resizedImage,
        })
  
        // Set verification to true immediately
        setPanVerified(true)
      } catch (error) {
        console.error("Error resizing image:", error)
      }
    }
  }

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      setDepartments([...departments, newDepartment.trim()])
      setFormData({ ...formData, department: newDepartment.trim() })
      setNewDepartment("")
      setShowAddDepartment(false)
    }
  }

  const handleAddDesignation = () => {
    if (newDesignation.trim()) {
      setDesignations([...designations, newDesignation.trim()])
      setFormData({ ...formData, designation: newDesignation.trim() })
      setNewDesignation("")
      setShowAddDesignation(false)
    }
  }

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setEducationQualifications([...educationQualifications, newEducation.trim()])
      setFormData({ ...formData, educationQualification: newEducation.trim() })
      setNewEducation("")
      setShowAddEducation(false)
    }
  }

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranchOffices([...branchOffices, newBranch.trim()])
      setFormData({ ...formData, branchOfficeName: newBranch.trim() })
      setNewBranch("")
      setShowAddBranch(false)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required"
    if (!formData.middleName?.trim()) newErrors.middleName = "Middle name is required"

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    // Alternative number is not required
    if (formData.alternativeNumber && !/^\d{10}$/.test(formData.alternativeNumber)) {
      newErrors.alternativeNumber = "Alternative number must be 10 digits"
    }

    if (!formData.emergencyNumber?.trim()) {
      newErrors.emergencyNumber = "Emergency number is required"
    } else if (!/^\d{10}$/.test(formData.emergencyNumber)) {
      newErrors.emergencyNumber = "Emergency number must be 10 digits"
    }

    if (!formData.emergencyContactName?.trim()) newErrors.emergencyContactName = "Emergency contact name is required"
    if (!formData.emergencyContactRelation?.trim())
      newErrors.emergencyContactRelation = "Emergency contact relation is required"

    if (!formData.address?.trim()) newErrors.address = "Address is required"
    if (!formData.pinCode?.trim()) newErrors.pinCode = "Pin code is required"
    if (!formData.area?.trim()) newErrors.area = "Area is required"
    if (!formData.city?.trim()) newErrors.city = "City is required"
    if (!formData.state?.trim()) newErrors.state = "State is required"
    if (!formData.country?.trim()) newErrors.country = "Country is required"

    if (!formData.aadharCardNo?.trim()) {
      newErrors.aadharCardNo = "Aadhar card number is required"
    } else if (!/^\d{12}$/.test(formData.aadharCardNo.replace(/\s/g, ""))) {
      newErrors.aadharCardNo = "Aadhar card number must be exactly 12 digits"
    }

    if (!formData.panCard?.trim()) {
      newErrors.panCard = "PAN card is required"
    } else if (!/^[A-Z0-9]{10}$/.test(formData.panCard.replace(/\s/g, ""))) {
      newErrors.panCard = "PAN card must be exactly 10 characters (letters and numbers)"
    }

    if (!formData.uanNumber?.trim()) {
      newErrors.uanNumber = "UAN number is required"
    } else if (!/^\d{12}$/.test(formData.uanNumber)) {
      newErrors.uanNumber = "UAN number must be exactly 12 digits"
    }

    if (!formData.esiRegistrationNumber?.trim()) {
      newErrors.esiRegistrationNumber = "ESI registration number is required"
    } else if (!/^\d{10}$/.test(formData.esiRegistrationNumber)) {
      newErrors.esiRegistrationNumber = "ESI registration number must be exactly 10 digits"
    }

    // if (!formData.pfNumber?.trim()) newErrors.pfNumber = "PF number is required"

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.designation) newErrors.designation = "Designation is required"
    if (!formData.joiningDate) newErrors.joiningDate = "Joining date is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.branchOfficeName) newErrors.branchOfficeName = "Branch office name is required"
    if (!formData.locationOfBranch) newErrors.locationOfBranch = "Location of branch is required"

    if (!formData.educationQualification) newErrors.educationQualification = "Education qualification is required"
    if (!formData.nameOfInstitute?.trim()) newErrors.nameOfInstitute = "Name of institute is required"
    if (!formData.locationOfInstitute?.trim()) newErrors.locationOfInstitute = "Location of institute is required"

    if (!formData.startDate) newErrors.startDate = "Start date is required"
    // End date is not required

    if (!formData.basicSalary) newErrors.basicSalary = "Basic salary is required"

    if (!formData.bankACName?.trim()) newErrors.bankACName = "Bank account name is required"
    if (!formData.bankName?.trim()) newErrors.bankName = "Bank name is required"
    if (!formData.bankACNumber?.trim()) newErrors.bankACNumber = "Bank account number is required"
    if (!formData.branchName?.trim()) newErrors.branchName = "Branch name is required"
    if (!formData.ifsc?.trim()) newErrors.ifsc = "IFSC code is required"

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const cleanedFormData = { ...formData }

      // Combine name fields
      cleanedFormData.name = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")

      // Make sure image data is included
      if (previewImage) {
        cleanedFormData.picture = previewImage
      }

      if (aadharCardImage) {
        cleanedFormData.aadharCardImage = aadharCardImage
      }

      if (panCardImage) {
        cleanedFormData.panCardImage = panCardImage
      }

      console.log("Submitting form data:", {
        id: employee?.id,
        name: cleanedFormData.name,
        hasProfilePic: !!cleanedFormData.picture,
        hasAadharImage: !!cleanedFormData.aadharCardImage,
        hasPanImage: !!cleanedFormData.panCardImage,
      })

      let result
      if (isEdit && employee?.id) {
        result = await updateEmployee(employee.id, cleanedFormData)
        alert("Employee updated successfully!")
      } else {
        result = await createEmployee(cleanedFormData)
        alert("Employee created successfully!")
      }

      console.log("API response:", result)
      onSave(result)
    } catch (error) {
      console.error("Error saving employee:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <button onClick={onCancel} className="back-button">
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="modal-title">Team Members</h2>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-grid-4">
                <div>
                  <div className="image-upload-container">
                    {previewImage ? (
                      <img src={previewImage || "/placeholder.svg"} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="upload-placeholder">
                        <span>+ Add Picture</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="picture"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      readOnly={readOnly}
                    />
                  </div>
                </div>

                <div className="form-col-span-3">
                  <div className="form-grid-3">
                    <div>
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="form-input"
                        readOnly={readOnly}
                      />
                      {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="middleName" className="form-label">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        placeholder="Enter middle name"
                        className="form-input"
                        readOnly={readOnly}
                      />
                      {errors.middleName && <p className="error-message">{errors.middleName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="form-input"
                        readOnly={readOnly}
                      />
                      {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth
                      </label>
                      <div className="input-with-icon">
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth || ""}
                          placeholder="DD/MM/YYYY"
                          onChange={handleChange}
                          className="form-input"
                          readOnly={readOnly}
                        />
                        <Calendar className="input-icon" size={16} />
                      </div>
                      {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-select"
                        readOnly={readOnly}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="error-message">{errors.gender}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email ID
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="abc@gmail.com"
                        className="form-input"
                        readOnly={readOnly}
                      />
                      {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="phone-fields-container">
                      <div>
                        <label htmlFor="phone" className="form-label">
                          Contact number
                        </label>
                        <div className="phone-input-container">
                          <div className="country-code-selector" onClick={() => setShowCountryList(!showCountryList)}>
                            {selectedCountry ? (
                              <>
                                <img
                                  src={selectedCountry.flags.png || "/placeholder.svg"}
                                  alt={selectedCountry.name.common}
                                  className="country-flag"
                                />
                                <span>
                                  {selectedCountry.idd.root}
                                  {selectedCountry.idd.suffixes?.[0]}
                                </span>
                                <ChevronDown size={14} />
                              </>
                            ) : (
                              <>
                                <span>+91</span>
                                <ChevronDown size={14} />
                              </>
                            )}
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter 10 digit number"
                            className="phone-input"
                            readOnly={readOnly}
                          />
                          {showCountryList && (
                            <div ref={countryListRef} className="country-dropdown">
                              <div className="country-search">
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className="country-search-input"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {countries.map((country, index) => (
                                <div
                                  key={index}
                                  className="country-item"
                                  onClick={() => {
                                    setSelectedCountry(country)
                                    setShowCountryList(false)
                                  }}
                                >
                                  <img
                                    src={country.flags.png || "/placeholder.svg"}
                                    alt={country.name.common}
                                    className="country-flag"
                                  />
                                  <span className="country-name">{country.name.common}</span>
                                  <span className="country-code">
                                    {country.idd.root}
                                    {country.idd.suffixes?.[0]}
                                  </span>
                                  {selectedCountry?.cca2 === country.cca2 && <Check size={14} className="check-icon" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                      </div>

                      <div>
                        <label htmlFor="alternativeNumber" className="form-label">
                          Alternative number
                        </label>
                        <div className="phone-input-container">
                          <div
                            className="country-code-selector"
                            onClick={() => setShowAltCountryList(!showAltCountryList)}
                          >
                            {selectedAltCountry ? (
                              <>
                                <img
                                  src={selectedAltCountry.flags.png || "/placeholder.svg"}
                                  alt={selectedAltCountry.name.common}
                                  className="country-flag"
                                />
                                <span>
                                  {selectedAltCountry.idd.root}
                                  {selectedAltCountry.idd.suffixes?.[0]}
                                </span>
                                <ChevronDown size={14} />
                              </>
                            ) : (
                              <>
                                <span>+91</span>
                                <ChevronDown size={14} />
                              </>
                            )}
                          </div>
                          <input
                            type="tel"
                            id="alternativeNumber"
                            name="alternativeNumber"
                            value={formData.alternativeNumber}
                            onChange={handleChange}
                            placeholder="Enter 10 digit number"
                            className="phone-input"
                            readOnly={readOnly}
                          />
                          {showAltCountryList && (
                            <div ref={altCountryListRef} className="country-dropdown">
                              <div className="country-search">
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className="country-search-input"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {countries.map((country, index) => (
                                <div
                                  key={index}
                                  className="country-item"
                                  onClick={() => {
                                    setSelectedAltCountry(country)
                                    setShowAltCountryList(false)
                                  }}
                                >
                                  <img
                                    src={country.flags.png || "/placeholder.svg"}
                                    alt={country.name.common}
                                    className="country-flag"
                                  />
                                  <span className="country-name">{country.name.common}</span>
                                  <span className="country-code">
                                    {country.idd.root}
                                    {country.idd.suffixes?.[0]}
                                  </span>
                                  {selectedAltCountry?.cca2 === country.cca2 && (
                                    <Check size={14} className="check-icon" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.alternativeNumber && <p className="error-message">{errors.alternativeNumber}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="pinCode" className="form-label">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="421202"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.pinCode && <p className="error-message">{errors.pinCode}</p>}
                </div>

                <div>
                  <label htmlFor="area" className="form-label">
                    Area
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.area && <p className="error-message">{errors.area}</p>}
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="form-input"
                    readOnly={readOnly || formData.pinCode?.length === 6}
                  />
                  {errors.state && <p className="error-message">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="form-input"
                    readOnly={readOnly || formData.pinCode?.length === 6}
                  />
                  {errors.city && <p className="error-message">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="form-input"
                    readOnly={readOnly || formData.pinCode?.length === 6}
                  />
                  {errors.country && <p className="error-message">{errors.country}</p>}
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="emergencyNumber" className="form-label">
                    Emergency number
                  </label>
                  <div className="phone-input-container">
                    <div className="country-code-selector" onClick={() => setShowEmgCountryList(!showEmgCountryList)}>
                      {selectedEmgCountry ? (
                        <>
                          <img
                            src={selectedEmgCountry.flags.png || "/placeholder.svg"}
                            alt={selectedEmgCountry.name.common}
                            className="country-flag"
                          />
                          <span>
                            {selectedEmgCountry.idd.root}
                            {selectedEmgCountry.idd.suffixes?.[0]}
                          </span>
                          <ChevronDown size={14} />
                        </>
                      ) : (
                        <>
                          <span>+91</span>
                          <ChevronDown size={14} />
                        </>
                      )}
                    </div>
                    <input
                      type="tel"
                      id="emergencyNumber"
                      name="emergencyNumber"
                      value={formData.emergencyNumber}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      className="phone-input"
                      readOnly={readOnly}
                    />
                    {showEmgCountryList && (
                      <div ref={emgCountryListRef} className="country-dropdown">
                        <div className="country-search">
                          <input
                            type="text"
                            placeholder="Search countries..."
                            className="country-search-input"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {countries.map((country, index) => (
                          <div
                            key={index}
                            className="country-item"
                            onClick={() => {
                              setSelectedEmgCountry(country)
                              setShowEmgCountryList(false)
                            }}
                          >
                            <img
                              src={country.flags.png || "/placeholder.svg"}
                              alt={country.name.common}
                              className="country-flag"
                            />
                            <span className="country-name">{country.name.common}</span>
                            <span className="country-code">
                              {country.idd.root}
                              {country.idd.suffixes?.[0]}
                            </span>
                            {selectedEmgCountry?.cca2 === country.cca2 && <Check size={14} className="check-icon" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.emergencyNumber && <p className="error-message">{errors.emergencyNumber}</p>}
                </div>

                <div>
                  <label htmlFor="emergencyContactName" className="form-label">
                    Emg. Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.emergencyContactName && <p className="error-message">{errors.emergencyContactName}</p>}
                </div>

                <div>
                  <label htmlFor="emergencyContactRelation" className="form-label">
                    Emg. Contact Relation
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.emergencyContactRelation && (
                    <p className="error-message">{errors.emergencyContactRelation}</p>
                  )}
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-select"
                    readOnly={readOnly}
                  >
                    <option value="">Select</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="error-message">{errors.department}</p>}
                </div>

                <div>
                  <label htmlFor="designation" className="form-label">
                    Designation
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="form-select"
                    readOnly={readOnly}
                  >
                    <option value="">Select</option>
                    {designations.map((desig, index) => (
                      <option key={index} value={desig}>
                        {desig}
                      </option>
                    ))}
                  </select>
                  {errors.designation && <p className="error-message">{errors.designation}</p>}
                </div>

                <div>
                  <label htmlFor="joiningDate" className="form-label">
                    Date of Joining
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="joiningDate"
                      name="joiningDate"
                      value={formData.joiningDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                  {errors.joiningDate && <p className="error-message">{errors.joiningDate}</p>}
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="branchOfficeName" className="form-label">
                    Branch Office Name
                  </label>
                  <div className="relative">
                    {!showAddBranch ? (
                      <select
                        id="branchOfficeName"
                        name="branchOfficeName"
                        value={formData.branchOfficeName}
                        onChange={(e) => {
                          if (e.target.value === "add_new") {
                            setShowAddBranch(true)
                          } else {
                            handleChange(e)
                          }
                        }}
                        className="form-select"
                        readOnly={readOnly}
                      >
                        <option value="">Select</option>
                        <option value="Mumbai HQ">Mumbai HQ</option>
                        <option value="Delhi Office">Delhi Office</option>
                        <option value="Bangalore Office">Bangalore Office</option>
                        <option value="add_new">+ Add New</option>
                      </select>
                    ) : (
                      <div className="add-new-container">
                        <input
                          type="text"
                          value={newBranch}
                          onChange={(e) => setNewBranch(e.target.value)}
                          placeholder="Enter new branch name"
                          className="add-new-input"
                        />
                        <button type="button" onClick={handleAddBranch} className="add-new-button">
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.branchOfficeName && <p className="error-message">{errors.branchOfficeName}</p>}
                </div>

                <div>
                  <label htmlFor="locationOfBranch" className="form-label">
                    Location of Branch
                  </label>
                  <select
                    id="locationOfBranch"
                    name="locationOfBranch"
                    value={formData.locationOfBranch}
                    onChange={handleChange}
                    className="form-select"
                    readOnly={readOnly}
                  >
                    <option value="">Select</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                  {errors.locationOfBranch && <p className="error-message">{errors.locationOfBranch}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-grid-2">
                <div className="flex-container">
                  <div className="upload-container">
                    <label htmlFor="resumeUpload" className="upload-label">
                      <div className="upload-box">
                        {formData.resume ? (
                          <div className="upload-success">
                            <span className="verified-text">Uploaded</span>
                          </div>
                        ) : (
                          <span className="upload-text">
                            Upload Resume
                            <Upload className="upload-icon" size={14} />
                          </span>
                        )}
                        <input
                          type="file"
                          id="resumeUpload"
                          accept=".pdf,.doc,.docx"
                          className="file-input"
                          readOnly={readOnly}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData({
                                ...formData,
                                resume: file,
                              })
                            }
                          }}
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex-grow">
                    <label htmlFor="aadharCardNo" className="form-label">
                      Aadhar Card No.
                    </label>
                    <input
                      type="text"
                      id="aadharCardNo"
                      name="aadharCardNo"
                      value={formData.aadharCardNo}
                      onChange={handleChange}
                      placeholder="5665 4567 2378 9845"
                      className="form-input"
                      readOnly={readOnly}
                    />
                    {errors.aadharCardNo && <p className="error-message">{errors.aadharCardNo}</p>}
                  </div>
                  <div className="upload-container">
                    <label htmlFor="aadharCardUpload" className="upload-label">
                      <div className="upload-box">
                        {aadharCardImage ? (
                          <div className="upload-success">
                            <span className="verified-text">Verified</span>
                          </div>
                        ) : (
                          <span className="upload-text">
                            Upload Aadhar
                            <Upload className="upload-icon" size={14} />
                          </span>
                        )}
                        <input
                          type="file"
                          id="aadharCardUpload"
                          accept="image/*"
                          className="file-input"
                          readOnly={readOnly}
                          onChange={handleAadharCardUpload}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex-container">
                  <div className="flex-grow">
                    <label htmlFor="panCard" className="form-label">
                      Pan Card
                    </label>
                    <input
                      type="text"
                      id="panCard"
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleChange}
                      placeholder="JTMG6543W"
                      className="form-input"
                      readOnly={readOnly}
                    />
                    {errors.panCard && <p className="error-message">{errors.panCard}</p>}
                  </div>
                  <div className="upload-container">
                    <label htmlFor="panCardUpload" className="upload-label">
                      <div className="upload-box">
                        {panCardImage ? (
                          <div className="upload-success">
                            <span className="verified-text">Verified</span>
                          </div>
                        ) : (
                          <span className="upload-text">
                            Upload PAN
                            <Upload className="upload-icon" size={14} />
                          </span>
                        )}
                        <input
                          type="file"
                          id="panCardUpload"
                          accept="image/*"
                          className="file-input"
                          readOnly={readOnly}
                          onChange={handlePanCardUpload}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="uanNumber" className="form-label">
                    UAN Number
                  </label>
                  <input
                    type="text"
                    id="uanNumber"
                    name="uanNumber"
                    value={formData.uanNumber}
                    onChange={handleChange}
                    placeholder="SAME AS ADHAR"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.uanNumber && <p className="error-message">{errors.uanNumber}</p>}
                </div>

                <div>
                  <label htmlFor="esiRegistrationNumber" className="form-label">
                    ESI Registration Number
                  </label>
                  <input
                    type="text"
                    id="esiRegistrationNumber"
                    name="esiRegistrationNumber"
                    value={formData.esiRegistrationNumber}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.esiRegistrationNumber && <p className="error-message">{errors.esiRegistrationNumber}</p>}
                </div>

                <div>
                  <label htmlFor="pfNumber" className="form-label">
                    PF Number (if available)
                  </label>
                  <input
                    type="text"
                    id="pfNumber"
                    name="pfNumber"
                    value={formData.pfNumber}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.pfNumber && <p className="error-message">{errors.pfNumber}</p>}
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="educationQualification" className="form-label">
                    Education Qualification
                  </label>
                  <div className="relative">
                    {!showAddEducation ? (
                      <select
                        id="educationQualification"
                        name="educationQualification"
                        value={formData.educationQualification}
                        onChange={(e) => {
                          if (e.target.value === "add_new") {
                            setShowAddEducation(true)
                          } else {
                            handleChange(e)
                          }
                        }}
                        className="form-select"
                        readOnly={readOnly}
                      >
                        <option value="">Select</option>
                        {educationQualifications.map((edu, index) => (
                          <option key={index} value={edu}>
                            {edu}
                          </option>
                        ))}
                        <option value="add_new">+ Add New</option>
                      </select>
                    ) : (
                      <div className="add-new-container">
                        <input
                          type="text"
                          value={newEducation}
                          onChange={(e) => setNewEducation(e.target.value)}
                          placeholder="Enter new qualification"
                          className="add-new-input"
                        />
                        <button type="button" onClick={handleAddEducation} className="add-new-button">
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="nameOfInstitute" className="form-label">
                    Name of Institute
                  </label>
                  <input
                    type="text"
                    id="nameOfInstitute"
                    name="nameOfInstitute"
                    value={formData.nameOfInstitute}
                    onChange={handleChange}
                    placeholder="Mumbai University"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.nameOfInstitute && <p className="error-message">{errors.nameOfInstitute}</p>}
                </div>

                <div>
                  <label htmlFor="locationOfInstitute" className="form-label">
                    Location of Institute
                  </label>
                  <input
                    type="text"
                    id="locationOfInstitute"
                    name="locationOfInstitute"
                    value={formData.locationOfInstitute}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.locationOfInstitute && <p className="error-message">{errors.locationOfInstitute}</p>}
                </div>

                <div>
                  <label htmlFor="passOutYear" className="form-label">
                    Pass Out Year
                  </label>
                  <input
                    type="number"
                    id="passOutYear"
                    name="passOutYear"
                    value={formData.passOutYear || ""}
                    onChange={handleChange}
                    placeholder="2023"
                    className="form-input"
                    min="1950"
                    max="2050"
                    readOnly={readOnly}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-grid-2">
                <div>
                  <label htmlFor="nameOfCompany" className="form-label">
                    Name of Company
                  </label>
                  <input
                    type="text"
                    id="nameOfCompany"
                    name="nameOfCompany"
                    value={formData.nameOfCompany || ""}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="form-input"
                    readOnly={readOnly}
                  />
                </div>

                <div>
                  <label htmlFor="position" className="form-label">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position || ""}
                    onChange={handleChange}
                    placeholder="Enter position"
                    className="form-input"
                    readOnly={readOnly}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label htmlFor="periodOfWorking" className="form-label">
                    Period of Working
                  </label>
                  <input
                    type="text"
                    id="periodOfWorking"
                    name="periodOfWorking"
                    value={formData.periodOfWorking || ""}
                    onChange={handleChange}
                    placeholder="E.g. 1 year 5 months"
                    className="form-input"
                    readOnly={readOnly}
                  />
                </div>

                <div>
                  <label htmlFor="workStartDate" className="form-label">
                    Start Date
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="workStartDate"
                      name="workStartDate"
                      value={formData.workStartDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                </div>

                <div>
                  <label htmlFor="workEndDate" className="form-label">
                    End Date
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="workEndDate"
                      name="workEndDate"
                      value={formData.workEndDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                </div>
              </div>

              <div className="form-grid-1">
                <div>
                  <label htmlFor="jobDescription" className="form-label">
                    Description of Job Role
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription || ""}
                    onChange={handleChange}
                    placeholder="Enter job description"
                    className="form-input"
                    rows={4}
                    readOnly={readOnly}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Appointment Letter Sent</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="appointmentLetterSent"
                      checked={formData.appointmentLetterSent === "yes"}
                      onChange={() => handleRadioChange("appointmentLetterSent", "yes")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="appointmentLetterSent"
                      checked={formData.appointmentLetterSent === "no"}
                      onChange={() => handleRadioChange("appointmentLetterSent", "no")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">No</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Offer Letter Sent</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="offerLetterSent"
                      checked={formData.offerLetterSent === "yes"}
                      onChange={() => handleRadioChange("offerLetterSent", "yes")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="offerLetterSent"
                      checked={formData.offerLetterSent === "no"}
                      onChange={() => handleRadioChange("offerLetterSent", "no")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">No</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Eligible for Promotion</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="eligibleForPromotion"
                      checked={formData.eligibleForPromotion === "yes"}
                      onChange={() => handleRadioChange("eligibleForPromotion", "yes")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="eligibleForPromotion"
                      checked={formData.eligibleForPromotion === "no"}
                      onChange={() => handleRadioChange("eligibleForPromotion", "no")}
                      readOnly={readOnly}
                      className="radio-input"
                    />
                    <span className="radio-text">No</span>
                  </label>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="appointmentLetterDate" className="form-label">
                    Appointment Letter Date
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="appointmentLetterDate"
                      name="appointmentLetterDate"
                      value={formData.appointmentLetterDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                </div>
                <div className="upload-container">
                  <label htmlFor="appointmentLetterUpload" className="upload-label">
                    <div className="upload-box">
                      {formData.appointmentLetterDoc ? (
                        <div className="upload-success">
                          <span className="verified-text">Uploaded</span>
                        </div>
                      ) : (
                        <span className="upload-text">
                          Upload document
                          <Upload className="upload-icon" size={14} />
                        </span>
                      )}
                      <input
                        type="file"
                        id="appointmentLetterUpload"
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        readOnly={readOnly}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({
                              ...formData,
                              appointmentLetterDoc: file,
                            })
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="offerLetterDate" className="form-label">
                    Offer Letter Date
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="offerLetterDate"
                      name="offerLetterDate"
                      value={formData.offerLetterDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                </div>
                <div className="upload-container">
                  <label htmlFor="offerLetterUpload" className="upload-label">
                    <div className="upload-box">
                      {formData.offerLetterDoc ? (
                        <div className="upload-success">
                          <span className="verified-text">Uploaded</span>
                        </div>
                      ) : (
                        <span className="upload-text">
                          Upload document
                          <Upload className="upload-icon" size={14} />
                        </span>
                      )}
                      <input
                        type="file"
                        id="offerLetterUpload"
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        readOnly={readOnly}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({
                              ...formData,
                              offerLetterDoc: file,
                            })
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="promotionDate" className="form-label">
                    {formData.promotionDate2 ? "Promotion-1 Date" : "Promotion Date"}
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="promotionDate"
                      name="promotionDate"
                      value={formData.promotionDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                    <Calendar className="input-icon" size={16} />
                  </div>
                </div>
                <div className="upload-container">
                  <label htmlFor="promotionDocUpload" className="upload-label">
                    <div className="upload-box">
                      {formData.promotionDoc ? (
                        <div className="upload-success">
                          <span className="verified-text">Uploaded</span>
                        </div>
                      ) : (
                        <span className="upload-text">
                          Upload document
                          <Upload className="upload-icon" size={14} />
                        </span>
                      )}
                      <input
                        type="file"
                        id="promotionDocUpload"
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        readOnly={readOnly}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({
                              ...formData,
                              promotionDoc: file,
                            })
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {formData.promotionDate && (
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="promotionDate2" className="form-label">
                      Promotion Date
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="date"
                        id="promotionDate2"
                        name="promotionDate2"
                        value={formData.promotionDate2 || ""}
                        placeholder="DD/MM/YYYY"
                        onChange={handleChange}
                        className="form-input"
                        readOnly={readOnly}
                      />
                      <Calendar className="input-icon" size={16} />
                    </div>
                  </div>
                  <div className="upload-container">
                    <label htmlFor="promotionDoc2Upload" className="upload-label">
                      <div className="upload-box">
                        {formData.promotionDoc2 ? (
                          <div className="upload-success">
                            <span className="verified-text">Uploaded</span>
                          </div>
                        ) : (
                          <span className="upload-text">
                            Upload document
                            <Upload className="upload-icon" size={14} />
                          </span>
                        )}
                        <input
                          type="file"
                          id="promotionDoc2Upload"
                          accept=".pdf,.doc,.docx"
                          className="file-input"
                          readOnly={readOnly}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData({
                                ...formData,
                                promotionDoc2: file,
                              })
                            }
                          }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="form-grid-1">
                <div>
                  <label htmlFor="designationPromotion" className="form-label">
                    Designation
                  </label>
                  <select
                    id="designationPromotion"
                    name="designationPromotion"
                    value={formData.designationPromotion || ""}
                    onChange={handleChange}
                    className="form-select"
                    readOnly={readOnly}
                  >
                    <option value="">Select</option>
                    {designations.map((desig, index) => (
                      <option key={index} value={desig}>
                        {desig}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-grid-3">
                <div>
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                  </div>
                  {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate || ""}
                      placeholder="DD/MM/YYYY"
                      onChange={handleChange}
                      className="form-input"
                      readOnly={readOnly}
                    />
                  </div>
                  {formData.endDate && (
                    <div className="exit-modal">
                      <div className="exit-modal-content">
                        <h3 className="exit-modal-title">Exit Details</h3>

                        <div className="exit-form-group">
                          <label htmlFor="reasonForLeaving" className="form-label">
                            Reason for Leaving
                          </label>
                          <input
                            type="text"
                            id="reasonForLeaving"
                            name="reasonForLeaving"
                            placeholder="Enter the valid reason"
                            className="form-input"
                          />
                        </div>

                        <div className="exit-form-grid">
                          <div>
                            <label className="form-label">Resignation letter</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="resignationLetter" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="resignationLetter" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="form-label">Relieving letter</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="relievingLetter" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="relievingLetter" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="form-label">LOR</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="lor" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="lor" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="form-label">Certification</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="certification" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="certification" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="form-label">Termination</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="termination" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="termination" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="form-label">Email deleted</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input type="radio" name="emailDeleted" value="yes" className="radio-input" />
                                <span className="radio-text">Yes</span>
                              </label>
                              <label className="radio-label">
                                <input type="radio" name="emailDeleted" value="no" className="radio-input" />
                                <span className="radio-text">No</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="exit-modal-actions">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, endDate: "" })}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              /* Handle save exit details */
                              alert("Your exit details form has been saved successfully")
                              setFormData({ ...formData, endDate: formData.endDate })
                            }}
                            className="save-button"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="basicSalary" className="form-label">
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basicSalary"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    placeholder="Enter basic salary"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.basicSalary && <p className="error-message">{errors.basicSalary}</p>}
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">HRA</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="hra"
                        checked={formData.hra === "yes"}
                        onChange={() => handleRadioChange("hra", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="hra"
                        checked={formData.hra === "no"}
                        onChange={() => handleRadioChange("hra", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">Conveyance Allowance</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="conveyanceAllowance"
                        checked={formData.conveyanceAllowance === "yes"}
                        onChange={() => handleRadioChange("conveyanceAllowance", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="conveyanceAllowance"
                        checked={formData.conveyanceAllowance === "no"}
                        onChange={() => handleRadioChange("conveyanceAllowance", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Medical Allowance</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="medicalAllowance"
                        checked={formData.medicalAllowance === "yes"}
                        onChange={() => handleRadioChange("medicalAllowance", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="medicalAllowance"
                        checked={formData.medicalAllowance === "no"}
                        onChange={() => handleRadioChange("medicalAllowance", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">EPF (Employee)</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="epfEmployee"
                        checked={formData.epfEmployee === "yes"}
                        onChange={() => handleRadioChange("epfEmployee", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="epfEmployee"
                        checked={formData.epfEmployee === "no"}
                        onChange={() => handleRadioChange("epfEmployee", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">EPF (Employer)</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="epfEmployer"
                        checked={formData.epfEmployer === "yes"}
                        onChange={() => handleRadioChange("epfEmployer", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="epfEmployer"
                        checked={formData.epfEmployer === "no"}
                        onChange={() => handleRadioChange("epfEmployer", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">Other Expenses</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="otherExpenses"
                        checked={formData.otherExpenses === "yes"}
                        onChange={() => handleRadioChange("otherExpenses", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="otherExpenses"
                        checked={formData.otherExpenses === "no"}
                        onChange={() => handleRadioChange("otherExpenses", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Professional Tax</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="professionalTax"
                        checked={formData.professionalTax === "yes"}
                        onChange={() => handleRadioChange("professionalTax", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="professionalTax"
                        checked={formData.professionalTax === "no"}
                        onChange={() => handleRadioChange("professionalTax", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">Gratuity Provision</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gratuityProvision"
                        checked={formData.gratuityProvision === "yes"}
                        onChange={() => handleRadioChange("gratuityProvision", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gratuityProvision"
                        checked={formData.gratuityProvision === "no"}
                        onChange={() => handleRadioChange("gratuityProvision", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-grid-1">
                <div>
                  <label className="form-label">Eligible for Incentive</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="eligibleForIncentive"
                        checked={formData.eligibleForIncentive === "yes"}
                        onChange={() => handleRadioChange("eligibleForIncentive", "yes")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">Yes</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="eligibleForIncentive"
                        checked={formData.eligibleForIncentive === "no"}
                        onChange={() => handleRadioChange("eligibleForIncentive", "no")}
                        readOnly={readOnly}
                        className="radio-input"
                      />
                      <span className="radio-text">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-grid-3">
                <div>
                  <label htmlFor="bankACName" className="form-label">
                    Bank A/C Name
                  </label>
                  <input
                    type="text"
                    id="bankACName"
                    name="bankACName"
                    value={formData.bankACName}
                    onChange={handleChange}
                    placeholder="E.g. Nick Karthik"
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.bankACName && <p className="error-message">{errors.bankACName}</p>}
                </div>

                <div>
                  <label htmlFor="bankACNumber" className="form-label">
                    Bank A/C Number
                  </label>
                  <input
                    type="text"
                    id="bankACNumber"
                    name="bankACNumber"
                    value={formData.bankACNumber}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.bankACNumber && <p className="error-message">{errors.bankACNumber}</p>}
                </div>

                <div>
                  <label htmlFor="bankName" className="form-label">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.bankName && <p className="error-message">{errors.bankName}</p>}
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="branchName" className="form-label">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="branchName"
                    name="branchName"
                    value={formData.branchName || ""}
                    onChange={handleChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.branchName && <p className="error-message">{errors.branchName}</p>}
                </div>

                <div>
                  <label htmlFor="ifsc" className="form-label">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifsc"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleIFSCChange}
                    className="form-input"
                    readOnly={readOnly}
                  />
                  {errors.ifsc && <p className="error-message">{errors.ifsc}</p>}
                  {bankDetails.branchName && bankDetails.bankName && (
                    <div className="bank-details-success">
                      <p>Bank: {bankDetails.bankName}</p>
                      <p>Branch: {bankDetails.branchName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Save
              </button>
              <button type="button" onClick={onCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmployeeForm

