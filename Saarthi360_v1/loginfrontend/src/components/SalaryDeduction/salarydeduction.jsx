"use client"

import { useState } from "react"
import "./salarydeduction.css"

const SalaryDeduction = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      headComponent: "PF",
      eligibility: "Permanent Employees",
      limit: "12% of basic salary",
      period: "MONTHLY",
      remarks: "Mandatory for all employees.",
    },
    {
      id: 2,
      headComponent: "EPF",
      eligibility: "Permanent Employees",
      limit: "12% of basic salary",
      period: "MONTHLY",
      remarks: "Tax exempt under certain conditions.",
    },
    {
      id: 3,
      headComponent: "ESIC 0.75%",
      eligibility: "Permanent Employees",
      limit: ".75% of Basic Salary",
      period: "MONTHLY",
      remarks: "Taxable if exceeding the limit.",
    },
    {
      id: 4,
      headComponent: "ESI@ 3.25%",
      eligibility: "Permanent Employees",
      limit: "3.25 % of Basic Salary",
      period: "MONTHLY",
      remarks: "Taxable if exceeding the limit.",
    },
    {
      id: 5,
      headComponent: "Gratuity",
      eligibility: "Employees With 5+ Years In Service",
      limit: "4.81% of Basic salary",
      period: "ONE TIME (ON EXIT)",
      remarks: "Taxable if exceeding the limit.",
    },
    {
      id: 6,
      headComponent: "Bonus",
      eligibility: "Based On Performance Appraisal",
      limit: "8.33% of annual basic salary",
      period: "MONTHLY",
      remarks: "Taxable if exceeding the limit.",
    },
    {
      id: 7,
      headComponent: "Leave",
      eligibility: "Permanent Employees",
      limit: "2 leave per month after 6 month of joining",
      period: "MONTHLY",
      remarks: "Taxable if exceeding the limit.",
    },
    {
      id: 8,
      headComponent: "Professional Tax",
      eligibility: "As Per State Laws",
      limit: "8.33% of annual basic salary",
      period: "MONTHLY",
      remarks: "Taxable if exceeding the limit.",
    },
  ])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [formData, setFormData] = useState({
    headComponent: "",
    eligibility: "",
    limit: "",
    period: "",
    remarks: "",
  })

  const handleDelete = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setItems(items.filter((item) => item.id !== deleteId))
    setShowDeleteModal(false)
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setFormData(item)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditItem(null)
    setFormData({
      headComponent: "",
      eligibility: "",
      limit: "",
      period: "",
      remarks: "",
    })
    setShowForm(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (editItem) {
      setItems(items.map((item) => (item.id === editItem.id ? { ...formData, id: item.id } : item)))
    } else {
      setItems([...items, { ...formData, id: items.length + 1 }])
    }
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="salarydeduction-container">
      <div className="salarydeduction-header">
        <h1>Salary Deduction</h1>
        <div className="salarydeduction-header-buttons">
          <button className="salarydeduction-add-btn" onClick={handleAdd}>+ Add New</button>
        </div>
      </div>
      <div className="salarydeduction-table-container">
        <table>
          <thead>
            <tr>
              <th>HEAD COMPONENT</th>
              <th>ELIGIBILITY</th>
              <th>LIMIT</th>
              <th>PERIOD</th>
              <th>REMARKS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.headComponent}</td>
                <td>{item.eligibility}</td>
                <td>{item.limit}</td>
                <td>{item.period}</td>
                <td>{item.remarks}</td>
                <td className="salarydeduction-actions">
                  <button onClick={() => handleEdit(item)}>✎</button>
                  <button onClick={() => handleDelete(item.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalaryDeduction
