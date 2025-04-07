"use client"

import { useState, useEffect } from "react"
import "./cancellation.css"

const CancellationSheet = () => {
  const [cancellationData, setCancellationData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [fiscalYear, setFiscalYear] = useState("FY 2022-23")
  const [selectedMonth, setSelectedMonth] = useState("")

  // Mock data for initial load
  useEffect(() => {
    const mockData = Array(5)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        timestamp: new Date().toISOString(),
        emailAddress: "XXX",
        nameOfFranchise: "XXX",
        nameOfCompany: "XXX",
        cancelChange: "XXX",
      }))
    setCancellationData(mockData)
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log("Edit item:", id)
  }

  const handleDelete = (id) => {
    const updatedData = cancellationData.filter((item) => item.id !== id)
    setCancellationData(updatedData)
  }

  const exportToCSV = () => {
    const headers = Object.keys(cancellationData[0] || {}).join(",")
    const csvData = cancellationData.map((row) => Object.values(row).join(",")).join("\n")
    const csv = `${headers}\n${csvData}`

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "cancellation_data.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const filteredData = cancellationData.filter((item) =>
    Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="cancellation-container">
      <div className="cancellation-header">
        <h1>Cancellation Sheet</h1>
        <p>All the Invoice Data are listed here</p>

        <div className="cancellation-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-container">
            <select value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} className="filter-select">
              <option value="FY 2022-23">FY 2022-23</option>
              <option value="FY 2023-24">FY 2023-24</option>
            </select>

            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="filter-select">
              <option value="">Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Cancellation Sheet</h2>
          <button className="download-button" onClick={exportToCSV}>
            <span className="download-icon">↓</span>
          </button>
        </div>

        <div className="table-scroll">
          <table className="cancellation-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>EMAIL ADDRESS</th>
                <th>NAME OF FRANCHISE</th>
                <th>NAME OF COMPANY</th>
                <th>CANCEL/CHANGE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.emailAddress}</td>
                  <td>{item.nameOfFranchise}</td>
                  <td>{item.nameOfCompany}</td>
                  <td>{item.cancelChange}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(item.id)}>
                      <span className="edit-icon">✏️</span>
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(item.id)}>
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      

      <div className="pagination">
        <button className="prev-button">◀</button>
        <div className="pagination-bar">
          <div className="pagination-progress"></div>
        </div>
        <button className="next-button">▶</button>
      </div>
    </div>
  )
}

export default CancellationSheet

