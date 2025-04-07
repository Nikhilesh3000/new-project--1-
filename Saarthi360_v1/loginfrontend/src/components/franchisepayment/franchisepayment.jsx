"use client"

import { useState } from "react"
import { Search, Pencil, Trash, Download, Check, X } from "lucide-react"
import "./franchisepayment.css"

const FranchisePayment = () => {
  const years = ["FY 2022-23", "FY 2023-24", "FY 2024-25", "FY 2025-26"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const [selectedYear, setSelectedYear] = useState(years[0])
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [tableData, setTableData] = useState([
    {
      "BILL DATE": "XXX",
      "BD NO.": "XXX",
      "CANDIDATE NAME": "XXX",
      "COMPANY NAME": "XXX",
      "SERVICE CHARGE": "XXX",
      "TOTAL GST": "XXX",
      "TOTAL BILL AMOUNT": "XXX",
      "DATE RECEIVED": "XXX",
      "AMOUNT RECEIVED": "XXX",
      TDS: "XXX",
      "NAME OF FRANCHISEE AS PER AGREEMENT": "XXX",
      "FRANCHISE SHARE": "XXX",
      "GST IF ANY": "XXX",
      "TDS FF": "XXX",
      "AMOUNT PAID": "XXX",
    },
  ])
  const [editIndex, setEditIndex] = useState(null)
  const [editRow, setEditRow] = useState(null)

  const handleDelete = (index) => {
    setTableData(tableData.filter((_, i) => i !== index))
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditRow({ ...tableData[index] })
  }

  const handleChange = (e, key) => {
    setEditRow({ ...editRow, [key]: e.target.value })
  }

  const handleSave = (index) => {
    const updatedData = [...tableData]
    updatedData[index] = editRow
    setTableData(updatedData)
    setEditIndex(null)
    setEditRow(null)
  }

  const handleCancel = () => {
    setEditIndex(null)
    setEditRow(null)
  }

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const downloadCSV = () => {
    const headers = Object.keys(tableData[0]).join(",") + ",ACTION\n"
    const rows = filteredData.map((item) => Object.values(item).join(",") + ', "Edit/Delete"\n')
    const csvContent = headers + rows.join("")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "franchise_payment_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="franchise-container">
      <h1 className="franchise-title">Franchise Payment</h1>
      <p className="franchise-subtitle">All the franchise data details are listed here</p>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" />
        </div>
      </div>

      <div className="filter-container">
        <select className="filter-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select className="filter-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h2 className="table-header">
        <span>Franchise Payment</span>
        <Download className="download-icon" onClick={downloadCSV} />
      </h2>

      <div className="table-container">
        <table className="franchise-table">
          <thead>
            <tr className="table-header-row">
              {Object.keys(tableData[0]).map((key, index) => (
                <th key={index} className="table-header-cell">
                  {key}
                </th>
              ))}
              <th className="table-header-cell action-header">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                {Object.keys(item).map((key, i) => (
                  <td key={i} className="table-cell">
                    {editIndex === index ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editRow[key]}
                        onChange={(e) => handleChange(e, key)}
                      />
                    ) : (
                      item[key]
                    )}
                  </td>
                ))}
                <td className="action-cell">
                  {editIndex === index ? (
                    <>
                      <Check className="check-icon" onClick={() => handleSave(index)} />
                      <X className="cancel-icon" onClick={handleCancel} />
                    </>
                  ) : (
                    <Pencil className="edit-icon" onClick={() => handleEdit(index)} />
                  )}
                  <Trash className="delete-icon" onClick={() => handleDelete(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FranchisePayment

