"use client"

import { useState, useEffect } from "react"
import { Search, FileText, Download, ChevronDown } from 'lucide-react'
import EmployeePopup from "./EmployeePopup"
import "./employeedata.css"
import { fetchEmployees, deleteEmployee } from "./api"
import EmployeeForm from "./EmployeeForm"

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true) // Indicate loading state
        const data = await fetchEmployees()
        console.log("Fetched employees:", data)

        if (Array.isArray(data)) {
          setEmployees(data)
          
          // Extract unique departments for filtering
          const uniqueDepartments = [...new Set(data.map(emp => emp.department).filter(Boolean))]
          setDepartments(uniqueDepartments)
        } else {
          console.error("Unexpected response format:", data)
          setEmployees([]) // Prevent app crash
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        setError("Failed to load employees.")
      } finally {
        setLoading(false)
      }
    }
    
    loadEmployees()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleAddEmployee = () => {
    setShowAddForm(true)
  }

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedEmployee(null)
  }

  const handleEditEmployee = () => {
    if (selectedEmployee) {
      console.log("Editing employee:", selectedEmployee)
      setShowForm(true)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return

    try {
      await deleteEmployee(selectedEmployee.id)
      setShowPopup(false)
      
      // Reload employees after deletion
      const updatedEmployees = await fetchEmployees()
      setEmployees(updatedEmployees)
    } catch (err) {
      alert("Failed to delete employee. Please try again.")
      console.error("Error deleting employee:", err)
    }
  }

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department)
    setShowFilters(false)
  }

  const handleSaveEmployee = async (employeeData) => {
    try {
      // In a real app, you would send this data to an API
      console.log("Saving employee data:", employeeData)
      
      // Close the form
      setShowForm(false)
      setShowAddForm(false)
      
      // Reload the employee list to show the new/updated employee
      const updatedEmployees = await fetchEmployees()
      setEmployees(updatedEmployees)
    } catch (error) {
      console.error("Error saving employee:", error)
      alert("Failed to save employee. Please try again.")
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setShowAddForm(false)
  }

  const downloadEmployeeData = () => {
    // Create CSV content
    const headers = ["First Name", "Last Name", "Designation", "Email", "Joining Date"]
    const csvRows = [headers]

    filteredEmployees.forEach((employee) => {
      const row = [employee.firstName, employee.lastName, employee.designation, employee.email, employee.joiningDate]
      csvRows.push(row)
    })

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "employees.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const uniqueDesignations = Array.from(new Set(employees.map((emp) => emp.designation)))
    .filter(Boolean)
    .map((designation) => `Designation: ${designation}`)

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.includes(searchQuery) ||
      employee.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = selectedDepartment === "" || employee.department === selectedDepartment

    if (filter === "All") {
      return matchesSearch && matchesDepartment
    }
    // Status filters
    else if (filter === "Active" || filter === "Inactive") {
      return (
        matchesSearch &&
        matchesDepartment &&
        ((filter === "Active" && employee.status !== "Inactive") ||
          (filter === "Inactive" && employee.status === "Inactive"))
      )
    }
    // Designation filters
    else if (filter.startsWith("Designation:")) {
      const designation = filter.replace("Designation: ", "")
      return matchesSearch && matchesDepartment && employee.designation === designation
    }
    // Joining date filters
    else if (filter === "Joined: Last 30 days") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && matchesDepartment && new Date(employee.joiningDate) >= thirtyDaysAgo
    } else if (filter === "Joined: Last 90 days") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      return matchesSearch && matchesDepartment && new Date(employee.joiningDate) >= ninetyDaysAgo
    } else if (filter === "Joined: Last year") {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return matchesSearch && matchesDepartment && new Date(employee.joiningDate) >= oneYearAgo
    }

    return matchesSearch && matchesDepartment
  })

  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )

  if (error) return <div className="error">{error}</div>

  return (
    <div className="employee-wrapper">
    <div className="container">
    <div className="header">
      <div>
        <h1 className="title">Employees ({employees.length})</h1>
        <p className="subtitle">All the employees of the company are listed here</p>
      </div>
      <div className="button-group">
        <button onClick={() => setShowForm(true)} className="btn add-btn">
          <span>+</span> Add Employee
        </button>
        <button onClick={downloadEmployeeData} className="btn download-btn">
          <Download size={20} />
        </button>
      </div>
    </div>
  
    <div className="search-filter">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="filter">
        <span>Filter:</span>
        <div className="select-wrapper">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Joining Date</option>
            <option>Designation</option>
            {uniqueDesignations.length > 0 && <option disabled>──────────</option>}
            {uniqueDesignations.map((designation) => (
              <option key={designation}>{designation}</option>
            ))}
          </select>
          <ChevronDown className="chevron-icon" size={16} />
        </div>
      </div>
    </div>
  
    <div className="employee-table-wrapper">
    <h2 className="table-title">Employee List</h2>
      {employees.length > 0 ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Email</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                onClick={() => handleEmployeeClick(employee)}
                className="employee-row"
              >
                <td>
                  <div className="employee-info">
                    {employee.picture ? (
                      <img src={employee.picture} alt={employee.name} className="employee-pic" />
                    ) : (
                      <div className="employee-placeholder">
                        {employee.firstName?.charAt(0)}
                        {employee.lastName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3>{employee.firstName} {employee.lastName}</h3>
                      <p>{employee.designation}</p>
                    </div>
                  </div>
                </td>
                <td>{employee.designation}</td>
                <td>{employee.email}</td>
                <td>{employee.joiningDate}</td>
                <td>
                  <button
                    className="performance-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmployeeClick(employee);
                    }}
                  >
                    Performance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <div className="icon-circle">
            <FileText size={24} />
          </div>
          <p>Click here to add Employee Data</p>
          <button onClick={() => setShowForm(true)} className="btn add-outline-btn">
            Add Employee
          </button>
        </div>
      )}
    </div>
  
    {showForm && (
      <EmployeeForm 
        onSave={handleSaveEmployee} 
        onCancel={handleCancelForm} 
        employee={selectedEmployee} 
        isEdit={!!selectedEmployee}
      />
    )}
  
    {selectedEmployee && showPopup && (
      <EmployeePopup
        employee={selectedEmployee}
        onClose={handleClosePopup}
        onViewDetails={() => {
          setShowPopup(false);
          setShowForm(true);
        }}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />
    )}
  </div>
  </div>
  )
}

export default EmployeeList