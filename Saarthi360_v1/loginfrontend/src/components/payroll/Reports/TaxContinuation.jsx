import React, { useState, useEffect } from 'react';
import TaxOldScheme from './TaxOldScheme';
import TaxNewScheme from './TaxNewScheme';
import TaxSchemeComparison from './TaxSchemeComparison';
import './TaxContinuation.css';

const TaxContinuation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [particulars, setParticulars] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeScheme, setActiveScheme] = useState('old'); // 'old' or 'new'

  useEffect(() => {
    if (tableData.rowData) {
      setEmployees(tableData.rowData);
      setParticulars(tableData.particulars);
    }
  }, [tableData]);

  // Update employees whenever tableData changes
  useEffect(() => {
    setEmployees(tableData);
  }, [tableData]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setEmployees(tableData); // Reset employees to full tableData
      return;
    }

    const filtered = tableData.filter((data) =>
      data.name?.toLowerCase().includes(term.toLowerCase())
    );
    setEmployees(filtered);
  };

  // Dynamically generate the headings based on tableData
  const headings = tableData.length > 0
    ? Object.keys(tableData[0]).filter((key) => key !== 'id' && key !== 'name') // Exclude 'id' and 'name'
    : [];

  const handleEdit = (id) => {
    console.log(`Edit clicked for employee ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for employee ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="tax-continuation-root">
      <h1 className="tax-continuation-title">Tax Continuation</h1>

      {/* Buttons to switch between schemes */}
      <div className="tax-continuation-buttons">
        <button
          className={activeScheme === 'old' ? 'active' : ''}
          onClick={() => setActiveScheme('old')}
        >
          Old Scheme
        </button>
        <button
          className={activeScheme === 'new' ? 'active' : ''}
          onClick={() => setActiveScheme('new')}
        >
          New Scheme
        </button>
        <button
          className={activeScheme === 'comparison' ? 'active' : ''}
          onClick={() => setActiveScheme('comparison')}
        >
          Comparison
        </button>
      </div>

      {/* Search Bar */}
      <div className="tax-continuation-search">
        <input
          type="text"
          className="tax-continuation-search-input"
          placeholder="Search Employee"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="tax-continuation-table-container">
        <table className="tax-continuation-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              {headings.map((heading, index) => (
                <th key={index}>
                  {heading.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name || '-'}</td>
                {headings.map((key) => (
                  <td key={`${employee.id}-${key}`}>{employee[key] || '-'}</td>
                ))}
                <td>
                  <button
                    onClick={() => handleEdit(employee.id)}
                    style={{ marginRight: '5px', cursor: 'pointer' }}
                  >
                    ✏️ {/* Edit Icon */}
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    🗑️ {/* Delete Icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load data for the active scheme */}
      {activeScheme === 'old' && <TaxOldScheme setTableData={setTableData} />}
      {activeScheme === 'new' && <TaxNewScheme setTableData={setTableData} />}
      {activeScheme === 'comparison' && <TaxSchemeComparison setTableData={setTableData} />}
    </div>
  );
};

export default TaxContinuation;