"use client"

import { useState, useEffect } from "react"
import "./clientterms.css"
import { FiEdit, FiTrash, FiDownload, FiPlus, FiRefreshCw } from "react-icons/fi"

const ClientTerms = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddColumnModal, setShowAddColumnModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [newCharge, setNewCharge] = useState("")
  const [newItemForm, setNewItemForm] = useState({
    headComponent: "",
    charges: [""],
  })
  const [rows, setRows] = useState(0)
  const [columns, setColumns] = useState(0)

  // Fetch client terms from the backend
  useEffect(() => {
    fetchClientTerms()
  }, [])

  // Simplified fetch function that doesn't rely on AbortSignal.timeout
  const fetchClientTerms = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Attempting to fetch client terms...")

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 8080)
      })

      // Create the fetch promise
      const fetchPromise = fetch("http://localhost:8080/api/client-terms")

      // Race the fetch against the timeout
      const response = await Promise.race([fetchPromise, timeoutPromise])
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    

      const data = await response.json()
      console.log("Data fetched successfully:", data)

      // If data is empty, create some default items
      if (!data || data.length === 0) {
        console.log("No client terms found, using default data")
        const defaultData = createDefaultData()
        setItems(defaultData)
        setRows(defaultData.length)
        setColumns(defaultData[0]?.charges.length || 0)
      } else {
        // Transform the data to match your component's structure
        const formattedData = data.map((term, index) => ({
          id: term.id || index + 1,
          headComponent: term.head_component || "",
          charges: term.charges
            ? Array.isArray(term.charges)
              ? term.charges
              : [term.charges]
            : term.description
              ? [term.description]
              : [""],
        }))

        setItems(formattedData)
        setRows(formattedData.length)
        setColumns(formattedData[0]?.charges.length || 0)
      }

      setIsOfflineMode(false)
    } catch (err) {
      console.error("Error fetching client terms:", err)

      // Set offline mode
      setIsOfflineMode(true)

      // Provide more specific error messages based on the error
      if (err.message === "Request timed out") {
        setError("Request timed out. The server might be slow or unavailable.")
      } else if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to the server. Please ensure the backend is running on http://localhost:8080")
      } else {
        setError(err.message)
      }

      // Use local data if API fails
      const fallbackData = createDefaultData()
      setItems(fallbackData)
      setRows(fallbackData.length)
      setColumns(fallbackData[0]?.charges.length || 0)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to create default/fallback data
  const createDefaultData = () => {
    return [
      {
        id: 1,
        headComponent: "Service Fee",
        charges: ["5% of total amount", "Minimum $50"],
      },
      {
        id: 2,
        headComponent: "Maintenance",
        charges: ["$100 per hour", "Parts at cost plus 15%"],
      },
      {
        id: 3,
        headComponent: "Cancellation",
        charges: ["48 hours notice required", "50% fee for late cancellation"],
      },
    ]
  }

  const handleDelete = (id) => {
    setSelectedItem(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
        setLoading(true);

        let timeoutPromise;
        let fetchPromise;

        if (!isOfflineMode) {
            // Create a timeout promise
            timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 8080)
            );

            // Create the fetch promise
            fetchPromise = fetch(`http://localhost:8080/api/client-terms/${selectedItem}`, {
                method: "DELETE",
            });

            // Try to connect to the server, but don't wait too long
            await Promise.race([fetchPromise, timeoutPromise]);
        }

        // Always update the UI regardless of server connection
        setItems(prevItems => prevItems.filter(item => item.id !== selectedItem));
        setShowDeleteModal(false);

    } catch (err) {
        console.error("Error during delete operation:", err);

        // Still delete from UI even if there was an error
        setItems(prevItems => prevItems.filter(item => item.id !== selectedItem));
        setShowDeleteModal(false);
        
    } finally {
        setLoading(false);
    }
};


  const handleEdit = (item) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        headComponent: "",
        charges: Array(columns || 1).fill(""),
      },
    ])
    setRows(rows + 1)
  }

  const handleAddColumn = () => {
    setItems(
      items.map((item) => ({
        ...item,
        charges: [...item.charges, ""],
      })),
    )
    setColumns(columns + 1)
  }

  const handleRemoveColumn = () => {
    if (columns > 1) {
      setItems(
        items.map((item) => ({
          ...item,
          charges: item.charges.slice(0, -1),
        })),
      )
      setColumns(columns - 1)
    }
  }

  const confirmAddColumn = () => {
    setItems(
      items.map((item) => {
        if (item.id === selectedItem) {
          return {
            ...item,
            charges: [...item.charges, newCharge],
          }
        }
        return item
      }),
    )
    setShowAddColumnModal(false)
    setNewCharge("")
  }

  const handleSaveNewItem = async () => {
    try {
      setLoading(true)

      const newItemData = {
        id: items.length + 1, // Generate a local ID
        headComponent: newItemForm.headComponent,
        charges: newItemForm.charges,
      }

      if (!isOfflineMode) {
        // Try to save to server, but don't block UI updates if it fails
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out")), 8080)
          })

          // Create the fetch promise
          const fetchPromise = fetch("http://localhost:8080/api/client-terms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              head_component: newItemForm.headComponent,
              charges: newItemForm.charges,
            }),
          })

          // Try to connect to the server, but don't wait too long
          const response = await Promise.race([fetchPromise, timeoutPromise])

          if (response.ok) {
            const savedItem = await response.json()
            // Update the ID if the server provided one
            if (savedItem && savedItem.id) {
              newItemData.id = savedItem.id
            }
          }
        } catch (err) {
          console.warn("Could not connect to server for save operation:", err)
          // Continue with local save even if server connection fails
        }
      }

      // Always update the UI regardless of server connection
      setItems([...items, newItemData])
      setShowAddModal(false)
      setNewItemForm({ headComponent: "", charges: [""] })
    } catch (err) {
      console.error("Error during save operation:", err)
      // Still add to UI even if there was an error
      const localItem = {
        id: items.length + 1,
        headComponent: newItemForm.headComponent,
        charges: newItemForm.charges,
      }

      setItems([...items, localItem])
      setShowAddModal(false)
      setNewItemForm({ headComponent: "", charges: [""] })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async () => {
    try {
      setLoading(true)

      if (!isOfflineMode) {
        // Try to update on server, but don't block UI updates if it fails
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out")), 8080)
          })

          // Create the fetch promise
const fetchPromise = fetch(`http://localhost:8080/api/client-terms/${selectedItem.id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    head_component: selectedItem.headComponent,
    charges: selectedItem.charges,
  }),
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log("Update successful:", data))
  .catch(error => console.error("Fetch error:", error));


          // Try to connect to the server, but don't wait too long
          await Promise.race([fetchPromise, timeoutPromise])
        } catch (err) {
          console.warn("Could not connect to server for update operation:", err)
          // Continue with local update even if server connection fails
        }
      }

      // Always update the UI regardless of server connection
      setItems(items.map((item) => (item.id === selectedItem.id ? selectedItem : item)))
      setShowEditModal(false)
    } catch (err) {
      console.error("Error during update operation:", err)
      // Still update UI even if there was an error
      setItems(items.map((item) => (item.id === selectedItem.id ? selectedItem : item)))
      setShowEditModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCharges = (index, value) => {
    const updatedCharges = [...newItemForm.charges]
    updatedCharges[index] = value
    setNewItemForm({ ...newItemForm, charges: updatedCharges })
  }

  const handleUpdateSelectedItemCharges = (index, value) => {
    const updatedCharges = [...selectedItem.charges]
    updatedCharges[index] = value
    setSelectedItem({ ...selectedItem, charges: updatedCharges })
  }

  const addChargeField = () => {
    setNewItemForm({
      ...newItemForm,
      charges: [...newItemForm.charges, ""],
    })
  }

  const downloadData = () => {
    const data = JSON.stringify(items, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "client-terms.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="loading">Loading client terms...</div>

  return (
    <div className="client-terms-wrapper">
      <div className="client-terms-container">
        {/* Header */}
        <div className="client-terms-header">
          <div className="client-terms-title-area">
            <h1>Client Terms</h1>
            {isOfflineMode && (
              <div className="offline-indicator">
                <span>Offline Mode</span>
                <button
                  className="client-terms-retry-btn"
                  onClick={() => fetchClientTerms()}
                  title="Try to reconnect to server"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="client-terms-header-buttons">
            <button onClick={downloadData} className="client-terms-icon-btn client-terms-download">
              <FiDownload size={22} />
            </button>
            <button onClick={() => setShowAddModal(true)} className="client-terms-add-item-btn">
              <FiPlus size={16} /> Add Item
            </button>
          </div>
        </div>

        {/* Error message if present */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button className="client-terms-retry-btn" onClick={() => fetchClientTerms()}>
              <FiRefreshCw size={16} /> Retry Connection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="client-terms-table-container">
          <table>
            <thead>
              <tr>
                <th>HEAD COMPONENT</th>
                <th>CHARGES</th>
                <th className="client-terms-actions-header">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="head-component">{item.headComponent}</td>
                  <td>
                    <div className="client-terms-charges-vertical">
                      {item.charges.map((charge, index) => (
                        <span key={index} className="client-terms-charge-item">
                          {charge}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="client-terms-actions">
                    <button className="client-terms-icon-btn client-terms-edit" onClick={() => handleEdit(item)}>
                      <FiEdit />
                    </button>
                    <button className="client-terms-icon-btn client-terms-delete" onClick={() => handleDelete(item.id)}>
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Controls */}
        <div className="client-terms-bottom-controls">
          <button className="client-terms-add-row-btn" onClick={handleAddRow}>
            + Row
          </button>
          <button className="client-terms-add-column-btn" onClick={handleAddColumn}>
            + Column
          </button>
          {columns > 1 && (
            <button className="client-terms-remove-column-btn" onClick={handleRemoveColumn}>
              - Column
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="client-terms-modal">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this item?</p>
              {isOfflineMode && (
                <p className="modal-warning">
                  Note: You are in offline mode. This item will be removed from the UI but the change won't be saved to
                  the database until you reconnect.
                </p>
              )}
              <div className="modal-actions">
                <button className="client-terms-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="client-terms-delete-btn" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="client-terms-modal">
            <div className="modal-content">
              <div className="edit-form-container">
                <div className="form-group">
                  <h2>Edit Item</h2>
                  {isOfflineMode && (
                    <p className="modal-warning">
                      Note: You are in offline mode. Changes will be visible in the UI but won't be saved to the
                      database until you reconnect.
                    </p>
                  )}
                  <label>Head Component:</label>
                  <input
                    type="text"
                    value={selectedItem.headComponent}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        headComponent: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Charges:</label>
                  {selectedItem.charges.map((charge, index) => (
                    <input
                      key={index}
                      type="text"
                      value={charge}
                      onChange={(e) => handleUpdateSelectedItemCharges(index, e.target.value)}
                      placeholder="Enter charge"
                    />
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="client-terms-save-btn" onClick={handleUpdateItem}>
                    Save
                  </button>
                  <button className="client-terms-cancel-btn" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="client-terms-modal">
            <div className="modal-content">
              <div className="add-form-container">
                <div className="form-group">
                  <h2>Add New Item</h2>
                  {isOfflineMode && (
                    <p className="modal-warning">
                      Note: You are in offline mode. This item will be added to the UI but won't be saved to the
                      database until you reconnect.
                    </p>
                  )}
                  <label>Head Component:</label>
                  <input
                    type="text"
                    value={newItemForm.headComponent}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        headComponent: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Charges:</label>
                  {newItemForm.charges.map((charge, index) => (
                    <input
                      key={index}
                      type="text"
                      value={charge}
                      onChange={(e) => handleUpdateCharges(index, e.target.value)}
                      placeholder="Enter charge"
                    />
                  ))}
                  <button className="client-terms-add-field-btn" onClick={addChargeField}>
                    + Add Charge
                  </button>
                </div>
                <div className="modal-actions">
                  <button className="client-terms-save-btn" onClick={handleSaveNewItem}>
                    Add
                  </button>
                  <button className="client-terms-cancel-btn" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       
        {showAddColumnModal && (
          <div className="client-terms-modal">
            <div className="client-terms-modal-content">
              <h2>Add New Charge</h2>
              <div className="client-terms-form-group">
                <label>New Charge:</label>
                <input
                  type="text"
                  value={newCharge}
                  onChange={(e) => setNewCharge(e.target.value)}
                  placeholder="Enter new charge"
                />
              </div>
              <div className="modal-actions">
                <button className="client-terms-cancel-btn" onClick={() => setShowAddColumnModal(false)}>
                  Cancel
                </button>
                <button className="client-terms-save-btn" onClick={confirmAddColumn}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientTerms