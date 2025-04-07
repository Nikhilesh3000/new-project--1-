"use client"

import { useState } from "react"
import "./franchiseeterms.css"

const FranchiseTerms = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [data, setData] = useState([
    {
      id: 1,
      component: "Franchisee Fees",
      charges: "-----",
    },
    {
      id: 2,
      component: "Franchisee Charges",
      charges: "75%",
    },
    {
      id: 3,
      component: "Franchisee Developer Incentive",
      charges: "-----",
    },
    {
      id: 4,
      component: "TDS Rate(Person)",
      charges: "1%",
    },
    {
      id: 5,
      component: "TDS Rate(Company)",
      charges: "2%",
    },
    {
      id: 6,
      component: "Lead Incentive",
      charges: "40%",
    },
  ])

  const [newItem, setNewItem] = useState({
    component: "",
    charges: "",
  })

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id))
    setShowDeleteModal(false)
  }

  const handleAdd = () => {
    const newId = Math.max(...data.map((item) => item.id)) + 1
    setData([...data, { ...newItem, id: newId }])
    setShowAddModal(false)
    setNewItem({
      component: "",
      charges: "",
    })
  }

  const handleEdit = () => {
    setData(data.map((item) => (item.id === editItem.id ? editItem : item)))
    setShowEditModal(false)
    setEditItem(null)
  }

  const handleDownload = (item) => {
    const content = `Component: ${item.component}\nCharges: ${item.charges}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.component.replace(/\s+/g, "_")}.txt`;  // Fixed template literal
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


  return (
    <div className="franchise-terms-container">
      <div className="header">
        <h2>Franchisee Terms</h2>
        <div className="header-right">
        <div className="header-buttons">
          <button className="download-btn" onClick={handleDownload}>
            <i className="fas fa-download"></i> Download
          </button>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            Add Item
          </button>
       {/*   <div className="view-toggle">
            <button className="row-btn active">Row</button>
            <button className="column-btn">Column</button>
          </div>*/}
        </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>HEAD/COMPONENT</th>
              <th>CHARGES</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="component-name">{item.component}</td>
                <td className="charges">{item.charges}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => {
                        setEditItem(item)
                        setShowEditModal(true)
                      }}
                    >
                      ✎
                    </button>
                    
                    <button
                      className="action-btn delete"
                      onClick={() => {
                        setDeleteId(item.id)
                        setShowDeleteModal(true)
                      }}
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Item</h3>
            <div className="form-group">
              <label>Component Name</label>
              <input
                type="text"
                value={newItem.component}
                onChange={(e) => setNewItem({ ...newItem, component: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Charges</label>
              <input
                type="text"
                value={newItem.charges}
                onChange={(e) => setNewItem({ ...newItem, charges: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAdd}>Add Item</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Item</h3>
            <div className="form-group">
              <label>Component Name</label>
              <input
                type="text"
                value={editItem.component}
                onChange={(e) => setEditItem({ ...editItem, component: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Charges</label>
              <input
                type="text"
                value={editItem.charges}
                onChange={(e) => setEditItem({ ...editItem, charges: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleEdit}>Save Changes</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FranchiseTerms