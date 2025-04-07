import axios from 'axios'
import { useState, useEffect } from "react"
import "./vendordata.css"

const Vendor = () => {
  const [showForm, setShowForm] = useState(false)
  const [vendors, setVendors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [currentVendor, setCurrentVendor] = useState({
    id: null,
    vendorName: "",
    address: "",
    registerStatus: "",
    gstNo: "",
    expensesHead: "",
    gstRate: "",
    tdsRate: "",
    dateOfRegistration: "",
    contactName: "",
    contactNumber: "",
    contractEmail: "",
    contactStatus: "",
    contractStartDate: "",
    contractEndDate: "",

  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/vendor');

        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendor:', error);
      }
    };
    fetchVendors();
  }, []);

  // Save vendors to localStorage whenever vendors state changes
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors))
  }, [vendors])

  const handleAddVendor = () => {
    setCurrentVendor({
      id: null,
      vendorName: "",
      address: "",
      registerStatus: "",
      gstNo: "",
      expensesHead: "",
      gstRate: "",
      tdsRate: "",
      dateOfRegistration: "",
      contactName: "",
    contactNumber: "",
    contractEmail: "",
    contactStatus: "",
    contractStartDate: "",
    contractEndDate: "",

    })
    setIsEditing(false)
    setShowForm(true)
  }

  const handleEditVendor = (vendor) => {
    setCurrentVendor(vendor)
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDeleteVendor = async () => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        
        window.location.reload();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentVendor({
      ...currentVendor,
      [name]: value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!currentVendor.vendorName || !currentVendor.address) {
      alert("Vendor Name and Address are required!")
      return
    }
    const cleanedVendor = {
      ...currentVendor,
      gstRate: typeof currentVendor.gstRate === 'string'
        ? parseFloat(currentVendor.gstRate.replace('%', '').trim()) || 0
        : currentVendor.gstRate,
      tdsRate: typeof currentVendor.tdsRate === 'string'
        ? parseFloat(currentVendor.tdsRate.replace('%', '').trim()) || 0
        : currentVendor.tdsRate,
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/vendor/${currentVendor.id}`, cleanedVendor);
      } else {
        await axios.post('http://localhost:8080/vendor', cleanedVendor);
        
      }
      setShowForm(false);
      window.location.reload();  // Refresh the page to get updated data
    } catch (error) {
      alert(`Error saving vendor: ${error.response?.data || error.message}`);
      console.error('Error saving vendor:', error);
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (e) => {
    setSortBy(e.target.value)
  }

  const handleDownloadCSV = () => {
    // Define CSV headers
    const headers = [
      "Vendor Name",
      "Address",
      "Register Status",
      "GST No.",
      "Expenses Head",
      "GST Rate",
      "TDS Rate",
      "Date of Registration",
      "Contact Name",
      "Contact Number",
      "Contact Email",
      "Contact Status",
      "Contract Start Date",
      "Contract End Date",

    ]

    // Convert vendor data to CSV format
    const csvData = vendors.map((vendor) => [
      vendor.vendorName || "",
      vendor.address || "",
      vendor.registerStatus || "",
      vendor.gstNo || "",
      vendor.expensesHead || "",
      vendor.gstRate || "",
      vendor.tdsRate || "",
      vendor.dateOfRegistration || "",
      vendor.contactName || "",
      vendor.contactNumber || "",
      vendor.contractEmail || "",
      vendor.contactStatus || "",
      vendor.contractStartDate || "",
      vendor.contractEndDate || "",

    ])

    // Add headers to the beginning
    csvData.unshift(headers)

    // Convert to CSV string
    const csvString = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Create a blob and download link
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "vendor_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.registerStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.expensesHead.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort vendors based on sort option
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (!sortBy) return 0

    switch (sortBy) {
      case "name":
        return a.vendorName.localeCompare(b.vendorName)
      case "address":
        return a.address.localeCompare(b.address)
      case "status":
        return a.registerStatus.localeCompare(b.registerStatus)
      case "gst":
        return a.gstNo.localeCompare(b.gstNo)
      case "expenses":
        return a.expensesHead.localeCompare(b.expensesHead)
      default:
        return 0
    }
  })

  return (
    <div className="vendor-container">
      {!showForm ? (
        // Vendor Listing Page
        <div className="vendor-listing">
          <div className="vendor-header">
            <div className="vendor-title">
              <h1>Vendor Data</h1>
              <p>All the company clients are listed here</p>
            </div>
          </div>

          <div className="vendor-filters">
            <div className="filters-left">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <div className="sort-container">
                <select value={sortBy} onChange={handleSort} className="sort-select">
                  <option value="">Sort by</option>
                  <option value="name">Vendor Name</option>
                  <option value="address">Address</option>
                  <option value="status">Register Status</option>
                  <option value="gst">GST No.</option>
                  <option value="expenses">Expenses Head</option>
                </select>
              </div>
            </div>

            <button className="add-vendor-btn" onClick={handleAddVendor}>
              <span>+</span> Add Vendor
            </button>
          </div>

          <div className="vendor-table-container">
            <div className="vendor-table-header">
              <h2>Vendor Data</h2>
              <button className="download-btn" onClick={handleDownloadCSV}>
                ↓
              </button>
            </div>

            <table className="vendor-table">
              <thead>
                <tr>
                  <th>VENDOR NAME</th>
                  <th>ADDRESS</th>
                  <th>REGISTER STATUS</th>
                  <th>GST NO.</th>
                  <th>EXPENSES HEAD</th>
                  <th>GST RATE</th>
                  <th>TDS RATE</th>
                  <th>DATE OF REG.</th>
                  <th>CONTACT NAME</th>
                  <th>CONTACT Number</th>
                  <th>CONTRACT Email</th>
                  <th>CONTACT status</th>
                  <th>CONTRACT Start Date</th>
                  <th>CONTRACT End Date</th>


                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {sortedVendors.length > 0 ? (
                  sortedVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>{vendor.vendorName || "XXX"}</td>
                      <td>{vendor.address || "XXX"}</td>
                      <td>{vendor.registerStatus || "XXX"}</td>
                      <td>{vendor.gstNo || "XXX"}</td>
                      <td>{vendor.expensesHead || "XXX"}</td>
                      <td>{vendor.gstRate || "XXX"}</td>
                      <td>{vendor.tdsRate || "XXX"}</td>
                      <td>{vendor.dateOfRegistration || "XXX"}</td>
                      <td>{vendor.contactName || "XXX"}</td>
                      <td>{vendor.contactStatus || "XXX"}</td>

                      <td className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEditVendor(vendor)} title="Edit">
                          ✏️
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteVendor(vendor.id)} title="Delete">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No vendors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {vendors.length === 0 && (
              <div className="add-vendor-placeholder">
                <button onClick={handleAddVendor} className="add-vendor-placeholder-btn">
                  <span>+</span> Click here to add Vendor Data
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Vendor Form Page
        <div className="vendor-form-container">
          <div className="vendor-form-header">
            <button className="back-btn" onClick={() => setShowForm(false)}>
              &lt;
            </button>
            <h1>Vendor Data</h1>
          </div>

          <div className="vendor-form-content">
            {/* <div className="vendor-form-title">
              <h2>Vendor Data Information</h2>
              <button className="info-btn">i</button>
            </div> */}

            <form onSubmit={handleSubmit} className="vendor-form">
              <div className="form-group full-width">
                <label htmlFor="vendorName">Vendor Name</label>
                <input
                  type="text"
                  id="vendorName"
                  name="vendorName"
                  value={currentVendor.vendorName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={currentVendor.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registerStatus">Register Status</label>
                  <select
                    id="registerStatus"
                    name="registerStatus"
                    value={currentVendor.registerStatus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Registered">Registered</option>
                    <option value="Unregistered">Unregistered</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="gstNo">GST No.</label>
                  <input type="text" id="gstNo" name="gstNo" value={currentVendor.gstNo} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="expensesHead">Expenses Head</label>
                  <input
                    type="text"
                    id="expensesHead"
                    name="expensesHead"
                    value={currentVendor.expensesHead}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gstRate">GST Rate</label>
                  <select id="gstRate" name="gstRate" value={currentVendor.gstRate} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="5">5</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="28">28</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tdsRate">TDS Rate</label>
                  <select id="tdsRate" name="tdsRate" value={currentVendor.tdsRate} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="0%">0</option>
                    <option value="1%">1</option>
                    <option value="2%">2</option>
                    <option value="10%">10</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfRegistration">Date of Registration</label>
                  <input
                    type="date"
                    id="dateOfRegistration"
                    name="dateOfRegistration"
                    value={currentVendor.dateOfRegistration}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                </div>
                <h3 className="form-section-title">Contract Person Details</h3>
                <div className="form-row">
                <div className="form-group">

                
              
               
                  <label htmlFor="contactName">Contract Person Name</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={currentVendor.contactName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={currentVendor.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contractEmail"> Email</label>
                  <input
                    type="email"
                    id="contractEmail"
                    name="contractEmail"
                    value={currentVendor.contractEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactStatus">Contact Status</label>
                  <select
                    id="contactStatus"
                    name="contactStatus"
                    value={currentVendor.contactStatus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contractStartDate">Contract Start Date</label>
                  <input
                    type="date"
                    id="contractStartDate"
                    name="contractStartDate"
                    value={currentVendor.contractStartDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contractEndDate">Contract End Date</label>
                  <input
                    type="date"
                    id="contractEndDate"
                    name="contractEndDate"
                    value={currentVendor.contractEndDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              



             

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vendor