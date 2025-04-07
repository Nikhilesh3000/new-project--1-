"use client"

import { useState } from "react"
import { FiTrash, FiEdit, FiDownload, FiPlus } from "react-icons/fi"
import "./Taxation.css"

const TaxationScreen = () => {
  const [activeTab, setActiveTab] = useState("incomeTax")

  // Year Selectors
  const [selectedYearNewRegime, setSelectedYearNewRegime] = useState("FY 2022-23")
  const [selectedYearDeductions, setSelectedYearDeductions] = useState("FY 2025-26")
  const [selectedYearGST, setSelectedYearGST] = useState("FY 2022-23")

  // 1) New Regime Data States
  const [newRegimeColumns, setNewRegimeColumns] = useState(["From", "To", "Tax Rate%"])
  const [newRegimeData, setNewRegimeData] = useState(Array.from({ length: 6 }, () => ["", "", ""]))

  // 2) Deductions & Exemptions
  const [deductionColumns, setDeductionColumns] = useState(["Deduction Type", "Amount (₹)", "Applicable Condition"])
  const [deductionData, setDeductionData] = useState(Array.from({ length: 4 }, () => ["", "", ""]))

  // 3) GST
  const [gstColumns, setGstColumns] = useState([
    "INCOME / EXP HEAD",
    "GST RATE",
    "HSN CODE",
    "VENDOR STATUS",
    "TDS RATE",
    "THRESHOLD FOR GST",
  ])
  const [gstData, setGstData] = useState(Array.from({ length: 6 }, () => ["", "", "", "", "", ""]))

  // 4) TDS
  const [tdsColumns, setTdsColumns] = useState(["SECTION", "NATURE OF PAYMENT", "THRESHOLD LIMIT", "TDS RATE"])
  const [tdsData, setTdsData] = useState(Array.from({ length: 3 }, () => ["", "", "", ""]))

  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [editTable, setEditTable] = useState(null)
  const [editRowIndex, setEditRowIndex] = useState(null)

  // Add Item States
  const [showAddItemFormNewRegime, setShowAddItemFormNewRegime] = useState(false)
  const [newItemNewRegime, setNewItemNewRegime] = useState(Array(newRegimeColumns.length).fill(""))

  const [showAddItemFormDeductions, setShowAddItemFormDeductions] = useState(false)
  const [newItemDeductions, setNewItemDeductions] = useState(Array(deductionColumns.length).fill(""))

  const [showAddItemFormGST, setShowAddItemFormGST] = useState(false)
  const [newItemGST, setNewItemGST] = useState(Array(gstColumns.length).fill(""))

  const [showAddItemFormTDS, setShowAddItemFormTDS] = useState(false)
  const [newItemTDS, setNewItemTDS] = useState(Array(tdsColumns.length).fill(""))

  // Add Column
  const addColumn = (table) => {
    if (table === "newRegime") {
      const colName = `New Column ${newRegimeColumns.length + 1}`
      setNewRegimeColumns((prev) => [...prev, colName])
      setNewRegimeData((prev) => prev.map((row) => [...row, ""]))
    } else if (table === "deductions") {
      const colName = `New Column ${deductionColumns.length + 1}`
      setDeductionColumns((prev) => [...prev, colName])
      setDeductionData((prev) => prev.map((row) => [...row, ""]))
    } else if (table === "gst") {
      const colName = `New Column ${gstColumns.length + 1}`
      setGstColumns((prev) => [...prev, colName])
      setGstData((prev) => prev.map((row) => [...row, ""]))
    } else if (table === "tds") {
      const colName = `New Column ${tdsColumns.length + 1}`
      setTdsColumns((prev) => [...prev, colName])
      setTdsData((prev) => prev.map((row) => [...row, ""]))
    }
  }

  // Delete Row
  const deleteRow = (table, rowIndex) => {
    if (table === "newRegime") {
      if (newRegimeData.length > 1) {
        setNewRegimeData((prev) => prev.filter((_, idx) => idx !== rowIndex))
      }
    } else if (table === "deductions") {
      if (deductionData.length > 1) {
        setDeductionData((prev) => prev.filter((_, idx) => idx !== rowIndex))
      }
    } else if (table === "gst") {
      if (gstData.length > 1) {
        setGstData((prev) => prev.filter((_, idx) => idx !== rowIndex))
      }
    } else if (table === "tds") {
      if (tdsData.length > 1) {
        setTdsData((prev) => prev.filter((_, idx) => idx !== rowIndex))
      }
    }
  }
  ;<div class="button-container">
    <button class="download-btn">⬇</button>
    <button class="add-btn">+ Add Item</button>
  </div>

  // Edit Toggling
  const toggleEdit = (table, rowIndex) => {
    setEditTable(table)
    setEditRowIndex(rowIndex)

    let rowData = {}
    if (table === "newRegime") {
      rowData = newRegimeData[rowIndex]
    } else if (table === "deductions") {
      rowData = deductionData[rowIndex]
    } else if (table === "gst") {
      rowData = gstData[rowIndex]
    } else if (table === "tds") {
      rowData = tdsData[rowIndex]
    }

    setEditFormData(rowData)
    setShowEditForm(true)
  }

  // Download as CSV
  const handleDownload = (table) => {
    let columns, data, filename

    if (table === "newRegime") {
      columns = newRegimeColumns
      data = newRegimeData
      filename = "NewRegime.csv"
    } else if (table === "deductions") {
      columns = deductionColumns
      data = deductionData
      filename = "Deductions.csv"
    } else if (table === "gst") {
      columns = gstColumns
      data = gstData
      filename = "GST.csv"
    } else if (table === "tds") {
      columns = tdsColumns
      data = tdsData
      filename = "TDS.csv"
    }

    // Convert data to CSV string
    const csvRows = []
    csvRows.push(columns.join(","))

    data.forEach((row) => {
      csvRows.push(row.map((cell) => `"${cell}"`).join(","))
    })

    const csvString = csvRows.join("\n")

    // Create blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }

  // Render Table
  const renderTable = (tableName, columns, data) => {
    // For Income Tax section, show static data for specific years
    let displayData = data

    if (tableName === "newRegime" && selectedYearNewRegime === "FY 2023-24") {
      displayData = [
        ["0", "300,000", "0%"],
        ["300,001", "600,000", "5%"],
        ["600,001", "900,000", "10%"],
        ["900,001", "1,200,000", "15%"],
        ["1,200,001", "1,500,000", "20%"],
        ["1,500,001", "Above", "30%"],
      ]
    } else if (tableName === "newRegime" && selectedYearNewRegime === "FY 2024-25") {
      displayData = [
        ["0", "300,000", "0%"],
        ["300,001", "600,000", "5%"],
        ["600,001", "900,000", "10%"],
        ["900,001", "1,200,000", "15%"],
        ["1,200,001", "1,500,000", "20%"],
        ["1,500,001", "Above", "30%"],
      ]
    } else if (tableName === "deductions" && selectedYearDeductions === "FY 2023-24") {
      displayData = [
        ["Section 80C", "₹1,50,000", "Investment in specified instruments"],
        ["Section 80D", "₹25,000", "Health Insurance Premium"],
        ["Section 80G", "100% or 50%", "Donations to charitable institutions"],
        ["Section 80TTA", "₹10,000", "Interest on savings account"],
      ]
    } else if (tableName === "deductions" && selectedYearDeductions === "FY 2024-25") {
      displayData = [
        ["Section 80C", "₹1,50,000", "Investment in specified instruments"],
        ["Section 80D", "₹50,000", "Health Insurance Premium"],
        ["Section 80G", "100% or 50%", "Donations to charitable institutions"],
        ["Section 80TTA", "₹10,000", "Interest on savings account"],
      ]
    } else if (tableName === "gst" && selectedYearGST === "FY 2023-24") {
      displayData = [
        ["Advertisement", "18%", "18%", "1%", "2%", "75000"],
        ["Business Development", "18%", "1%", "1%", "2%", "75000"],
        ["Printing And Stationary", "18%", "18%", "1%", "2%", "75000"],
        ["Vendor Charges", "18%", "18%", "1%", "2%", "75000"],
        ["Hotel", "0%", "18%", "0%", "0%", "75000"],
        ["Airline", "5%", "18%", "0%", "0%", "75000"],
      ]
    } else if (tableName === "gst" && selectedYearGST === "FY 2024-25") {
      displayData = [
        ["Advertisement", "18%", "18%", "1%", "2%", "75000"],
        ["Business Development", "18%", "1%", "1%", "2%", "75000"],
        ["Printing And Stationary", "18%", "18%", "1%", "2%", "75000"],
        ["Vendor Charges", "18%", "18%", "1%", "2%", "75000"],
        ["Hotel", "0%", "18%", "0%", "0%", "75000"],
        ["Airline", "5%", "18%", "0%", "0%", "75000"],
      ]
    } else if (tableName === "tds" && selectedYearGST === "FY 2023-24") {
      displayData = [
        ["192", "Salary (for individuals)", "As per slab", "As per slab"],
        ["194A", "Interest (Banks & Others)", "₹40,000 (₹50,000 for senior citizens)", "10%"],
        ["194C", "Payment to Contractors", "₹30,000 / ₹1,00,000", "1% / 2%"],
        ["194H", "Commission or Brokerage", "₹15,000", "5%"],
        ["194I", "Rent (Land/Building)", "₹2,40,000", "10%"],
        ["194J", "Professional Fees", "₹30,000", "10% / 5%"],
        ["194Q", "Purchase of Goods", "₹50,00,000", "0.1%"],
        ["206C(1H)", "Sale of Goods", "₹50,00,000", "0.1%"]
        
      ]
    } else if (tableName === "tds" && selectedYearGST === "FY 2024-25") {
      displayData = [
        ["192", "Salary (for individuals)", "As per slab", "As per slab"],
["194A", "Interest (Banks & Others)", "₹40,000 (₹50,000 for senior citizens)", "10%"],
["194C", "Payment to Contractors", "₹30,000 / ₹1,00,000", "1% / 2%"],
["194H", "Commission or Brokerage", "₹15,000", "5%"],
["194I", "Rent (Land/Building)", "₹2,40,000", "10%"],
["194J", "Professional Fees", "₹30,000", "10% / 5%"],
["194Q", "Purchase of Goods", "₹50,00,000", "0.1%"],
["206C(1H)", "Sale of Goods", "₹50,00,000", "0.1%"]

      ]
    }

    return (
      <table>
        <thead>
          <tr>
            {columns.map((col, colIndex) => (
              <th key={colIndex}>{col}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>{cell}</td>
              ))}
              <td style={{ whiteSpace: "nowrap" }}>
                <FiEdit
                  className="icon"
                  style={{ marginRight: "10px" }}
                  onClick={() => toggleEdit(tableName, rowIndex)}
                />
                <FiTrash className="icon" onClick={() => deleteRow(tableName, rowIndex)} />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={columns.length + 1}>
              <div className="add-btn-container">
                <button className="add-btn" onClick={() => addColumn(tableName)}>
                  ➕ Column
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  const addItemNewRegime = () => {
    setNewRegimeData([...newRegimeData, newItemNewRegime])
    setNewItemNewRegime(Array(newRegimeColumns.length).fill(""))
    setShowAddItemFormNewRegime(false)
  }

  const addItemDeductions = () => {
    setDeductionData([...deductionData, newItemDeductions])
    setNewItemDeductions(Array(deductionColumns.length).fill(""))
    setShowAddItemFormDeductions(false)
  }

  const addItemGST = () => {
    setGstData([...gstData, newItemGST])
    setNewItemGST(Array(gstColumns.length).fill(""))
    setShowAddItemFormGST(false)
  }

  const addItemTDS = () => {
    setTdsData([...tdsData, newItemTDS])
    setNewItemTDS(Array(tdsColumns.length).fill(""))
    setShowAddItemFormTDS(false)
  }

  // Edit Form Rendering
  const renderEditForm = () => {
    if (!showEditForm) return null

    const columns =
      editTable === "newRegime"
        ? newRegimeColumns
        : editTable === "deductions"
          ? deductionColumns
          : editTable === "gst"
            ? gstColumns
            : tdsColumns

    const handleInputChange = (colIndex, value) => {
      setEditFormData((prev) => {
        const updated = [...prev]
        updated[colIndex] = value
        return updated
      })
    }

    const handleSave = () => {
      if (editFormData.some((value) => value === "")) {
        alert("Please fill in all fields before saving.")
        return
      }

      if (editTable === "newRegime") {
        setNewRegimeData((prev) => {
          const updated = [...prev]
          updated[editRowIndex] = editFormData
          return updated
        })
      } else if (editTable === "deductions") {
        setDeductionData((prev) => {
          const updated = [...prev]
          updated[editRowIndex] = editFormData
          return updated
        })
      } else if (editTable === "gst") {
        setGstData((prev) => {
          const updated = [...prev]
          updated[editRowIndex] = editFormData
          return updated
        })
      } else if (editTable === "tds") {
        setTdsData((prev) => {
          const updated = [...prev]
          updated[editRowIndex] = editFormData
          return updated
        })
      }

      setShowEditForm(false)
    }

    return (
      <div className="edit-form-overlay">
        <div className="edit-form">
          <h2>Edit {editTable.charAt(0).toUpperCase() + editTable.slice(1)} Item</h2>
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="form-group">
              <label>{col}</label>
              <input
                type="text"
                value={editFormData[colIndex] || ""}
                onChange={(e) => handleInputChange(colIndex, e.target.value)}
              />
            </div>
          ))}
          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowEditForm(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="taxation-wrapper">
      <div className="taxation-screen">
        <div className="taxation-content">
          {/* Tabs */}
          <div className="tax-tabs">
            <button
              className={`tab-button ${activeTab === "incomeTax" ? "active" : ""}`}
              onClick={() => setActiveTab("incomeTax")}
            >
              Income Tax
            </button>
            <button className={`tab-button ${activeTab === "gst" ? "active" : ""}`} onClick={() => setActiveTab("gst")}>
              GST
            </button>
            <button className={`tab-button ${activeTab === "tds" ? "active" : ""}`} onClick={() => setActiveTab("tds")}>
              TDS
            </button>
          </div>

          {/* Income Tax Section */}
          {activeTab === "incomeTax" && (
            <div className="tax-slabs">
              {/* New Regime */}
              <div className="year-selector">
                <select value={selectedYearNewRegime} onChange={(e) => setSelectedYearNewRegime(e.target.value)}>
                  <option>FY 2022-23</option>
                  <option>FY 2023-24</option>
                  <option>FY 2024-25</option>
                  <option>FY 2025-26</option>
                </select>
                <span>(Select the year to see the regime)</span>
              </div>
              <div className="table-header">
                <h2>New Regime</h2>
                <div className="table-icons">
                  <FiDownload className="icon" onClick={() => handleDownload("newRegime")} />
                  <button className="add-btn" onClick={() => setShowAddItemFormNewRegime(true)}>
                    <FiPlus className="icon" /> Add Item
                  </button>
                </div>
              </div>
              {renderTable("newRegime", newRegimeColumns, newRegimeData)}
              {showAddItemFormNewRegime && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Add New Regime Item</h3>
                    {newRegimeColumns.map((col, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`newRegime-${index}`}>{col}</label>
                        <input
                          id={`newRegime-${index}`}
                          value={newItemNewRegime[index] || ""}
                          onChange={(e) => {
                            const updatedItem = [...newItemNewRegime]
                            updatedItem[index] = e.target.value
                            setNewItemNewRegime(updatedItem)
                          }}
                        />
                      </div>
                    ))}
                    <div className="modal-actions">
                      <button onClick={addItemNewRegime}>Add</button>
                      <button onClick={() => setShowAddItemFormNewRegime(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Deductions & Exemptions */}
              <div className="year-selector">
                <select value={selectedYearDeductions} onChange={(e) => setSelectedYearDeductions(e.target.value)}>
                  
                  <option>FY 2023-24</option>
                  <option>FY 2024-25</option>
                  <option>FY 2025-26</option>
                </select>
                <span>(Select the year to see the deduction and exemptions table)</span>
              </div>
              <div className="table-header">
                <h2>Deductions & Exemptions</h2>
                <div className="table-icons">
                  <FiDownload className="icon" onClick={() => handleDownload("deductions")} />
                  <button className="add-btn" onClick={() => setShowAddItemFormDeductions(true)}>
                    <FiPlus className="icon" /> Add Item
                  </button>
                </div>
              </div>
              {renderTable("deductions", deductionColumns, deductionData)}
              {showAddItemFormDeductions && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Add Deduction Item</h3>
                    {deductionColumns.map((col, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`deduction-${index}`}>{col}</label>
                        <input
                          id={`deduction-${index}`}
                          value={newItemDeductions[index] || ""}
                          onChange={(e) => {
                            const updatedItem = [...newItemDeductions]
                            updatedItem[index] = e.target.value
                            setNewItemDeductions(updatedItem)
                          }}
                        />
                      </div>
                    ))}
                    <div className="modal-actions">
                      <button onClick={addItemDeductions}>Add</button>
                      <button onClick={() => setShowAddItemFormDeductions(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GST Section */}
          {activeTab === "gst" && (
            <div className="tax-slabs">
              <div className="year-selector">
                <select value={selectedYearGST} onChange={(e) => setSelectedYearGST(e.target.value)}>
                  <option>FY 2022-23</option>
                  <option>FY 2023-24</option>
                  <option>FY 2024-25</option>
                  <option>FY 2025-26</option>
                </select>
              </div>
              <div className="table-header">
                <h2>GST</h2>
                <div className="table-icons">
                  <FiDownload className="icon" onClick={() => handleDownload("gst")} />
                  <button className="add-btn" onClick={() => setShowAddItemFormGST(true)}>
                    <FiPlus className="icon" /> Add Item
                  </button>
                </div>
              </div>
              {renderTable("gst", gstColumns, gstData)}
              {showAddItemFormGST && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Add GST Item</h3>
                    {gstColumns.map((col, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`gst-${index}`}>{col}</label>
                        <input
                          id={`gst-${index}`}
                          value={newItemGST[index] || ""}
                          onChange={(e) => {
                            const updatedItem = [...newItemGST]
                            updatedItem[index] = e.target.value
                            setNewItemGST(updatedItem)
                          }}
                        />
                      </div>
                    ))}
                    <div className="modal-actions">
                      <button onClick={addItemGST}>Add</button>
                      <button onClick={() => setShowAddItemFormGST(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TDS Section */}
          {activeTab === "tds" && (
            <div className="tax-slabs">
              <div className="year-selector">
                <select value={selectedYearGST} onChange={(e) => setSelectedYearGST(e.target.value)}>
                  <option>FY 2022-23</option>
                  <option>FY 2023-24</option>
                  <option>FY 2024-25</option>
                  <option>FY 2025-26</option>
                </select>
              </div>
              <div className="table-header">
                <h2>TDS</h2>
                <div className="table-icons">
                  <FiDownload className="icon" onClick={() => handleDownload("tds")} />
                  <button className="add-btn" onClick={() => setShowAddItemFormTDS(true)}>
                    <FiPlus className="icon" /> Add Item
                  </button>
                </div>
              </div>
              {renderTable("tds", tdsColumns, tdsData)}
              {showAddItemFormTDS && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Add TDS Item</h3>
                    {tdsColumns.map((col, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`tds-${index}`}>{col}</label>
                        <input
                          id={`tds-${index}`}
                          value={newItemTDS[index] || ""}
                          onChange={(e) => {
                            const updatedItem = [...newItemTDS]
                            updatedItem[index] = e.target.value
                            setNewItemTDS(updatedItem)
                          }}
                        />
                      </div>
                    ))}
                    <div className="modal-actions">
                      <button onClick={addItemTDS}>Add</button>
                      <button onClick={() => setShowAddItemFormTDS(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Render the Edit Form */}
      {renderEditForm()}
    </div>
  )
}

export default TaxationScreen

