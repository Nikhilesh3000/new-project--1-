"use client"

import { useState } from "react"
import "./performance-view.css"

const PerformanceView = ({ onBack, employee = {} }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [performanceData, setPerformanceData] = useState({
    month: "March",
    financialYear: "2024-2025",
    revenueGenerated: "",
    clientsAcquired: "",
    candidatesPlaced: "",
    targetRevenue: "",
    achievementPercentage: "",
    incentiveEarned: "",
  })

  const [editedData, setEditedData] = useState({ ...performanceData })

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPerformanceData({ ...editedData })
    setIsEditing(false)
    // In a real application, you would save this data to your backend
    console.log("Saving performance data:", editedData)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditedData({ ...performanceData })
    setIsEditing(false)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this performance record?")) {
      // In a real application, you would delete this data from your backend
      console.log("Deleting performance data")
      // Reset the form data
      setPerformanceData({
        month: "",
        financialYear: "",
        revenueGenerated: "",
        clientsAcquired: "",
        candidatesPlaced: "",
        targetRevenue: "",
        achievementPercentage: "",
        incentiveEarned: "",
      })
      setEditedData({
        month: "",
        financialYear: "",
        revenueGenerated: "",
        clientsAcquired: "",
        candidatesPlaced: "",
        targetRevenue: "",
        achievementPercentage: "",
        incentiveEarned: "",
      })
      setIsEditing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData({
      ...editedData,
      [name]: value,
    })
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onBack) onBack()
  }

  return (
    <div className="performance-overlay">
      <div className="performance-container">
        <div className="performance-header">
          <button className="back-button" onClick={handleBackClick}>
            &lt; Back to details
          </button>
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          ) : (
            <div className="action-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Delete
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>

        <div className="performance-content">
          <div className="performance-status">
            <div className="status-badge">Good</div>
          </div>

          <div className="performance-fields">
            <div className="performance-field">
              <div className="field-label">Month:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="month"
                    value={editedData.month}
                    onChange={handleInputChange}
                    className="field-input"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.month}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">Financial year:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="financialYear"
                    value={editedData.financialYear}
                    onChange={handleInputChange}
                    className="field-input"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.financialYear}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">Revenue Generated:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="revenueGenerated"
                    value={editedData.revenueGenerated}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter revenue generated"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.revenueGenerated || "-"}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">No of Clients Acquired:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="clientsAcquired"
                    value={editedData.clientsAcquired}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter number of clients"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.clientsAcquired || "-"}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">No. of candidate placed:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="candidatesPlaced"
                    value={editedData.candidatesPlaced}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter candidates placed"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.candidatesPlaced || "-"}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">Target revenue (₹):</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="targetRevenue"
                    value={editedData.targetRevenue}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter target revenue"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.targetRevenue || "-"}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">Achievement %:</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="achievementPercentage"
                    value={editedData.achievementPercentage}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter achievement percentage"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.achievementPercentage || "-"}</div>
              )}
            </div>

            <div className="performance-field">
              <div className="field-label">Incentive earned (₹):</div>
              {isEditing ? (
                <div className="field-input-container">
                  <input
                    type="text"
                    name="incentiveEarned"
                    value={editedData.incentiveEarned}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter incentive earned"
                  />
                </div>
              ) : (
                <div className="field-value">{performanceData.incentiveEarned || "-"}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceView

