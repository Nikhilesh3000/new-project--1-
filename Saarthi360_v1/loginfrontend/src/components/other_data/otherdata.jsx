"use client"
import { useState, useEffect } from "react"
import "./otherdata.css"

const API_BASE_URL = 'http://localhost:8080/api'

async function fetchDepartments() {
  const response = await fetch(`${API_BASE_URL}/departments`)
  if (!response.ok) throw new Error("Failed to fetch departments")
  return await response.json()
}

async function createDepartment(departmentData) {
  const response = await fetch(`${API_BASE_URL}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(departmentData),
  })
  if (!response.ok) throw new Error("Failed to create department")
  return await response.json()
}

async function updateDepartment(id, departmentData) {
  const response = await fetch(`${API_BASE_URL}departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(departmentData),
  })
  if (!response.ok) throw new Error("Failed to update department")
  return await response.json()
}

async function deleteDepartment(id) {
  const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete department")
  return await response.json()
}

async function createDesignation(departmentId, designationData) {
  const response = await fetch(`${API_BASE_URL}/departments/${departmentId}/designations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(designationData),
  })
  if (!response.ok) throw new Error("Failed to create designation")
  return await response.json()
}

async function updateDesignation(id, designationData) {
  const response = await fetch(`${API_BASE_URL}/designations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(designationData),
  })
  if (!response.ok) throw new Error("Failed to update designation")
  return await response.json()
}

async function deleteDesignation(id) {
  const response = await fetch(`${API_BASE_URL}/designations/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete designation")
  return await response.json()
}

async function searchDepartments(query) {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error("Failed to search departments")
  return await response.json()
}

const Otherdata = () => {
  // State for departments - now starting empty
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // State for modals
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [isAddDesignationModalOpen, setIsAddDesignationModalOpen] = useState(false)
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false)
  const [isEditDesignationModalOpen, setIsEditDesignationModalOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null)
  const [selectedDesignationId, setSelectedDesignationId] = useState(null)
  const [departmentToEdit, setDepartmentToEdit] = useState(null)
  const [designationToEdit, setDesignationToEdit] = useState(null)

  // Load jsPDF dynamically
  const [jsPDFLib, setJsPDFLib] = useState(null)

  useEffect(() => {
    // Dynamically import jsPDF
    const loadJsPDF = async () => {
      try {
        const { jsPDF } = await import("jspdf")
        setJsPDFLib(() => jsPDF)
      } catch (error) {
        console.error("Failed to load jsPDF:", error)
      }
    }

    loadJsPDF()
  }, [])

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true)
        const data = await fetchDepartments()
        setDepartments(data)
        setFilteredDepartments(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading departments:", error)
        setError("Failed to load departments. Please try again.")
        setLoading(false)
      }
    }
    loadDepartments()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDepartments(departments)
    } else {
      const search = async () => {
        try {
          const results = await searchDepartments(searchQuery)
          setFilteredDepartments(results)
        } catch (error) {
          console.error("Error searching:", error)
          setFilteredDepartments([])
        }
      }
      search()
    }
  }, [searchQuery, departments])

  // Add new department
  const handleAddDepartment = async (departmentName, designations) => {
    try {
      const newDepartment = await createDepartment({
        departmentName,
        designations: designations.filter((d) => d.trim() !== ""),
      })
      setDepartments([...departments, newDepartment])
      setIsAddDepartmentModalOpen(false)
    } catch (error) {
      console.error("Error adding department:", error)
      alert("Failed to add department")
    }
  }

  // Edit department
  const handleEditDepartment = async (departmentId, departmentName) => {
    try {
      await updateDepartment(departmentId, { departmentName })
      setDepartments(
        departments.map((dept) => {
          if (dept.id === departmentId) {
            return { ...dept, departmentName }
          }
          return dept
        }),
      )
      setIsEditDepartmentModalOpen(false)
      setDepartmentToEdit(null)
    } catch (error) {
      console.error("Error updating department:", error)
      alert("Failed to update department")
    }
  }

  // Delete department
  const handleDeleteDepartment = async (departmentId) => {
    if (confirm("Are you sure you want to delete this department and all its designations?")) {
      try {
        await deleteDepartment(departmentId)
        setDepartments(departments.filter((dept) => dept.id !== departmentId))
      } catch (error) {
        console.error("Error deleting department:", error)
        alert("Failed to delete department")
      }
    }
  }

  // Add designation to a department
  const handleAddDesignation = async (designationName) => {
    if (!selectedDepartmentId) return

    try {
      const newDesignation = await createDesignation(selectedDepartmentId, { designationName })
      setDepartments(
        departments.map((dept) => {
          if (dept.id === selectedDepartmentId) {
            return {
              ...dept,
              designations: [...dept.designations, newDesignation],
            }
          }
          return dept
        }),
      )
      setIsAddDesignationModalOpen(false)
      setSelectedDepartmentId(null)
    } catch (error) {
      console.error("Error adding designation:", error)
      alert("Failed to add designation")
    }
  }

  // Edit designation
  const handleEditDesignation = async (designationName) => {
    if (!selectedDesignationId) return

    try {
      await updateDesignation(selectedDesignationId, { designationName })
      setDepartments(
        departments.map((dept) => {
          if (dept.id === selectedDepartmentId) {
            return {
              ...dept,
              designations: dept.designations.map((des) => {
                if (des.id === selectedDesignationId) {
                  return { ...des, designationName }
                }
                return des
              }),
            }
          }
          return dept
        }),
      )
      setIsEditDesignationModalOpen(false)
      setSelectedDepartmentId(null)
      setSelectedDesignationId(null)
      setDesignationToEdit(null)
    } catch (error) {
      console.error("Error updating designation:", error)
      alert("Failed to update designation")
    }
  }

  // Delete designation
  const handleDeleteDesignation = async (departmentId, designationId) => {
    if (confirm("Are you sure you want to delete this designation?")) {
      try {
        await deleteDesignation(designationId)
        setDepartments(
          departments.map((dept) => {
            if (dept.id === departmentId) {
              return {
                ...dept,
                designations: dept.designations.filter((des) => des.id !== designationId),
              }
            }
            return dept
          }),
        )
      } catch (error) {
        console.error("Error deleting designation:", error)
        alert("Failed to delete designation")
      }
    }
  }

  // Open designation modal for a specific department
  const openAddDesignationModal = (departmentId) => {
    setSelectedDepartmentId(departmentId)
    setIsAddDesignationModalOpen(true)
  }

  // Open edit department modal
  const openEditDepartmentModal = (department) => {
    setDepartmentToEdit(department)
    setIsEditDepartmentModalOpen(true)
  }

  // Open edit designation modal
  const openEditDesignationModal = (departmentId, designation) => {
    setSelectedDepartmentId(departmentId)
    setSelectedDesignationId(designation.id)
    setDesignationToEdit(designation)
    setIsEditDesignationModalOpen(true)
  }

  // Download functions
  const downloadAsCSV = () => {
    try {
      // Create CSV content
      let csvContent = "Department,Designation\n"

      departments.forEach((dept) => {
        if (dept.designations.length === 0) {
          csvContent += `"${dept.departmentName}",""\n`
        } else {
          dept.designations.forEach((designation, index) => {
            if (index === 0) {
              csvContent += `"${dept.departmentName}","${designation.designationName}"\n`
            } else {
              csvContent += `"","${designation.designationName}"\n`
            }
          })
        }
      })

      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      // Create a temporary link element and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = "departments.csv"
      document.body.appendChild(link)
      link.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)

      setIsDownloadModalOpen(false)
    } catch (error) {
      console.error("Error downloading CSV:", error)
      alert("Failed to download CSV. Please try again.")
    }
  }

  const downloadAsPDF = () => {
    try {
      if (!jsPDFLib) {
        alert("PDF library is still loading. Please try again in a moment.")
        return
      }

      // Create new jsPDF instance using the imported constructor
      const doc = new jsPDFLib()

      // Add title
      doc.setFontSize(18)
      doc.text("Departments and Designations", 14, 20)

      // Set font size for content
      doc.setFontSize(12)

      let yPos = 30

      // Add departments and designations
      departments.forEach((dept) => {
        // Use setFont with proper parameters
        doc.setFont("helvetica", "bold")
        doc.text(`Department: ${dept.departmentName}`, 14, yPos)
        yPos += 10

        doc.setFont("helvetica", "normal")
        if (dept.designations.length === 0) {
          doc.text("No designations", 20, yPos)
          yPos += 10
        } else {
          doc.text("Designations:", 14, yPos)
          yPos += 6

          dept.designations.forEach((designation) => {
            doc.text(`- ${designation.designationName}`, 20, yPos)
            yPos += 6
          })

          yPos += 4 // Add some space between departments
        }

        // Add a new page if we're running out of space
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })

      // Save the PDF
      doc.save("departments.pdf")
      setIsDownloadModalOpen(false)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download PDF. Please check console for details.")
    }
  }

  // Components
  const DepartmentCard = ({ department, onAddDesignation }) => {
    return (
      <div className="department-card">
        <div className="department-grid">
          {/* Department name column */}
          <div className="department-name-column">
            <h3>{department.departmentName}</h3>
            <div className="department-actions">
              <button onClick={() => openEditDepartmentModal(department)} className="edit-btn" title="Edit Department">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
              <button
                onClick={() => handleDeleteDepartment(department.id)}
                className="delete-btn"
                title="Delete Department"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Designations column */}
          <div className="designations-column">
            <h3 className="designation-title">Designation</h3>
            <div className="designations-list">
              {department.designations.map((designation) => (
                <div key={designation.id} className="designation-item-container">
                  <p className="designation-item">{designation.designationName}</p>
                  <div className="designation-actions">
                    <button
                      onClick={() => openEditDesignationModal(department.id, designation)}
                      className="edit-btn"
                      title="Edit Designation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                    <button
                      onClick={() => handleDeleteDesignation(department.id, designation.id)}
                      className="delete-btn"
                      title="Delete Designation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onAddDesignation} className="add-designation-btn">
              Add Designation
            </button>
          </div>
        </div>
      </div>
    )
  }

  const AddDepartmentModal = ({ isOpen, onClose, onAdd }) => {
    const [departmentName, setDepartmentName] = useState("")
    const [designations, setDesignations] = useState([""])

    if (!isOpen) return null

    const handleAddDesignationField = () => {
      setDesignations([...designations, ""])
    }

    const handleRemoveDesignationField = (index) => {
      const newDesignations = [...designations]
      newDesignations.splice(index, 1)
      setDesignations(newDesignations)
    }

    const handleDesignationChange = (index, value) => {
      const newDesignations = [...designations]
      newDesignations[index] = value
      setDesignations(newDesignations)
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      // Filter out empty designations
      const filteredDesignations = designations.filter((d) => d.trim() !== "")
      onAdd(departmentName, filteredDesignations)

      // Reset form
      setDepartmentName("")
      setDesignations([""])
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Add Department</h2>
            <button onClick={onClose} className="close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="departmentName" className="form-label">
                Department Name
              </label>
              <input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designations</label>
              {designations.map((designation, index) => (
                <div key={index} className="designation-input-group">
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => handleDesignationChange(index, e.target.value)}
                    className="form-input"
                    placeholder="Enter designation"
                  />
                  {designations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDesignationField(index)}
                      className="remove-designation-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddDesignationField} className="add-another-designation-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
                <span>Add Another Designation</span>
              </button>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!departmentName.trim()}>
                Add Department
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const EditDepartmentModal = ({ isOpen, onClose, department, onEdit }) => {
    const [departmentName, setDepartmentName] = useState(department ? department.departmentName : "")

    useEffect(() => {
      if (department) {
        setDepartmentName(department.departmentName)
      }
    }, [department])

    if (!isOpen || !department) return null

    const handleSubmit = (e) => {
      e.preventDefault()
      onEdit(department.id, departmentName)
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Edit Department</h2>
            <button onClick={onClose} className="close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="editDepartmentName" className="form-label">
                Department Name
              </label>
              <input
                type="text"
                id="editDepartmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!departmentName.trim()}>
                Update Department
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const AddDesignationModal = ({ isOpen, onClose, onAdd }) => {
    const [designationName, setDesignationName] = useState("")

    if (!isOpen) return null

    const handleSubmit = (e) => {
      e.preventDefault()
      onAdd(designationName)
      setDesignationName("")
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Add Designation</h2>
            <button onClick={onClose} className="close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="designationName" className="form-label">
                Designation Name
              </label>
              <input
                type="text"
                id="designationName"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!designationName.trim()}>
                Add Designation
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const EditDesignationModal = ({ isOpen, onClose, designation, onEdit }) => {
    const [designationName, setDesignationName] = useState(designation ? designation.designationName : "")

    useEffect(() => {
      if (designation) {
        setDesignationName(designation.designationName)
      }
    }, [designation])

    if (!isOpen || !designation) return null

    const handleSubmit = (e) => {
      e.preventDefault()
      onEdit(designationName)
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Edit Designation</h2>
            <button onClick={onClose} className="close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="editDesignationName" className="form-label">
                Designation Name
              </label>
              <input
                type="text"
                id="editDesignationName"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!designationName.trim()}>
                Update Designation
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const DownloadModal = ({ isOpen, onClose, onDownloadCSV, onDownloadPDF }) => {
    if (!isOpen) return null

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Download Data</h2>
            <button onClick={onClose} className="close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <p className="download-text">Choose a format to download the department data:</p>

          <div className="download-buttons">
            <button onClick={onDownloadCSV} className="csv-download-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              CSV Format
            </button>
            <button onClick={onDownloadPDF} className="pdf-download-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              PDF Format
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state component
  const EmptyState = () => {
    return (
      <div className="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="empty-state-icon"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h3 className="empty-state-title">No departments yet</h3>
        <p className="empty-state-description">Add your first department to get started</p>
        <button onClick={() => setIsAddDepartmentModalOpen(true)} className="empty-state-button">
          Add Department
        </button>
      </div>
    )
  }

  // Loading state component
  const LoadingState = () => {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading departments...</p>
      </div>
    )
  }

  // Error state component
  const ErrorState = ({ message }) => {
    return (
      <div className="error-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="error-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 className="error-title">Error</h3>
        <p className="error-description">{message}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="page-title">Department</h1>
          <p className="page-description">All the departments and designation of the company are listed here</p>
        </div>
        <button className="download-button" onClick={() => setIsDownloadModalOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          className="search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Department cards grid or empty state */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : departments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="department-grid-container">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onAddDesignation={() => openAddDesignationModal(department.id)}
            />
          ))}

          {/* Add department card */}
          <button onClick={() => setIsAddDepartmentModalOpen(true)} className="add-department-card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="add-department-text">Add department</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => setIsAddDepartmentModalOpen(false)}
        onAdd={handleAddDepartment}
      />

      <EditDepartmentModal
        isOpen={isEditDepartmentModalOpen}
        onClose={() => setIsEditDepartmentModalOpen(false)}
        department={departmentToEdit}
        onEdit={handleEditDepartment}
      />

      <AddDesignationModal
        isOpen={isAddDesignationModalOpen}
        onClose={() => setIsAddDesignationModalOpen(false)}
        onAdd={handleAddDesignation}
      />

      <EditDesignationModal
        isOpen={isEditDesignationModalOpen}
        onClose={() => setIsEditDesignationModalOpen(false)}
        designation={designationToEdit}
        onEdit={handleEditDesignation}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownloadCSV={downloadAsCSV}
        onDownloadPDF={downloadAsPDF}
      />
    </div>
  )
}

export default Otherdata

