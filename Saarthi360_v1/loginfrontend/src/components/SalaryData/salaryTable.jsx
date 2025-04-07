"use client"

import { useState, useEffect } from "react"
import { FiTrash, FiEdit, FiDownload, FiPlus } from "react-icons/fi"
import "./salarytable.css"

const SalaryTable = () => {
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Define columns for the salary data table
  const [columns, setColumns] = useState([
    { key: "component_name", label: "HEAD COMPONENT" },
    { key: "eligibility", label: "ELIGIBILITY" },
    { key: "amount", label: "LIMIT" },
    { key: "period", label: "PERIOD" },
    { key: "remarks", label: "REMARKS" },
  ])

  // Salary data as an array of objects
  const [data, setData] = useState([])

  // Fetch data from backend
  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:8080/api/salary-data")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        return res.json()
      })
      .then((fetchedData) => {
        setData(fetchedData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching salary data:", err)
        setError("Failed to load salary data. Please try again later.")
        setLoading(false)
      })
  }, [])

  // For adding a new row
  const [newRow, setNewRow] = useState({
    component_name: "",
    eligibility: "",
    amount: "",
    period: "MONTHLY",
    remarks: "",
  })

  // Row operations
  const handleAddRow = () => {
    // Create a copy of newRow to send to the backend
    const rowToAdd = { ...newRow }

    fetch("http://localhost:8080/api/salary-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowToAdd),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add item")
        }
        return res.json()
      })
      .then((addedItem) => {
        setData([...data, addedItem])
        setNewRow({
          component_name: "",
          eligibility: "",
          amount: "",
          period: "MONTHLY",
          remarks: "",
        })
        setShowAddItemForm(false)
      })
      .catch((err) => {
        console.error("Error adding item:", err)
        alert("Failed to add item. Please try again.")
      })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/salary-data/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete item")
        }
        setData(data.filter((item) => item.id !== id))
        setDeleteConfirmId(null)
      })
      .catch((err) => {
        console.error("Error deleting item:", err)
        alert("Failed to delete item. Please try again.")
      })
  }

  // Edit and Save
  const handleEditSave = () => {
    const itemToUpdate = data.find((item) => item.id === editingId)
    const updatedItem = { ...itemToUpdate, ...newRow }

    fetch(`http://localhost:8080/api/salary-data/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update item")
        }
        const updatedData = data.map((item) => (item.id === editingId ? updatedItem : item))
        setData(updatedData)
        setEditingId(null)
      })
      .catch((err) => {
        console.error("Error updating item:", err)
        alert("Failed to update item. Please try again.")
      })
  }

  // Download the entire table as CSV
  const handleDownload = () => {
    const headerRow = columns.map((col) => col.label)
    const dataRows = data.map((row) => columns.map((col) => row[col.key] ?? "").join(","))
    const csvContent = [headerRow.join(","), ...dataRows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `salary-data.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Function to add a new column
  const addColumn = () => {
    const newColumnKey = `customColumn${columns.length}`
    const newColumn = { key: newColumnKey, label: `Custom Column ${columns.length}` }
    setColumns([...columns, newColumn])
    setData(data.map((item) => ({ ...item, [newColumnKey]: "" })))
  }

  // Function to handle edit form input changes
  const handleEditInputChange = (key, value) => {
    setNewRow({ ...newRow, [key]: value })
  }

  return (
    <div className="salary-wrapper">
      <div className="salary-table-container">
        <div className="header">
          <h2>Salary Data</h2>
          <div className="header-buttons">
            <button className="download-btn" onClick={handleDownload}>
              <FiDownload className="icon" />
            </button>
            <button className="add-btn" onClick={() => setShowAddItemForm(true)}>
              <FiPlus className="icon" /> Add Item
            </button>
          </div>
        </div>

        {/* Add Item Form */}
        {showAddItemForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Salary Component</h3>
              <div className="form-group">
                <label htmlFor="head_component">Component Name</label>
                <input
                  id="head_component"
                  value={newRow.head_component}
                  onChange={(e) => setNewRow({ ...newRow, head_component: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eligibility">Eligibility</label>
                <input
                  id="eligibility"
                  value={newRow.eligibility}
                  onChange={(e) => setNewRow({ ...newRow, eligibility: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="limit">Limit</label>
                <input
                  id="limit"
                  value={newRow.limit}
                  onChange={(e) => setNewRow({ ...newRow, limit: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="period">Period</label>
                <select
                  id="period"
                  value={newRow.period}
                  onChange={(e) => setNewRow({ ...newRow, period: e.target.value })}
                >
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="YEARLY">YEARLY</option>
                  <option value="ONE-TIME">ONE-TIME</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="remarks">Remarks</label>
                <input
                  id="remarks"
                  value={newRow.remarks}
                  onChange={(e) => setNewRow({ ...newRow, remarks: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleAddRow}>Add</button>
                <button onClick={() => setShowAddItemForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && <div className="loading">Loading salary data...</div>}
        {error && <div className="error">{error}</div>}

        {/* Wrap the table in the scroll-container */}
        <div className="scroll-container">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0
                ? data.map((item) => (
                    <tr key={item.id}>
                      {columns.map((col) => (
                        <td key={col.key} className={col.key === "head_component" ? "component" : ""}>
                          {item[col.key]}
                        </td>
                      ))}
                      <td className="actions">
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingId(item.id)
                            setNewRow({
                              head_component: item.head_component || "",
                              eligibility: item.eligibility || "",
                              limit: item.limit || "",
                              period: item.period || "MONTHLY",
                              remarks: item.remarks || "",
                            })
                          }}
                        >
                          <FiEdit className="icon" />
                        </button>
                        <button className="icon-btn" onClick={() => setDeleteConfirmId(item.id)}>
                          <FiTrash className="icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                        No salary data available
                      </td>
                    </tr>
                  )}
              {/* Bottom row with row/column controls */}
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: "left" }}>
                  <div className="add-btn-container">
                    <button className="add-btn" onClick={addColumn}>
                      + Column
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modals for Edit and Delete */}
        {(editingId !== null || deleteConfirmId !== null) && (
          <div className="modal-overlay">
            <div className="modal">
              {editingId !== null && (
                <>
                  <h3>Edit Salary Component</h3>
                  {/* Edit Salary Component Form */}
                  <div className="form-group">
                    <label htmlFor="edit_head_component">Component Name</label>
                    <input
                      id="edit_head_component"
                      value={newRow.head_component}
                      onChange={(e) => handleEditInputChange("head_component", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit_eligibility">Eligibility</label>
                    <input
                      id="edit_eligibility"
                      value={newRow.eligibility}
                      onChange={(e) => handleEditInputChange("eligibility", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit_limit">Limit</label>
                    <input
                      id="edit_limit"
                      value={newRow.limit}
                      onChange={(e) => handleEditInputChange("limit", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit_period">Period</label>
                    <select
                      id="edit_period"
                      value={newRow.period}
                      onChange={(e) => handleEditInputChange("period", e.target.value)}
                    >
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="YEARLY">YEARLY</option>
                      <option value="ONE-TIME">ONE-TIME</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit_remarks">Remarks</label>
                    <input
                      id="edit_remarks"
                      value={newRow.remarks}
                      onChange={(e) => handleEditInputChange("remarks", e.target.value)}
                    />
                  </div>
                  <div className="modal-actions">
                    <button onClick={handleEditSave}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              )}
              {deleteConfirmId !== null && (
                <>
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete this salary component?</p>
                  <div className="modal-actions">
                    <button onClick={() => handleDelete(deleteConfirmId)}>Yes, Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalaryTable

