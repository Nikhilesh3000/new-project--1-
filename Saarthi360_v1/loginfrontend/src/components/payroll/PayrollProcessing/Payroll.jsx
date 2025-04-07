import React, { useState } from 'react';
import './Payroll.css';

const GeneratePayroll = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [employeeSelection, setEmployeeSelection] = useState('all');
  const [specificEmployee, setSpecificEmployee] = useState('');
  const [exportFormat, setExportFormat] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(new Array(26), (val, index) => index + 2000);

  const employeeOptions = [
    { id: 'E001', name: 'Aagam Sheth' },
    { id: 'E002', name: 'Avadai Marthuvar' },
    { id: 'E003', name: 'Hrutika Mohal' },
    { id: 'E004', name: 'Jahnvi Thakker' },
    { id: 'E005', name: 'Joyeeta Khaskel' },
    { id: 'E006', name: 'Komal Bhanushali' },
    { id: 'E007', name: 'Preshita Rane' },
    { id: 'E008', name: 'Priyanka Panjwani' },
    { id: 'E009', name: 'Rajalaxmi Das' },
    { id: 'E010', name: 'Rashesh Doshi' },
    { id: 'E011', name: 'Rushali Rajgor' },
    { id: 'E012', name: 'Snehal kadu' },
    { id: 'E013', name: 'Surbhi Jain' },
    { id: 'E014', name: 'Vaishnavi Bhagat' },
    { id: 'E015', name: 'Vedika Tolani' },
    { id: 'E016', name: 'Jagruti Doshi' },
    { id: 'E017', name: 'Kajal Khamkar' },
    { id: 'E018', name: 'Nishi Doshi' },
    { id: 'E019', name: 'Deepti Singh' },
    { id: 'E020', name: 'Bankim Doshi' },
    { id: 'E021', name: 'Nita Doshi' },
    { id: 'E022', name: 'Pragya Doshi' },
    { id: 'E023', name: 'Chaitali Doshi' },
    { id: 'E024', name: 'Preeti Doshi' },
    { id: 'E025', name: 'Kinjal Patel' },
    { id: 'E026', name: 'Minal Sanghvi' },
    { id: 'E027', name: 'Jigna Sanghvi' },
    { id: 'E028', name: 'SAUMYA KIRIT GALA' },
    { id: 'E029', name: 'Shreya Santosh Talashilkar' },
  ];

  const handleGenerateReport = () => {
    // Logic to generate payroll report
    console.log('Generating payroll report...');
  };

  return (
    <div className="generatepayroll-root">
      <div className="generatepayroll-paper">
        <h4 className="generatepayroll-title">Generate Payroll Report</h4>
        <form noValidate autoComplete="off">
          <div className="generatepayroll-grid">
            <div className="generatepayroll-grid-item">
              <h6>Select Payroll Period</h6>
            </div>
            <div className="generatepayroll-grid-item">
              <label htmlFor="month" className="generatepayroll-label">Month</label>
              <select
                id="month"
                className="generatepayroll-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="generatepayroll-grid-item">
              <label htmlFor="year" className="generatepayroll-label">Year</label>
              <select
                id="year"
                className="generatepayroll-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="generatepayroll-grid-item">
              <h6>Employee Selection</h6>
            </div>
            <div className="generatepayroll-grid-item">
              <div className="generatepayroll-radio-group">
                <label className="generatepayroll-radio-label">
                  <input
                    type="radio"
                    value="all"
                    checked={employeeSelection === 'all'}
                    onChange={(event) => setEmployeeSelection(event.target.value)}
                  />
                  All Employees
                </label>
                <label className="generatepayroll-radio-label">
                  <input
                    type="radio"
                    value="specific"
                    checked={employeeSelection === 'specific'}
                    onChange={(event) => setEmployeeSelection(event.target.value)}
                  />
                  Specific Employees
                </label>
              </div>
            </div>
            {employeeSelection === 'specific' && (
              <div className="generatepayroll-grid-item">
                <label htmlFor="specificEmployee" className="generatepayroll-label">Specific Employee</label>
                <select
                  id="specificEmployee"
                  className="generatepayroll-select"
                  value={specificEmployee}
                  onChange={(event) => setSpecificEmployee(event.target.value)}
                >
                  {employeeOptions.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="generatepayroll-grid-item">
              <h6>Export Payroll Report As:</h6>
            </div>
            <div className="generatepayroll-grid-item">
              <label htmlFor="exportFormat" className="generatepayroll-label">Export Format</label>
              <select
                id="exportFormat"
                className="generatepayroll-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="generatepayroll-grid-item">
              <button type="button" className="generatepayroll-button" onClick={handleGenerateReport}>
                Generate Payroll Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayroll;