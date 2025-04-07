import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SalaryPayment.css';
import Payroll from './SalaryPaymentsBulk';
import SalaryPaymentSingle from './SalaryPaymentSingle';
import axios from 'axios';

const SalaryPayment = ({ showSubtitle = true, customTitle = "Salary Payment", topButtons = true, activePage = 'bulk', tableTitle= true, divActions=true }) => {
  const [activeTab, setActiveTab] = useState('salary');
  const [activeMode, setActiveMode] = useState(activePage);
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('Jan');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);  // for bulk processing
  /*
  const [payrollData, setPayrollData] = useState(() => payrolls.map((payroll, index) => ({
    id: index + 1,
    ...payroll,
    salaryToBePaid: false, // Add this field to track checkbox state
  })));
  */

  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [employees, setEmployees] = useState([]); 
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [searchSingleTerm, setSearchSingleTerm] = useState(''); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(true); 
   
  const generatePayrollData = (employees) => {
    return employees.map((employee) => ({
      id: employee.id || 0,
      name: employee.name?.trim() || '', // Fallback to "Employee X" if emp_name is missing
      salary: employee.salary || 0,
      status: employee.status || 'Unpaid',
      date_of_joining: employee.date_of_joining ? employee.date_of_joining.substring(0, 10) : 'XXXX-XX-XX',
      unpaid_leaves: employee.unpaid_leaves || 0,
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleModeClick = (mode) => {
    setActiveMode(mode);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  const handleSelectedRowsChange = (selectedIds) => {
    setSelectedEmployeeIds(selectedIds); // Update the parent state
    console.log('Selected Employee IDs in Parent:', selectedIds); // Debugging
  };
/*
  const handleCheckboxChange = (index) => {
    const updatedData = [...payrollData];
    updatedData[index].salaryToBePaid = !updatedData[index].salaryToBePaid;
  
    // Update selected rows
    const updatedSelectedRows = updatedData
      .filter((row) => row.salaryToBePaid)
      .map((row) => row.id);
  
    setPayrollData(updatedData);
    setSelectedRows(updatedSelectedRows);
  };
  */

  const handleProceedClick = () => {
    /*
    if (selectedRows.length === 0) {
      alert('Please select at least one row to proceed.');
      return;
    }
      */
    setIsModalOpen(true); 
  };

  const handleBulkPayment = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Extract form data
    const paidDate = e.target.elements.paidDate.value;
    const paidAmount = e.target.elements.paidAmount.value;
    const bankName = e.target.elements.bankName.value;
    const utr = e.target.elements.utr.value;

    if (!paidDate || !utr || !paidAmount || !bankName) {
      alert('Please fill in all the fields.');
      return;
    }
  
    // Iterate over the selected employee IDs and send a POST request for each
    selectedEmployeeIds.forEach((employeeId) => {
      fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paid_amount: paidAmount,
          bank_name: bankName,
          utr: utr,
          status: 'Paid',
          employee_id: employeeId, // Use the current employee ID from the array
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to save payment for employee ID: ${employeeId}`);
          }
          return response.text();
        })
        .then((message) => {
          console.log(`Payment saved for employee ID: ${employeeId}`, message);
        })
        .catch((error) => {
          console.error(`Error saving payment for employee ID: ${employeeId}`, error);
        });
    });
  
    alert('Payments saved successfully for all selected employees');
    handleCloseModal();
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/employees')
      .then((response) => {
        const generatedData = generatePayrollData(response.data || []);
        setPayrollData(generatedData);
        setEmployees(response.data || []);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        setPayrollData([]);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  const filteredPayrollData = generatePayrollData(
    (payrollData || []).filter((employee) => {
      if (!searchTerm.trim()) {
        return true; // Include all employees if searchTerm is empty
      }
      return (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleSingleSearchChange = (e) => {
    setSearchSingleTerm(e.target.value); // Update search term
  };
  
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    setIsDropdownVisible(false); // Hide the dropdown
  };

  const location = useLocation();
  const containerHeight = location.pathname === '/pay-sheet' 
  ? { maxHeight: '60vh', height: 'max-content' } 
  : {}; 

  return (
    <div className="salary-payment-root">
      <h1 className="salary-payment-title">{customTitle ? customTitle : 'Salary Payment'}</h1>
      {showSubtitle && <p className="salary-payment-subtitle">Search employee to get payroll</p>}

      {topButtons && (
        <>
      <div className="salary-payment-tabs">
        <button
          className={`salary-payment-tab ${activeTab === 'salary' ? 'active' : ''}`}
          onClick={() => handleTabClick('salary')}
        >
          Salary
        </button>
        <button
          className={`salary-payment-tab ${activeTab === 'incentives' ? 'active' : ''}`}
          onClick={() => handleTabClick('incentives')}
        >
          Incentives
        </button>
      </div>
      <div className="salary-payment-modes">
        <button
          className={`salary-payment-mode ${activeMode === 'bulk' ? 'active' : ''}`}
          onClick={() => handleModeClick('bulk')}
        >
          Bulk
        </button>
        <button
          className={`salary-payment-mode ${activeMode === 'single' ? 'active' : ''}`}
          onClick={() => handleModeClick('single')}
        >
          Single
        </button>
      </div>
      <hr className="salary-payment-divider" />
      </>
      )}
      


      {activeMode === 'bulk' && (
        <div className="salary-payment-bulk">
          <div className="salary-payment-search">
            <i className="fas fa-search salary-payment-search-icon"></i>
            <input
              type="text"
              className="salary-payment-search-input"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/*
            {filteredEmployees.length > 0 && (
              <ul className="salary-payment-search-suggestions">
                {filteredEmployees.map((employee) => (
                  <li
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee)} 
                    className="salary-payment-search-suggestion-item"
                  >
                    {employee.name}
                  </li>
                ))}
              </ul>
            )}
            */}

          </div>
          <div className="salary-payment-filters">
            <div className="salary-payment-select-container">
              <select
                className="salary-payment-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 11 }, (_, i) => 2015 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="salary-payment-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="salary-payment-proceed-button"
              onClick={handleProceedClick} 
            >
              Proceed
            </button>
          </div>
          <div className="salary-payment-table-container">
            <div className="salary-payment-table-header">
              { tableTitle && (<h2 className="salary-payment-table-title">Bulk Salary Payment</h2>)}
              <button className="salary-payment-download-button">Download</button>
            </div>
            <div className="salary-payment-table-wrapper" style={{ height: containerHeight }}>
            {filteredPayrollData.length > 0 ? (
              <Payroll
                month={month}
                year={year}
                filteredPayrollData={filteredPayrollData}
                onSelectedRowsChange={handleSelectedRowsChange}
              />
            ) : (
              <p className="no-matching-employees">No matching employees found.</p> // Show message if no matches
            )}
            </div>
          </div>
        </div>
      )}

      {activeMode === 'single' && (
        <div className="salary-payment-single">
          <div className="salary-payment-dropdown">
            <div className="salary-payment-search-container">
            <input
              type="text"
              className="salary-payment-search-input"
              placeholder="Search Employee"
              value={searchSingleTerm}
              onChange={(e) => {
                setSearchSingleTerm(e.target.value); // Update search term
                setIsDropdownVisible(true); // Show the dropdown when typing
              }}
              onFocus={() => setIsDropdownVisible(true)} // Show the dropdown when clicking on the search bar
            />
              <i className="fas fa-chevron-down salary-payment-dropdown-icon"></i>
            </div>
            { isDropdownVisible && (
            <ul className="salary-payment-dropdown-list">
              
              {employees
                .filter((employee) =>
                  employee.name.toLowerCase().includes(searchSingleTerm.toLowerCase())
                )
                .map((employee) => (
                  <li
                    key={employee.id}
                    className="salary-payment-dropdown-item"
                    onClick={() => handleEmployeeSelect(employee)} // Select employee
                  >
                    {employee.name}
                  </li>
                ))}
            </ul>
            )}
            <div className="salary-payment-select-container">
              <select
                className="salary-payment-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 11 }, (_, i) => 2015 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="salary-payment-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display Selected Employee Details */}
          {selectedEmployee ? (
            <SalaryPaymentSingle employee={selectedEmployee} divBox={divActions} month={month} year={year}/>
          ) : (
            <p>Please select an employee to view details.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="salary-payment-modal">
          <div className="salary-payment-modal-content">
            {/* Close button on the top-right */}
            <button className="salary-payment-modal-close-top" onClick={handleCloseModal}>
              &times;
            </button>
            <form onSubmit={handleBulkPayment}>
              <div className="salary-payment-modal-grid">
                <div className="salary-payment-modal-row">
                  <label>Paid on Date</label>
                  <input type="date" name="paidDate" className="salary-payment-modal-input" required />
                </div>
                <div className="salary-payment-modal-row">
                  <label>UTR</label>
                  <input type="text" name="utr" className="salary-payment-modal-input" placeholder="Enter UTR" required />
                </div>
                <div className="salary-payment-modal-row">
                  <label>Amount</label>
                  <input type="number" name="paidAmount" className="salary-payment-modal-input" placeholder="Enter Amount" required />
                </div>
                <div className="salary-payment-modal-row">
                  <label>Bank Name</label>
                  <input type="text" name="bankName" className="salary-payment-modal-input" placeholder="Enter Bank Name" required />
                </div>
              </div>
              <div className="salary-payment-modal-actions">
                <button type="submit" className="salary-payment-modal-submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPayment;