import { useState, useEffect, useRef } from "react"
import { format, parse, isValid } from "date-fns"
import axios from "axios"
import "./client.css"

export default function ClientDataManagement() {
  const [showForm, setShowForm] = useState(false)
  const [clients, setClients] = useState([])
  const [editingClient, setEditingClient] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Fetch all clients from the backend
  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/clients_info")
      setClients(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching clients:", error)
      setLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Search clients
  const searchClients = async () => {
    if (!searchTerm.trim()) {
      fetchClients()
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/api/clients_info/search/${searchTerm}`)
      setClients(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error searching clients:", error)
      setLoading(false)
    }
  }

  // Handle form submission for adding/updating client
  const handleAddClient = async (clientData) => {
    try {
      if (editingClient && editingClient.id) {
        // Update existing client
        await axios.put(`http://localhost:8080/api/clients_info/${editingClient.id}`, clientData)
      } else {
        // Add new client
        await axios.post("http://localhost:8080/api/clients_info", clientData)
      }

      // Refresh client list
      fetchClients()

      // Reset editing state
      setEditingClient(null)
      setEditingIndex(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving client:", error)
      alert("Error saving client data. Please try again.")
    }
  }

  // Handle edit client
  const handleEditClient = async (index) => {
    const client = clients[index]
    setEditingClient(client)
    setEditingIndex(index)
    setShowForm(true)
  }

  // Handle delete client
  const handleDeleteClient = async (index) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const clientId = clients[index].id
        await axios.delete(`http://localhost:8080/api/clients_info/${clientId}`)

        // Refresh client list
        fetchClients()
      } catch (error) {
        console.error("Error deleting client:", error)
        alert("Error deleting client. Please try again.")
      }
    }
  }

  const downloadCSV = () => {
    if (clients.length === 0) {
      alert("No data to download")
      return
    }

    // Get all headers
    const headers = [
      "Company Name",
      "BD Members",
      "Address",
      "Country",
      "Pin Code",
      "City",
      "State",
      "Industry",
      "Sub Industry",
      "Website",
      "GST Number",
      "Establishment Year",
      "No. of Employees",
      "Contact Person Name",
      "Contact Designation",
      "Contact Phone",
      "Contact Email",
      "Additional Name",
      "Additional Designation",
      "Additional Phone",
      "Additional Landline",
      "Additional Email",
      "Placement Fees",
      "Credit Period",
      "Replacement Period",
      "Company Status",
      "Status",
      "Director Names",
      "Team Leader",
      "Franchisee Name",
      "Date Client Acquired",
      "Date Of Client Allocation",
      "Reallocation Status",
      "Date Of Client Reallocation",
      "New Franchisee",
      "New Team Leader",
    ]

    // Map client data to CSV rows
    const csvRows = clients.map((client) => {
      return [
        client.companyName || "",
        client.bdMembersName || "",
        client.address || "",
        client.country || "",
        client.pinCode || "",
        client.city || "",
        client.state || "",
        client.industry || "",
        client.subIndustry || "",
        client.website || "",
        client.gstNumber || "",
        client.establishmentYear || "",
        client.numberOfEmployees || "",
        client.contactPersonName || "",
        client.contactDesignation || "",
        client.contactPhone || "",
        client.contactEmail || "",
        client.additionalName || "",
        client.additionalDesignation || "",
        client.additionalPhone || "",
        client.additionalLandline || "",
        client.additionalEmail || "",
        client.placementFees || "",
        client.creditPeriod || "",
        client.replacementPeriod || "",
        client.companyStatus || "",
        client.status || "",
        (client.directorNames || []).join("; "),
        client.teamLeader || "",
        client.franchiseeName || "",
        client.dateClientAcquired || "",
        client.dateOfClientAllocation || "",
        client.reallocationStatus || "",
        client.dateOfClientReallocation || "",
        client.newFranchisee || "",
        client.newTeamLeader || "",
      ]
        .map((value) => {
          // Escape quotes and wrap in quotes
          const escaped = `"${String(value).replace(/"/g, '""')}"`
          return escaped
        })
        .join(",")
    })

    // Combine headers and rows
    const csvContent = [headers.map((header) => `"${header}"`).join(","), ...csvRows].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "client_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (showForm) {
    return (
      <ClientDataForm
        onSave={handleAddClient}
        onCancel={() => {
          setShowForm(false)
          setEditingClient(null)
          setEditingIndex(null)
        }}
        initialData={editingClient}
      />
    )
  }

  return (
    <div className="client-wrapper">
      <div className="header-section">
        <div>
          <h1 className="page-title">Client Data</h1>
          <p className="page-subtitle">All the company clients are listed here</p>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-container-wrapper">
          <div className="search-container">
            <div className="search-icon">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && searchClients()}
            />
          </div>
          <button className="sort-button" onClick={searchClients}>
            <span className="button-text">Sort</span>
          </button>
        </div>

        <div className="button-group">
          <button
            className="add-button"
            onClick={() => {
              setEditingClient(null)
              setEditingIndex(null)
              setShowForm(true)
            }}
          >
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
              className="button-icon"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon-container">
            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="empty-text">Loading client data...</p>
        </div>
      ) : clients.length === 0 ? (
        <div
          className="empty-state"
          onClick={() => {
            setEditingClient(null)
            setEditingIndex(null)
            setShowForm(true)
          }}
        >
          <div className="empty-icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <p className="empty-text">Click here to add Client Data</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-actions">
            <button onClick={downloadCSV} className="download-button" title="Download as CSV">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">COMPANY NAME</th>
                  <th className="table-cell">BD MEMBERS</th>
                  <th className="table-cell">ADDRESS</th>
                  <th className="table-cell">COUNTRY</th>
                  <th className="table-cell">PIN CODE</th>
                  <th className="table-cell">CITY</th>
                  <th className="table-cell">STATE</th>
                  <th className="table-cell">INDUSTRY</th>
                  <th className="table-cell">SUB INDUSTRY</th>
                  <th className="table-cell">WEBSITE</th>
                  <th className="table-cell">GST NUMBER</th>
                  <th className="table-cell">ESTABLISHMENT YEAR</th>
                  <th className="table-cell">NO. OF EMPLOYEES</th>
                  <th className="table-cell">CONTACT PERSON NAME</th>
                  <th className="table-cell">DESIGNATION</th>
                  <th className="table-cell">CONTACT PHONE</th>
                  <th className="table-cell">CONTACT EMAIL</th>
                  <th className="table-cell">ADDITIONAL NAME</th>
                  <th className="table-cell">ADDITIONAL DESIGNATION</th>
                  <th className="table-cell">ADDITIONAL PHONE</th>
                  <th className="table-cell">ADDITIONAL LANDLINE</th>
                  <th className="table-cell">ADDITIONAL EMAIL</th>
                  <th className="table-cell">PLACEMENT FEES</th>
                  <th className="table-cell">CREDIT PERIOD</th>
                  <th className="table-cell">REPLACEMENT PERIOD</th>
                  <th className="table-cell">COMPANY STATUS</th>
                  <th className="table-cell">STATUS</th>
                  <th className="table-cell">DIRECTOR NAMES</th>
                  <th className="table-cell">TEAM LEADER</th>
                  <th className="table-cell">FRANCHISEE NAME</th>
                  <th className="table-cell">DATE CLIENT ACQUIRED</th>
                  <th className="table-cell">DATE OF CLIENT ALLOCATION</th>
                  <th className="table-cell">REALLOCATION STATUS</th>
                  <th className="table-cell">DATE OF CLIENT REALLOCATION</th>
                  <th className="table-cell">NEW FRANCHISEE</th>
                  <th className="table-cell">NEW TEAM LEADER</th>
                  <th className="table-cell-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{client.companyName}</td>
                    <td className="table-cell">{client.bdMembersName}</td>
                    <td className="table-cell">{client.address}</td>
                    <td className="table-cell">{client.country}</td>
                    <td className="table-cell">{client.pinCode}</td>
                    <td className="table-cell">{client.city}</td>
                    <td className="table-cell">{client.state}</td>
                    <td className="table-cell">{client.industry}</td>
                    <td className="table-cell">{client.subIndustry}</td>
                    <td className="table-cell">{client.website}</td>
                    <td className="table-cell">{client.gstNumber}</td>
                    <td className="table-cell">{client.establishmentYear}</td>
                    <td className="table-cell">{client.numberOfEmployees}</td>
                    <td className="table-cell">{client.contactPersonName}</td>
                    <td className="table-cell">{client.contactDesignation}</td>
                    <td className="table-cell">{client.contactPhone}</td>
                    <td className="table-cell">{client.contactEmail}</td>
                    <td className="table-cell">{client.additionalName}</td>
                    <td className="table-cell">{client.additionalDesignation}</td>
                    <td className="table-cell">{client.additionalPhone}</td>
                    <td className="table-cell">{client.additionalLandline}</td>
                    <td className="table-cell">{client.additionalEmail}</td>
                    <td className="table-cell">{client.placementFees}</td>
                    <td className="table-cell">{client.creditPeriod}</td>
                    <td className="table-cell">{client.replacementPeriod}</td>
                    <td className="table-cell">{client.companyStatus}</td>
                    <td className="table-cell">{client.status}</td>
                    <td className="table-cell">{client.directorNames?.join(", ")}</td>
                    <td className="table-cell">{client.teamLeader}</td>
                    <td className="table-cell">{client.franchiseeName}</td>
                    <td className="table-cell">{client.dateClientAcquired}</td>
                    <td className="table-cell">{client.dateOfClientAllocation}</td>
                    <td className="table-cell">{client.reallocationStatus}</td>
                    <td className="table-cell">{client.dateOfClientReallocation}</td>
                    <td className="table-cell">{client.newFranchisee}</td>
                    <td className="table-cell">{client.newTeamLeader}</td>
                    <td className="action-cell">
                      <button onClick={() => handleEditClient(index)} className="edit-button" title="Edit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
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
                      <button onClick={() => handleDeleteClient(index)} className="delete-button" title="Delete">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Phone Input Component
function PhoneInput({ value, onChange, className = "" }) {
  const [countries, setCountries] = useState([
    { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
    { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
    { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
    { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
    { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
    { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
    { name: "Armenia", code: "AM", dialCode: "+374", flag: "🇦🇲" },
    { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
    { name: "Azerbaijan", code: "AZ", dialCode: "+994", flag: "🇦🇿" },
    { name: "Bahamas", code: "BS", dialCode: "+1242", flag: "🇧🇸" },
    { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
    { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
    { name: "Belarus", code: "BY", dialCode: "+375", flag: "🇧🇾" },
    { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
    { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
    { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
    { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
    { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
    { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
    { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
    { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
    { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
    { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
    { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
    { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
    { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
    { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
    { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
    { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
    { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
    { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
    { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
    { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
    { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  ])

  const [selectedCountry, setSelectedCountry] = useState(countries.find((c) => c.code === "IN") || countries[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    // Parse the value if it's already set
    if (value && value.includes(" ")) {
      const parts = value.split(" ")
      const dialCode = parts[0]
      const number = parts[1]

      const country = countries.find((c) => c.dialCode === dialCode)
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(number)
      } else {
        setPhoneNumber(value)
      }
    } else {
      setPhoneNumber(value)
    }
  }, [value])

  useEffect(() => {
    // Handle clicks outside the dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Focus search input when dropdown opens
    if (showDropdown && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showDropdown])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setShowDropdown(false)
    setSearchTerm("")
    onChange(`${country.dialCode} ${phoneNumber}`)
  }

  const handlePhoneNumberChange = (e) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, "")
    setPhoneNumber(newNumber)
    onChange(`${selectedCountry.dialCode} ${newNumber}`)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredCountries = searchTerm
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) || country.dialCode.includes(searchTerm),
      )
    : countries

  return (
    <div className="client-wrapper">
    <div className={`phone-input-container ${className}`}>
      <div className="phone-input-wrapper">
        <div className="country-selector" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="dial-code">{selectedCountry.dialCode}</span>
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
            className="chevron-icon"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="phone-number-input"
          placeholder="Phone number"
        />
      </div>

      {showDropdown && (
        <div ref={dropdownRef} className="country-dropdown">
          <div className="search-header">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code"
              value={searchTerm}
              onChange={handleSearchChange}
              className="country-search-input"
            />
          </div>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div key={country.code} className="country-item" onClick={() => handleCountrySelect(country)}>
                <span className="country-flag-item">{country.flag}</span>
                <span className="country-name">{country.name}</span>
                <span className="country-dial-code">{country.dialCode}</span>
              </div>
            ))
          ) : (
            <div className="no-results">No countries found</div>
          )}
        </div>
      )}
    </div>
    </div>
  )
}

// Date Input Component
function DateInput({ value, onChange, name, required = false, disabled = false, className = "" }) {
  const [date, setDate] = useState(undefined)
  const [inputValue, setInputValue] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef(null)

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      try {
        // Try to parse the date from the format DD/MM/YYYY
        const parsedDate = parse(value, "dd/MM/yyyy", new Date())
        if (isValid(parsedDate)) {
          setDate(parsedDate)
          setInputValue(format(parsedDate, "dd/MM/yyyy"))
        }
      } catch (error) {
        // If parsing fails, try to create a date object directly
        const dateObj = new Date(value)
        if (isValid(dateObj)) {
          setDate(dateObj)
          setInputValue(format(dateObj, "dd/MM/yyyy"))
        }
      }
    }
  }, [value])

  useEffect(() => {
    // Handle clicks outside the calendar
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Try to parse the input as a date
    if (newValue.length === 10) {
      // DD/MM/YYYY format has 10 characters
      try {
        const parsedDate = parse(newValue, "dd/MM/yyyy", new Date())
        if (isValid(parsedDate)) {
          setDate(parsedDate)
          onChange(newValue)
        }
      } catch (error) {
        // Invalid date format, don't update the date state
      }
    }
  }

  const handleInputBlur = () => {
    // If the input is empty or invalid, reset it to the current date value
    if (!inputValue || !date) {
      setInputValue(date ? format(date, "dd/MM/yyyy") : "")
    }
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    const formattedDate = format(selectedDate, "dd/MM/yyyy")
    setInputValue(formattedDate)
    onChange(formattedDate)
    setShowCalendar(false)
  }

  // Simple calendar component
  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(date || new Date())
    const [selectedDate, setSelectedDate] = useState(date)

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const selectDate = (day) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      setSelectedDate(newDate)
      handleDateSelect(newDate)
    }

    const days = []
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-empty-day"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        (selectedDate.getFullYear() === currentMonth.getFullYear) === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "calendar-day-selected" : ""}`}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="client-wrapper">
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav-button">
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="calendar-title">{format(currentMonth, "MMMM yyyy")}</div>
          <button onClick={nextMonth} className="calendar-nav-button">
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div className="calendar-grid">
          {dayNames.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="client-wrapper">
    <div className={`date-input-container ${className}`}>
      <div className="date-input-wrapper">
        <input
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="DD/MM/YYYY"
          required={required}
          disabled={disabled}
          className="date-input"
        />
        <button
          type="button"
          className="calendar-button"
          onClick={() => setShowCalendar(!showCalendar)}
          disabled={disabled}
        >
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
        </button>
      </div>
      {showCalendar && (
        <div ref={calendarRef} className="calendar-popup">
          <Calendar />
        </div>
      )}
    </div>
    </div>
  )
}

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
    <div className="client-wrapper">
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
    </div>
  )
}

// Client Data Form Component
function ClientDataForm({ onSave, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    // Basic Company Details
    companyName: "",
    bdMembersName: "",
    address: "",
    country: "",
    pinCode: "",
    city: "",
    state: "",
    industry: "",
    subIndustry: "",
    website: "",
    gstNumber: "",
    establishmentYear: "",
    numberOfEmployees: "",

    // Contact Person
    contactPersonName: "",
    contactDesignation: "",
    contactPhone: "",
    contactEmail: "",

    // Additional Person
    additionalName: "",
    additionalDesignation: "",
    additionalPhone: "",
    additionalLandline: "",
    additionalEmail: "",

    // Business Information
    placementFees: "",
    creditPeriod: "",
    replacementPeriod: "",
    companyStatus: "",
    status: "",
    directorNames: [""],

    // Franchise & Team Details
    teamLeader: "",
    franchiseeName: "",
    dateClientAcquired: "",
    dateOfClientAllocation: "",
    reallocationStatus: "No",
    dateOfClientReallocation: "",
    newFranchisee: "",
    newTeamLeader: "",
  })

  const [showReallocationFields, setShowReallocationFields] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      // Make sure directorNames is an array
      const directorNamesArray = Array.isArray(initialData.directorNames)
        ? initialData.directorNames
        : initialData.directorNames
          ? [initialData.directorNames]
          : [""]

      setFormData({
        ...initialData,
        directorNames: directorNamesArray.length > 0 ? directorNamesArray : [""],
      })
      setShowReallocationFields(initialData.reallocationStatus === "Yes")
    }
  }, [initialData])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "companyName" || name === "contactPersonName" || name === "additionalName") {
      // Capitalize first letter of each word
      const capitalizedValue = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      setFormData({ ...formData, [name]: capitalizedValue })
    } else if (name === "gstNumber") {
      // Only allow 15 digits for GST
      if (value.length <= 15) {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    if (name === "reallocationStatus") {
      setShowReallocationFields(value === "Yes")

      // Clear reallocation fields if "No" is selected
      if (value === "No") {
        setFormData({
          ...formData,
          [name]: value,
          dateOfClientReallocation: "",
          newFranchisee: "",
          newTeamLeader: "",
        })
      } else {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Handle phone input changes
  const handlePhoneChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  // Handle date input changes
  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  // Handle pincode input and location fetch
  const handlePincodeChange = (value) => {
    setFormData({ ...formData, pinCode: value })
  }

  const handleLocationFetch = (locationData) => {
    setFormData({
      ...formData,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
    })
  }

  // Handle director names
  const handleDirectorNameChange = (index, value) => {
    const newDirectorNames = [...formData.directorNames]
    newDirectorNames[index] = value
    setFormData({ ...formData, directorNames: newDirectorNames })
  }

  const addDirectorField = () => {
    setFormData({
      ...formData,
      directorNames: [...formData.directorNames, ""],
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const errors = {}

    if (!formData.companyName) errors.companyName = "Company name is required"
    if (!formData.contactPersonName) errors.contactPersonName = "Contact person name is required"
    if (!formData.contactPhone) errors.contactPhone = "Contact phone is required"
    if (!formData.contactEmail) errors.contactEmail = "Contact email is required"

    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      errors.gstNumber = "GST Number must be 15 characters"
    }

    if (showReallocationFields) {
      if (!formData.dateOfClientReallocation) errors.dateOfClientReallocation = "Reallocation date is required"
      if (!formData.newFranchisee) errors.newFranchisee = "New franchisee is required"
      if (!formData.newTeamLeader) errors.newTeamLeader = "New team leader is required"
    }

    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      onSave(formData)
    }
  }

  return (
    <div className="client-wrapper">
      <div className="form-container">
        <div className="form-wrapper">
          <div className="form-header">
            <button onClick={onCancel} className="back-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className="form-title">Client Data Form</h1>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Company Details */}
            <div className="form-section">
              <h2 className="section-title">Basic Company Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Company Name</div>
                  <input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  {formErrors.companyName && <p className="error-message">{formErrors.companyName}</p>}
                </div>

                <div className="form-group">
                  <div className="form-label">BD Members Name</div>
                  <select
                    id="bdMembersName"
                    name="bdMembersName"
                    value={formData.bdMembersName}
                    onChange={(e) => handleSelectChange("bdMembersName", e.target.value)}
                    className="form-select"
                  >
                    <option>Select BD Member</option>
                    <option>Member 1</option>
                    <option>Member 2</option>
                    <option>Member 3</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Address</div>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">Country</div>
                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!!formData.pinCode}
                    className="form-input disabled"
                    placeholder="Will be auto-filled from pincode"
                  />
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Pin Code</div>
                  <PincodeInput
                    value={formData.pinCode}
                    onChange={handlePincodeChange}
                    onLocationFetch={handleLocationFetch}
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">City</div>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!!formData.pinCode}
                    className="form-input disabled"
                    placeholder="Will be auto-filled from pincode"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">State</div>
                  <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!!formData.pinCode}
                    className="form-input disabled"
                    placeholder="Will be auto-filled from pincode"
                  />
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Industry</div>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={(e) => handleSelectChange("industry", e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="Technology & IT Services">Technology & IT Services</option>
                    <option value="Advertising, Media and Entertainment">Advertising, Media and Entertainment</option>
                    <option value="Construction, Real Estate and Infrastructure">
                      Construction, Real Estate and Infrastructure
                    </option>
                    <option value="Manufacturing & Industrial Services">Manufacturing & Industrial Services</option>
                    <option value="Healthcare, Biotechnology & Pharmaceuticals">
                      Healthcare, Biotechnology & Pharmaceuticals
                    </option>
                    <option value="Businesses & Professional Services">Businesses & Professional Services</option>
                    <option value="Retail, Consumer Goods and Lifestyle">Retail, Consumer Goods and Lifestyle</option>
                    <option value="Energy, Power and Environmental Services">
                      Energy, Power and Environmental Services
                    </option>
                    <option value="Education and Training">Education and Training</option>
                    <option value="Travel, Hospitality and Logistics">Travel, Hospitality and Logistics</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                    <option value="Agriculture & Natural Resources">Agriculture & Natural Resources</option>
                    <option>Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label">Sub Industry</div>
                  <select
                    id="subIndustry"
                    name="subIndustry"
                    value={formData.subIndustry}
                    onChange={(e) => handleSelectChange("subIndustry", e.target.value)}
                    className="form-select"
                  >
                    <option>Select</option>
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
                  <div className="form-label">Website</div>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">GST Number (verified)</div>
                  <input
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    maxLength={15}
                    required
                    className="form-input"
                  />
                  {formErrors.gstNumber && <p className="error-message">{formErrors.gstNumber}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Establishment Year</div>
                  <input
                    id="establishmentYear"
                    name="establishmentYear"
                    value={formData.establishmentYear}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter establishment year"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">No of Employees</div>
                  <input
                    id="numberOfEmployees"
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person in company */}
            <div className="form-section">
              <h2 className="section-title">Contact Person in company</h2>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Contact person name</div>
                  <input
                    id="contactPersonName"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  {formErrors.contactPersonName && <p className="error-message">{formErrors.contactPersonName}</p>}
                </div>

                <div className="form-group">
                  <div className="form-label">Designation</div>
                  <input
                    id="contactDesignation"
                    name="contactDesignation"
                    value={formData.contactDesignation}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Phone number</div>
                  <PhoneInput
                    value={formData.contactPhone}
                    onChange={(value) => handlePhoneChange("contactPhone", value)}
                  />
                  {formErrors.contactPhone && <p className="error-message">{formErrors.contactPhone}</p>}
                </div>

                <div className="form-group">
                  <div className="form-label">Email ID</div>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  {formErrors.contactEmail && <p className="error-message">{formErrors.contactEmail}</p>}
                </div>
              </div>
            </div>

            {/* Additional Person in company */}
            <div className="form-section">
              <h2 className="section-title">Additional Person in company</h2>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Name of person</div>
                  <input
                    id="additionalName"
                    name="additionalName"
                    value={formData.additionalName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">Designation</div>
                  <input
                    id="additionalDesignation"
                    name="additionalDesignation"
                    value={formData.additionalDesignation}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">Phone number</div>
                  <PhoneInput
                    value={formData.additionalPhone}
                    onChange={(value) => handlePhoneChange("additionalPhone", value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Landline number</div>
                  <input
                    id="additionalLandline"
                    name="additionalLandline"
                    value={formData.additionalLandline}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">Email ID</div>
                  <input
                    id="additionalEmail"
                    name="additionalEmail"
                    type="email"
                    value={formData.additionalEmail}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="form-section">
              <h2 className="section-title">Business Information</h2>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Placement Fees</div>
                  <select
                    id="placementFees"
                    name="placementFees"
                    value={formData.placementFees}
                    onChange={(e) => handleSelectChange("placementFees", e.target.value)}
                    className="form-select"
                  >
                    <option>Select</option>
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
                  <div className="form-label">Credit Period</div>
                  <select
                    id="creditPeriod"
                    name="creditPeriod"
                    value={formData.creditPeriod}
                    onChange={(e) => handleSelectChange("creditPeriod", e.target.value)}
                    className="form-select"
                  >
                    <option>Select</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>90</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label">Replacement Period</div>
                  <select
                    id="replacementPeriod"
                    name="replacementPeriod"
                    value={formData.replacementPeriod}
                    onChange={(e) => handleSelectChange("replacementPeriod", e.target.value)}
                    className="form-select"
                  >
                    <option>Select</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>90</option>
                  </select>
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Company Status</div>
                  <select
                    id="companyStatus"
                    name="companyStatus"
                    value={formData.companyStatus}
                    onChange={(e) => handleSelectChange("companyStatus", e.target.value)}
                    className="form-select"
                  >
                    <option>Select</option>
                    <option>MNC</option>
                    <option>Start Up</option>
                    <option>MSME</option>
                    <option>SME</option>
                    <option>GCC</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label">Status</div>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleSelectChange("status", e.target.value)}
                    className="form-select"
                  >
                    <option>Select Status</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="form-label">Director Name</div>
                <div className="director-list">
                  {formData.directorNames.map((name, index) => (
                    <div key={index} className="director-item">
                      <input
                        value={name}
                        onChange={(e) => handleDirectorNameChange(index, e.target.value)}
                        placeholder="Director name"
                        className="form-input"
                      />
                      {index === formData.directorNames.length - 1 && (
                        <button type="button" className="add-director-button" onClick={addDirectorField}>
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
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Franchise & Team Details */}
            <div className="form-section">
              <h2 className="section-title">Franchise & Team Details</h2>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Team Leader</div>
                  <select
                    id="teamLeader"
                    name="teamLeader"
                    value={formData.teamLeader}
                    onChange={(e) => handleSelectChange("teamLeader", e.target.value)}
                    className="form-select"
                  >
                    <option>Select Team Leader</option>
                    <option>Leader 1</option>
                    <option>Leader 2</option>
                    <option>Leader 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label">Franchisee Name</div>
                  <select
                    id="franchiseeName"
                    name="franchiseeName"
                    value={formData.franchiseeName}
                    onChange={(e) => handleSelectChange("franchiseeName", e.target.value)}
                    className="form-select"
                  >
                    <option>Select Franchisee</option>
                    <option>Franchise 1</option>
                    <option>Franchise 2</option>
                    <option>Franchise 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label">Date Client Acquired</div>
                  <DateInput
                    name="dateClientAcquired"
                    value={formData.dateClientAcquired}
                    onChange={(value) => handleDateChange("dateClientAcquired", value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div className="form-label">Date of Client Allocation</div>
                  <DateInput
                    name="dateOfClientAllocation"
                    value={formData.dateOfClientAllocation}
                    onChange={(value) => handleDateChange("dateOfClientAllocation", value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">Reallocation Status</div>
                  <select
                    id="reallocationStatus"
                    name="reallocationStatus"
                    value={formData.reallocationStatus}
                    onChange={(e) => handleSelectChange("reallocationStatus", e.target.value)}
                    className="form-select"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {showReallocationFields && (
                  <div className="form-group">
                    <div className="form-label">Date of Client Reallocation</div>
                    <DateInput
                      name="dateOfClientReallocation"
                      value={formData.dateOfClientReallocation}
                      onChange={(value) => handleDateChange("dateOfClientReallocation", value)}
                      required={showReallocationFields}
                    />
                    {formErrors.dateOfClientReallocation && (
                      <p className="error-message">{formErrors.dateOfClientReallocation}</p>
                    )}
                  </div>
                )}
              </div>

              {showReallocationFields && (
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-label">New Franchisee</div>
                    <select
                      id="newFranchisee"
                      name="newFranchisee"
                      value={formData.newFranchisee}
                      onChange={(e) => handleSelectChange("newFranchisee", e.target.value)}
                      className="form-select"
                    >
                      <option>Select New Franchisee</option>
                      <option>Franchise 1</option>
                      <option>Franchise 2</option>
                      <option>Franchise 3</option>
                    </select>
                    {formErrors.newFranchisee && <p className="error-message">{formErrors.newFranchisee}</p>}
                  </div>

                  <div className="form-group">
                    <div className="form-label">New Team Leader</div>
                    <select
                      id="newTeamLeader"
                      name="newTeamLeader"
                      value={formData.newTeamLeader}
                      onChange={(e) => handleSelectChange("newTeamLeader", e.target.value)}
                      className="form-select"
                    >
                      <option>Select New Team Leader</option>
                      <option>Leader 1</option>
                      <option>Leader 2</option>
                      <option>Leader 3</option>
                    </select>
                    {formErrors.newTeamLeader && <p className="error-message">{formErrors.newTeamLeader}</p>}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button type="button" onClick={onCancel} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

