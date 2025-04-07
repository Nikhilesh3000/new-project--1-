"use client"

import { useState, useEffect } from "react"
import { Download, Edit, Trash2,  } from "lucide-react"
import "./expensesdata.css"

// Mock data for different years
const mockData = {
  "2024-25": [
    { id: 1, component: "Advertisement", tds: 2 },
    { id: 2, component: "Audit Fees", tds: 10 },
    { id: 3, component: "Linkedin", tds: 10.4 },
    { id: 4, component: "Individual Franchise", tds: 1 },
  ],
  "2023-24": [
    { id: 1, component: "Advertisement", tds: 1.8 },
    { id: 2, component: "Audit Fees", tds: 9 },
    { id: 3, component: "Linkedin", tds: 9.5 },
  ],
}
const ExpenseData = () => {
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [expenses, setExpenses] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ component: "", tds: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    setExpenses(mockData[selectedYear] || [])
  }, [selectedYear])

  const handleAdd = () => {
    if (newItem.component && newItem.tds) {
      const newExpense = { id: Date.now(), ...newItem }
      setExpenses([...expenses, newExpense])
      mockData[selectedYear] = [...mockData[selectedYear], newExpense]
      setNewItem({ component: "", tds: 0 })
      setShowAddDialog(false)
    }
  }

  const handleEdit = () => {
    if (editItem) {
      const updatedExpenses = expenses.map((item) => (item.id === editItem.id ? editItem : item))
      setExpenses(updatedExpenses)
      mockData[selectedYear] = updatedExpenses
      setEditItem(null)
      setShowEditDialog(false)
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      const updatedExpenses = expenses.filter((item) => item.id !== deleteId)
      setExpenses(updatedExpenses)
      mockData[selectedYear] = updatedExpenses
      setDeleteId(null)
      setShowDeleteDialog(false)
    }
  }

  const downloadCSV = () => {
    const headers = ["Component", "TDS (%)"]
    const csvData = expenses.map((item) => [item.component, item.tds])
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `expenses-${selectedYear}.csv`;
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="expense-container">
      <div className="expense-header">
        <div className="expense-title">
          <h1>Expenses</h1>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="year-select">
            <option value="2024-25">FY 2024-25</option>
            <option value="2023-24">FY 2023-24</option>
          </select>
        </div>
        <div className="add-buttons">
        <button onClick={downloadCSV} className="download-btn">
          <Download size={20} />
        </button>
        
          <button onClick={() => setShowAddDialog(true)} className="add-btn">
            Add Row
          </button>
        
        </div>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>HEAD/COMPONENT</th>
            <th>TDS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.component}</td>
              <td>{expense.tds}%</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditItem(expense)
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setDeleteId(expense.id)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      {/* Add Dialog */}
      {showAddDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Add New Expense</h2>
            <input
              type="text"
              placeholder="Component"
              value={newItem.component}
              onChange={(e) => setNewItem({ ...newItem, component: e.target.value })}
            />
            <input
              type="number"
              placeholder="TDS (%)"
              value={newItem.tds}
              onChange={(e) => setNewItem({ ...newItem, tds: Number(e.target.value) })}
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowAddDialog(false)}>Cancel</button>
              <button onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Edit Expense</h2>
            <input
              type="text"
              value={editItem?.component || ""}
              onChange={(e) => setEditItem({ ...editItem, component: e.target.value })}
            />
            <input
              type="number"
              value={editItem?.tds || 0}
              onChange={(e) => setEditItem({ ...editItem, tds: Number(e.target.value) })}
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowEditDialog(false)}>Cancel</button>
              <button onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Delete Expense</h2>
            <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            <div className="dialog-buttons">
              <button onClick={() => setShowDeleteDialog(false)}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseData