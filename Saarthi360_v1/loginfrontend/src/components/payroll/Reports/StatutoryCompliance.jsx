import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StatutoryCompliance.css';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

const StatutoryCompliance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [year, setYear] = useState('Year');
  const [reportTypes, setReportTypes] = useState('Click here to select');
  const [exportFormat, setExportFormat] = useState('pdf'); 

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/employees')
      .then((response) => {
  
        // Process payroll data for all employees
        const processedEmployees = response.data.map((employee) => ({
          ...employee,
          ...processPayrollData(employee), // Add calculated payroll fields
        }));
  
        setEmployees(processedEmployees); // Update the employees state with processed data
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  }, []);

  /*
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredEmployees([]);
      return;
    }

    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };
  */

  const handleSave = () => {
    alert('Saving the selected reports');
    // Add logic for saving data
  };

  const handleDownload = () => {

    const isAnyReportTypeSelected = Object.values(reportTypes).some((isSelected) => isSelected);
    if (!isAnyReportTypeSelected) {
      alert('Please select any one report type (e.g., PF, ESI, PT, CTC, Gratuity).');
      return;
    }

    if (exportFormat === 'pdf') {
      // PDF Download Logic
      const previewElement = document.querySelector('.statutory-compliance-preview');
      if (!previewElement) {
        alert('Preview section not found!');
        return;
      }

      const options = {
        margin: 0, // No margins to capture the full content
        filename: `Statutory_Compliance_${reportTypes}_for_${year}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // Higher scale for better quality
          useCORS: true, // Enable cross-origin images
          width: previewElement.scrollWidth, // Capture the full width of the element
          height: previewElement.scrollHeight, // Capture the full height of the element
        },
        jsPDF: {
          unit: 'px', // Use pixels for better alignment with the screen
          format: [previewElement.scrollWidth, previewElement.scrollHeight], // Dynamically set the page size
          orientation: 'portrait', // Use portrait orientation
        },
      };

      html2pdf()
      .set(options)
      .from(previewElement)
      .save()
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
    } else if (exportFormat === 'excel') {
      // Excel Download Logic
      const data = [];
  
      // Add header row
      const headerRow = ['Employee Name', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Total'];
      data.push(headerRow);

      // Add data rows for all employees
      employees.forEach((employee) => {
        const value = employee[reportTypes] || 'N/A'; // Get the value for the selected report type
        const monthlyValues = Array(12).fill(value); // Repeat the value for all 12 months
        const total = value !== 'N/A' ? value * 12 : 'N/A'; // Calculate the total
        const row = [employee.name, ...monthlyValues, total]; // Create a row with employee name, monthly values, and total
        data.push(row);
      });

      // Create a worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Statutory Compliance');

      // Write the Excel file and trigger download
      XLSX.writeFile(workbook, `Statutory_Compliance_${reportTypes}_for_${year}.xlsx`);
    }
  };

  const processPayrollData = (employee) => {
    if (!employee) return null;
  
    const daysInMonth = 31;
    const paidDays = 31;
    const basicDA = Math.round(employee.salary * 0.5);
    const hra = Math.round(basicDA * 0.5);
    const conveyance = 1200;
    const medicalAllow = 1000;
    const otherAllowance = employee.salary - hra - basicDA - conveyance - medicalAllow;
    const gross = basicDA + hra + conveyance + medicalAllow + otherAllowance;
    const earnBasic = Math.round((basicDA / daysInMonth) * paidDays);
    const earnHRA = Math.round((hra / daysInMonth) * paidDays);
    const earnConveyance = Math.round((conveyance / daysInMonth) * paidDays);
    const earnMedicalAllow = Math.round((medicalAllow / daysInMonth) * paidDays);
    const earnOtherAllo = Math.round((otherAllowance / daysInMonth) * paidDays);
    const earnGross = earnBasic + earnHRA + earnConveyance + earnMedicalAllow + earnOtherAllo;
    const pfWages = earnGross - earnHRA;
    const pf = Math.round(pfWages >= 15000 ? 1800 : pfWages * 0.12); // PF
    const employerPF = Math.round(pf);
    const employerESIC = Math.ceil(gross >= 21001 ? 0 : earnGross * 0.0325);
    const graduity = Math.round(earnBasic * 0.0481) + 1;
    const lwf = 25;
    const employerLWF = lwf * 3;
         
    // Calculate the required fields
    const esic = Math.ceil(gross >= 21001 ? 0 : earnGross * 0.0075); // ESIC
    const pt = 200; // PT
    const ctc = earnGross + employerPF + employerESIC + graduity + employerLWF;
    const gratuity = Math.round(earnBasic * 0.0481) + 1; // Gratuity
  
    return { pf, esic, pt, ctc, gratuity };
  };

  return (
    <div className="statutory-compliance-root">
      <h1 className="statutory-compliance-title">Statutory Compliance</h1>

      {/* Search Bar */}
      {/*
      <div className="statutory-compliance-search">
            <input
              type="text"
              className="statutory-compliance-search-input"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {filteredEmployees.length > 0 && (
              <ul className="statutory-compliance-dropdown">
                {filteredEmployees.map((employee) => (
                  <li
                    key={employee.id}
                    className="statutory-compliance-dropdown-item"
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    {employee.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          */}
  
      <div className="statutory-compliance-content">
        {/* Left Section: Existing Content */}
        <div className="statutory-compliance-left">
          
  
          {/* Year and Month Dropdowns */}
          <div className="statutory-compliance-filters">
            <select
              className="statutory-compliance-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="Year" disabled>
                Year
              </option>
              {Array.from({ length: 11 }, (_, i) => 2015 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {/* <select
              className="statutory-compliance-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="Month" disabled>
                Month
              </option>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                (month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                )
              )}
            </select> */}
          </div>
  
          {/* Employee Name and Report Type */}
          {selectedEmployee && (
            <div className="statutory-compliance-employee">
              <h2>{selectedEmployee.name}</h2>
              <p>Select: Statutory Compliance Report Type</p>
            </div>
          )}
  
          {/* Checkboxes for Report Types */}
          <div className="statutory-compliance-dropdown">
            <label>Select Report Type:</label>
            <div className="statutory-compliance-options">
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="pf"
                  checked={reportTypes === 'pf'}
                  onChange={(e) => setReportTypes(e.target.value)} // Update report type
                />
                PF Report
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="esic"
                  checked={reportTypes === 'esic'}
                  onChange={(e) => setReportTypes(e.target.value)} // Update report type
                />
                ESIC Report
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="pt"
                  checked={reportTypes === 'pt'}
                  onChange={(e) => setReportTypes(e.target.value)} // Update report type
                />
                PT Report
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="ctc"
                  checked={reportTypes === 'ctc'}
                  onChange={(e) => setReportTypes(e.target.value)} // Update report type
                />
                Annual CTC Report
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="gratuity"
                  checked={reportTypes === 'gratuity'}
                  onChange={(e) => setReportTypes(e.target.value)} // Update report type
                />
                Gratuity Report
              </label>
            </div>
          </div>
  
          {/* Buttons */}
          <div className="statutory-compliance-buttons">
            <button className="purple-button" >
              Export As
            </button>
            <button className="white-button" onClick={handleSave}>
              Save
            </button>
          </div>
  
          {/* Export Format Checkboxes */}
          <div className="statutory-compliance-export-format">
            <label>
              <input
                type="radio"
                name="exportFormat"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
              />
              As PDF
            </label>
            <label>
              <input
                type="radio"
                name="exportFormat"
                value="excel"
                checked={exportFormat === 'excel'}
                onChange={() => setExportFormat('excel')}
              />
              As Excel
            </label>
          </div>
  
          {/* Download Button */}
          <button className="purple-button" onClick={handleDownload}>
            Download
          </button>
        </div>
  
        {/* Right Section: Preview */}
        <div className="statutory-compliance-preview">
          <h2>Statutory Compliance</h2>
          <p><strong>Year:</strong> {year || '_________'}</p>
          {/* selectedEmployee ? (
            <>
              <p><strong>Employee Name:</strong> {selectedEmployee?.name || '_________'}</p>
              <p><strong>Month:</strong> {month || '_________'}</p>
              <hr />
              <h3>Selected Report(s)</h3>
              <table className="statutory-compliance-table">
                <thead>
                  <tr>
                    <th>Report Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportTypes === 'pf' && (
                    <tr>
                      <td>PF</td>
                      <td>{selectedEmployee?.pf || 'N/A'}</td>
                    </tr>
                  )}
                  {reportTypes === 'esi' && (
                    <tr>
                      <td>ESI</td>
                      <td>{selectedEmployee?.esi || 'N/A'}</td>
                    </tr>
                  )}
                  {reportTypes === 'pt' && (
                    <tr>
                      <td>PT</td>
                      <td>{selectedEmployee?.pt || 'N/A'}</td>
                    </tr>
                  )}
                  {reportTypes === 'ctc' && (
                    <tr>
                      <td>CTC</td>
                      <td>{selectedEmployee?.ctc || 'N/A'}</td>
                    </tr>
                  )}
                  {reportTypes === 'gratuity' && (
                    <tr>
                      <td>Gratuity</td>
                      <td>{selectedEmployee?.gratuity || 'N/A'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <> */}
              <h3>All Employees {reportTypes.toLocaleUpperCase()} Report</h3>
              <table className="statutory-compliance-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Total'].map(
                      (month) => (
                        <th key={month}>{month}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    
                    const value = employee[reportTypes] || 'N/A'; 
                    const total = value !== 'N/A' ? value * 12 : 'N/A'; 

                    return (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month) => (
                          <td key={month}>{value}</td> // Display the selected report type
                        ))}
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            {/* </div></>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default StatutoryCompliance;