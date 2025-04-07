"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit, Download, FileText } from "lucide-react"
import "./expenditure.css"

// API URL - replace with your actual backend URL
const API_URL = "http://localhost:8080/api"

const ExpenditureTable = () => {
  // State for table data
  const [data, setData] = useState([])

  // State for dropdown options
  const [vendors, setVendors] = useState([])
  const [expenseHeads, setExpenseHeads] = useState([])

  // State for editing and filtering
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [vendorFilter, setVendorFilter] = useState("")
  const [expenseHeadFilter, setExpenseHeadFilter] = useState("")

  // State for direct input value
  const [inputAmount, setInputAmount] = useState("")

  // State for loading and error handling
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Debug state to track data changes
  const [debug, setDebug] = useState({
    lastAction: "",
    lastData: null,
  })

  // Fetch vendors, expense heads, and expenditure data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch vendors
        const vendorsResponse = await fetch(`${API_URL}/vendors`)
        if (!vendorsResponse.ok) {
          throw new Error("Failed to fetch vendors")
        }
        const vendorsData = await vendorsResponse.json()
        setVendors(vendorsData)

        // Fetch expense heads
        const expenseHeadsResponse = await fetch(`${API_URL}/expense-heads`)
        if (!expenseHeadsResponse.ok) {
          throw new Error("Failed to fetch expense heads")
        }
        const expenseHeadsData = await expenseHeadsResponse.json()
        setExpenseHeads(expenseHeadsData)

        // Fetch expenditure data
        const expendituresResponse = await fetch(`${API_URL}/expenditures`)
        if (!expendituresResponse.ok) {
          throw new Error("Failed to fetch expenditures")
        }
        const expendituresData = await expendituresResponse.json()

        // Update the table data with expenditures
        if (expendituresData && expendituresData.length > 0) {
          setData(expendituresData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to check if an item has a numeric database ID
  const isExistingDatabaseItem = (id) => {
    return (
      typeof id === "number" ||
      (typeof id === "string" && !isNaN(Number.parseInt(id)) && !id.startsWith("vendor-") && !id.startsWith("new-"))
    )
  }

  // Handle edit mode toggle
  const handleEdit = (id) => {
    if (editId === id) {
      // If already in edit mode, exit edit mode
      setEditId(null)
      setInputAmount("")
    } else {
      // Enter edit mode
      setEditId(id)
      // Set the input amount to the current amount of the item
      const item = data.find((item) => item.id === id)
      setInputAmount(item?.amount || "")
    }
  }

  // Handle direct amount input
  const handleAmountChange = (e) => {
    const value = e.target.value
    // Validate input to allow only numbers and decimal point
    if (!/^[0-9]*\.?[0-9]*$/.test(value) && value !== "") return

    setInputAmount(value)

    // Update the data state
    if (editId) {
      const updatedData = data.map((item) => {
        if (item.id === editId) {
          // Create a new item with the updated amount
          const amount = value === "" ? "" : value
          const updatedItem = { ...item, amount }

          // If we have a vendor ID and a valid amount, calculate GST, TDS, and net
          if (updatedItem.vendorId && amount && amount !== "") {
            // For immediate visual feedback, calculate directly
            const numAmount = Number.parseFloat(amount)
            // Find the vendor to get rates
            const vendor = vendors.find((v) => v.id === updatedItem.vendorId)
            if (vendor) {
              const gstRate = vendor.gstRate || 0
              const tdsRate = vendor.tdsRate || 0

              updatedItem.gst = ((numAmount * gstRate) / 100).toFixed(2)
              updatedItem.tds = ((numAmount * tdsRate) / 100).toFixed(2)
              updatedItem.net = (numAmount + (numAmount * gstRate) / 100 - (numAmount * tdsRate) / 100).toFixed(2)
            }

            // Also call the API for official calculation
            calculateAmounts(updatedItem.vendorId, amount, editId)
          } else {
            // Clear GST, TDS, and net if amount is empty
            updatedItem.gst = ""
            updatedItem.tds = ""
            updatedItem.net = ""
          }

          return updatedItem
        }
        return item
      })

      setData(updatedData)

      // Debug
      setDebug({
        lastAction: "handleAmountChange",
        lastData: updatedData.find((item) => item.id === editId),
      })
    }
  }

  // Handle field changes
  const handleChange = async (id, field, value) => {
    // For numeric fields, validate input
    if (field === "amount" || field === "gst" || field === "tds" || field === "net") {
      if (!/^[0-9]*\.?[0-9]*$/.test(value) && value !== "") return
    }

    // Update the data
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // If changing vendor (particulars), store the vendor ID and update expense head
        if (field === "particulars") {
          const selectedVendor = vendors.find((v) => v.vendorName === value)
          if (selectedVendor) {
            updatedItem.vendorId = selectedVendor.id

            // Fetch vendor details to get the expense head
            fetchVendorDetails(selectedVendor.id, id)
          }
        }

        // If changing amount and we have a vendor ID, calculate GST, TDS, and net
        if (field === "amount" && updatedItem.vendorId && value) {
          // Call the calculate endpoint
          calculateAmounts(updatedItem.vendorId, value, id)
        } else if (field === "amount") {
          // Clear GST, TDS, and net if amount is empty
          updatedItem.gst = ""
          updatedItem.tds = ""
          updatedItem.net = ""
        }

        return updatedItem
      }
      return item
    })

    setData(updatedData)

    // Debug
    setDebug({
      lastAction: `handleChange: ${field}`,
      lastData: updatedData.find((item) => item.id === id),
    })
  }

  // Fetch vendor details by ID
  const fetchVendorDetails = async (vendorId, itemId) => {
    try {
      const response = await fetch(`${API_URL}/vendors/${vendorId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch vendor details")
      }

      const vendorDetails = await response.json()

      // Update the item with vendor details
      const updatedData = data.map((item) => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            expenses: vendorDetails.expensesHead || "",
          }

          // If amount is already set, recalculate GST, TDS, and net
          if (item.amount && item.amount !== "") {
            const amount = Number.parseFloat(item.amount)
            updatedItem.gst = ((amount * vendorDetails.gstRate) / 100).toFixed(2)
            updatedItem.tds = ((amount * vendorDetails.tdsRate) / 100).toFixed(2)
            updatedItem.net = (
              amount +
              (amount * vendorDetails.gstRate) / 100 -
              (amount * vendorDetails.tdsRate) / 100
            ).toFixed(2)
          }

          return updatedItem
        }
        return item
      })

      setData(updatedData)

      // Debug
      setDebug({
        lastAction: "fetchVendorDetails",
        lastData: updatedData.find((item) => item.id === itemId),
      })
    } catch (err) {
      console.error("Error fetching vendor details:", err)
    }
  }

  // Calculate GST, TDS, and net amount based on vendor and amount
  const calculateAmounts = async (vendorId, amount, itemId) => {
    console.log("Calculating amounts:", { vendorId, amount, itemId })
    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId, amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate amounts")
      }

      const result = await response.json()
      console.log("Calculation result:", result)

      // Update the item with calculated values
      const updatedData = data.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            amount: amount, // Ensure amount is set
            gst: result.gst.toFixed(2),
            tds: result.tds.toFixed(2),
            net: result.net.toFixed(2),
          }
        }
        return item
      })

      setData(updatedData)

      // Debug
      setDebug({
        lastAction: "calculateAmounts",
        lastData: updatedData.find((item) => item.id === itemId),
      })
    } catch (err) {
      console.error("Error calculating amounts:", err)
    }
  }

  // Handle row deletion
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id))
  }

  // Handle file uploads
  const handleFileUpload = async (id, file) => {
    if (!file) return

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("itemId", id)

      // Upload the file to the server
      const response = await fetch(`${API_URL}/upload-document`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()

      // Update the data with the file URL
      setData(
        data.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              supportingDocument: result.fileUrl,
              supportingDocumentName: file.name,
            }
          }
          return item
        }),
      )

      alert("File uploaded successfully!")
    } catch (err) {
      console.error("Error uploading file:", err)
      alert("Failed to upload file. Please try again.")
    }
  }

  // Handle CSV download
  const handleDownload = () => {
    const csvContent = [
      [
        "SR NO",
        "BILL DATE",
        "PARTICULARS",
        "EXPENSES HEAD",
        "AMOUNT",
        "GST",
        "TDS",
        "NET",
        "SUPPLY BILL NO",
        "PURCHASE NO",
        "SUPPORTING DOCUMENT",
      ],
      ...data.map((item) => [
        item.srNo,
        item.billDate,
        item.particulars,
        item.expenses,
        item.amount,
        item.gst,
        item.tds,
        item.net,
        item.supplyBillNo,
        item.purchaseNo,
        item.supportingDocumentName || "No file",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "expenditure.csv"
    link.click()
  }

  // Open document in new tab
  const openDocument = (url) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  // Calculate totals
  const total = data.reduce(
    (acc, item) => {
      acc.amount += Number.parseFloat(item.amount) || 0
      acc.gst += Number.parseFloat(item.gst) || 0
      acc.tds += Number.parseFloat(item.tds) || 0
      acc.net += Number.parseFloat(item.net) || 0
      return acc
    },
    { amount: 0, gst: 0, tds: 0, net: 0 },
  )

  // Filter data based on search term and filters
  const filteredData = data.filter((item) => {
    // Check if vendor name filter matches
    if (vendorFilter && item.particulars !== vendorFilter) {
      return false
    }

    // Check if expense head filter matches
    if (expenseHeadFilter && item.expenses !== expenseHeadFilter) {
      return false
    }

    // If no search term, return all data
    if (!searchTerm) {
      return true
    }

    const searchTermLower = searchTerm.toLowerCase()

    // Search in all fields
    return Object.keys(item).some((key) => {
      // Skip file objects and id
      if (key === "id" || key === "uploadBill" || key === "documentUpload" || key === "vendorId") {
        return false
      }
      const value = String(item[key] || "").toLowerCase()
      return value.includes(searchTermLower)
    })
  })

  // Add a new row to the table
  const addNewRow = () => {
    const newId = `new-${Date.now()}`
    const newRow = {
      id: newId,
      srNo: `00${data.length + 1}`,
      billDate: "",
      particulars: "",
      vendorId: undefined,
      expenses: "",
      amount: "",
      gst: "",
      tds: "",
      net: "",
      supplyBillNo: "",
      purchaseNo: "",
      supportingDocument: null,
      supportingDocumentName: null,
    }

    setData([...data, newRow])
  }

  // Refresh data from the server
  const refreshData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch expenditure data
      const expendituresResponse = await fetch(`${API_URL}/expenditures`)
      if (!expendituresResponse.ok) {
        throw new Error("Failed to fetch expenditures")
      }

      const expendituresData = await expendituresResponse.json()

      // If we have expenditure data, use it
      if (expendituresData && expendituresData.length > 0) {
        setData(expendituresData)
      } else {
        // If no expenditure data, fetch vendor data to create placeholder rows
        const vendorsResponse = await fetch(`${API_URL}/vendor-details`)
        if (!vendorsResponse.ok) {
          throw new Error("Failed to fetch vendor details")
        }

        const vendorsData = await vendorsResponse.json()

        // Transform vendor data into expenditure format
        const placeholderData = vendorsData.map((vendor, index) => ({
          id: `vendor-${vendor.id}`,
          srNo: `00${index + 1}`,
          billDate: vendor.dateOfRegistration || "",
          particulars: vendor.vendorName,
          vendorId: vendor.id,
          expenses: vendor.expensesHead || "",
          amount: "",
          gst: "",
          tds: "",
          net: "",
          supplyBillNo: `BILL-${vendor.id}`,
          purchaseNo: `PO-${vendor.id}`,
          supportingDocument: null,
          supportingDocumentName: null,
        }))

        setData(placeholderData)
      }

      // Exit edit mode
      setEditId(null)
      setInputAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error refreshing data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Save all data to the backend
  const handleSaveAll = async () => {
    setLoading(true)
    setError(null)

    try {
      // Filter out completely empty rows
      const dataToSave = data.filter((item) => item.billDate || item.particulars || item.expenses || item.amount)

      // Save each item
      for (const item of dataToSave) {
        // Skip vendor placeholder items that haven't been modified
        if (item.id.toString().startsWith("vendor-") && (!item.billDate || !item.amount || item.amount === "")) {
          continue
        }

        // Check if this is an existing database item or a new one
        if (isExistingDatabaseItem(item.id)) {
          // Update existing item
          const response = await fetch(`${API_URL}/expenditures/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          })

          if (!response.ok) {
            throw new Error(`Failed to update item ${item.srNo}`)
          }
        } else {
          // Create new item
          const response = await fetch(`${API_URL}/expenditures`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          })

          if (!response.ok) {
            throw new Error(`Failed to save item ${item.srNo}`)
          }
        }
      }

      alert("All data saved successfully!")

      // Exit edit mode if active
      setEditId(null)
      setInputAmount("")

      // Refresh data to get updated IDs from the server
      refreshData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error saving data:", err)
      alert("Failed to save data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to manually set amount and recalculate
  const setAmountAndCalculate = (id, amount) => {
    const item = data.find((item) => item.id === id)
    if (!item || !item.vendorId) return

    // Update the amount directly
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, amount: amount.toString() }
      }
      return item
    })

    setData(updatedData)

    // Calculate GST, TDS, and NET
    calculateAmounts(item.vendorId, amount, id)

    // Debug
    setDebug({
      lastAction: "setAmountAndCalculate",
      lastData: { id, amount, vendorId: item.vendorId },
    })
  }

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Expenditure</h2>
        <p className="subtitle">All the Invoice Data are listed here</p>

        {/* Show error message if any */}
        {error && <div className="error-message">{error}</div>}

        <div className="filters">
          <select className="select-filter" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
            <option value="">Vendor Name</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.vendorName}>
                {vendor.vendorName}
              </option>
            ))}
          </select>

          <select
            className="select-filter"
            value={expenseHeadFilter}
            onChange={(e) => setExpenseHeadFilter(e.target.value)}
          >
            <option value="">Sub-expense Head</option>
            {expenseHeads.map((head, index) => (
              <option key={index} value={head.expensesHead}>
                {head.expensesHead}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search..."
            className="input-filter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="search-button">Search</button>
        </div>
      </div>

      <div className="table-header">
        <h2 className="table-title">Expenditure</h2>
        <div className="table-actions">
          <button className="save-button" onClick={handleSaveAll} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </button>

          <Download className="download-icon" onClick={handleDownload} />
        </div>
      </div>

      <div className="table-container">
        <table className="expenditure-table">
          <thead>
            <tr className="header-row">
              <th className="header-cell">SR NO</th>
              <th className="header-cell">BILL DATE</th>
              <th className="header-cell">PARTICULARS</th>
              <th className="header-cell">EXPENSES HEAD</th>
              <th className="header-cell">AMOUNT</th>
              <th className="header-cell">GST</th>
              <th className="header-cell">TDS</th>
              <th className="header-cell">NET</th>
              <th className="header-cell">SUPPLY BILL NO</th>
              <th className="header-cell">PURCHASE NO</th>
              <th className="header-cell">UPLOAD BILL</th>
              <th className="header-cell action-column">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="data-row">
                <td className="data-cell bold-text">{item.srNo}</td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <input
                      type="date"
                      value={item.billDate ? item.billDate.split("T")[0] : ""}
                      onChange={(e) => handleChange(item.id, "billDate", e.target.value)}
                      className="edit-input"
                    />
                  ) : item.billDate ? (
                    new Date(item.billDate).toLocaleDateString()
                  ) : (
                    "XXX"
                  )}
                </td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <select
                      value={item.particulars}
                      onChange={(e) => handleChange(item.id, "particulars", e.target.value)}
                      className="edit-input"
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.vendorName}>
                          {vendor.vendorName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.particulars || "XXX"
                  )}
                </td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <select
                      value={item.expenses}
                      onChange={(e) => handleChange(item.id, "expenses", e.target.value)}
                      className="edit-input"
                    >
                      <option value="">Select Expense Head</option>
                      {expenseHeads.map((head, index) => (
                        <option key={index} value={head.expensesHead}>
                          {head.expensesHead}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.expenses || "XXX"
                  )}
                </td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={inputAmount}
                      onChange={handleAmountChange}
                      onBlur={() => {
                        // When input loses focus, ensure the amount is set in the data
                        if (inputAmount) {
                          setAmountAndCalculate(item.id, inputAmount)
                        }
                      }}
                      className="edit-input"
                      placeholder="Enter amount"
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => handleEdit(item.id)} style={{ cursor: "pointer" }}>
                      {item.amount || "XXX"}
                    </div>
                  )}
                </td>
                <td className="data-cell">{item.gst || "XXX"}</td>
                <td className="data-cell">{item.tds || "XXX"}</td>
                <td className="data-cell">{item.net || "XXX"}</td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={item.supplyBillNo}
                      onChange={(e) => handleChange(item.id, "supplyBillNo", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    item.supplyBillNo || "XXX"
                  )}
                </td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={item.purchaseNo}
                      onChange={(e) => handleChange(item.id, "purchaseNo", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    item.purchaseNo || "XXX"
                  )}
                </td>
                <td className="data-cell">
                  {editId === item.id ? (
                    <input
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files
                        if (files && files.length > 0) {
                          handleFileUpload(item.id, files[0])
                        }
                      }}
                      className="file-input"
                    />
                  ) : item.supportingDocument ? (
                    <div className="document-link" onClick={() => openDocument(item.supportingDocument)}>
                      <FileText className="file-icon" size={16} />
                      {item.supportingDocumentName || "View Document"}
                    </div>
                  ) : (
                    "No file"
                  )}
                </td>
                <td className="data-cell action-column">
                  <div className="action-buttons">
                    <Edit className="edit-icon" onClick={() => handleEdit(item.id)} />
                    <Trash2 className="delete-icon" onClick={() => handleDelete(item.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="footer-row">
              <td className="footer-cell" colSpan={4}>
                Total Net Payable
              </td>
              <td className="footer-cell">{total.amount.toFixed(2)}</td>
              <td className="footer-cell">{total.gst.toFixed(2)}</td>
              <td className="footer-cell">{total.tds.toFixed(2)}</td>
              <td className="footer-cell">{total.net.toFixed(2)}</td>
              <td className="footer-cell" colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default ExpenditureTable

