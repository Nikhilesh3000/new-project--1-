import React, { useState } from 'react';
import './Form16.css';

const Form16 = () => {
  const [financialYear, setFinancialYear] = useState('');
  const [employeeSelection, setEmployeeSelection] = useState('all');
  const [specificEmployee, setSpecificEmployee] = useState('');
  const [exportFormat, setExportFormat] = useState('');

  const financialYears = Array.from(new Array(26), (val, index) => `${index + 2000}-${index + 2001}`);

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
    // Logic to generate Form 16 report
    console.log('Generating Form 16 report...');
  };

  return (
    <div className="generateform16-root">
      <div className="generateform16-paper">
        <h4 className="generateform16-title">Generate Form 16</h4>
        <form noValidate autoComplete="off">
          <div className="generateform16-grid">
            <div className="generateform16-grid-item">
              <h6>Select Financial Year</h6>
            </div>
            <div className="generateform16-grid-item">
              <label htmlFor="financialYear" className="generateform16-label">Financial Year</label>
              <select
                id="financialYear"
                className="generateform16-select"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
              >
                {financialYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="generateform16-grid-item">
              <h6>Employee Selection</h6>
            </div>
            <div className="generateform16-grid-item">
              <div className="generateform16-radio-group">
                <label className="generateform16-radio-label">
                  <input
                    type="radio"
                    value="all"
                    checked={employeeSelection === 'all'}
                    onChange={(event) => setEmployeeSelection(event.target.value)}
                  />
                  All Employees
                </label>
                <label className="generateform16-radio-label">
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
              <div className="generateform16-grid-item">
                <label htmlFor="specificEmployee" className="generateform16-label">Specific Employee</label>
                <select
                  id="specificEmployee"
                  className="generateform16-select"
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
            <div className="generateform16-grid-item">
              <h6>Export Form 16 As:</h6>
            </div>
            <div className="generateform16-grid-item">
              <label htmlFor="exportFormat" className="generateform16-label">Export Format</label>
              <select
                id="exportFormat"
                className="generateform16-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="generateform16-grid-item">
              <button type="button" className="generateform16-button" onClick={handleGenerateReport}>
                Generate Form 16
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form16;