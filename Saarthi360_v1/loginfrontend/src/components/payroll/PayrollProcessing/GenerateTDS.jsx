import React, { useState } from 'react';
import './GenerateTDS.css';

const GenerateTDS = () => {
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
    // Logic to generate TDS report
    console.log('Generating TDS report...');
  };

  return (
    <div className="generatetds-root">
      <div className="generatetds-paper">
        <h4 className="generatetds-title">Generate TDS Report</h4>
        <form noValidate autoComplete="off">
          <div className="generatetds-grid">
            <div className="generatetds-grid-item">
              <h6>Select Compliance Period</h6>
            </div>
            <div className="generatetds-grid-item">
              <label htmlFor="month" className="generatetds-label">Month</label>
              <select
                id="month"
                className="generatetds-select"
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
            <div className="generatetds-grid-item">
              <label htmlFor="year" className="generatetds-label">Year</label>
              <select
                id="year"
                className="generatetds-select"
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
            <div className="generatetds-grid-item">
              <h6>Employee Selection</h6>
            </div>
            <div className="generatetds-grid-item">
              <div className="generatetds-radio-group">
                <label className="generatetds-radio-label">
                  <input
                    type="radio"
                    value="all"
                    checked={employeeSelection === 'all'}
                    onChange={(event) => setEmployeeSelection(event.target.value)}
                  />
                  All Employees
                </label>
                <label className="generatetds-radio-label">
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
              <div className="generatetds-grid-item">
                <label htmlFor="specificEmployee" className="generatetds-label">Specific Employee</label>
                <select
                  id="specificEmployee"
                  className="generatetds-select"
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
            <div className="generatetds-grid-item">
              <h6>Export TDS Report As:</h6>
            </div>
            <div className="generatetds-grid-item">
              <label htmlFor="exportFormat" className="generatetds-label">Export Format</label>
              <select
                id="exportFormat"
                className="generatetds-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="generatetds-grid-item">
              <button type="button" className="generatetds-button" onClick={handleGenerateReport}>
                Generate TDS Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateTDS;