import React, { useState, useMemo, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import './AttendanceReports.css';

const AttendanceReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [attendanceData, setAttendanceData] = useState([]);
  const [prevAddOnLeaves, setPrevAddOnLeaves] = useState({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 26 }, (_, i) => (2000 + i).toString());

  const getDaysInMonth = (month, year) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === 1) {
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex];
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/employees?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
  
      setAttendanceData(data.map(emp => ({
        ...emp,
        unpaidLeaves: emp.unpaid_leaves || 0,
        availedLeaves: emp.availed_leaves || 0, 
        addOnLeaves: emp.add_on_leaves || 0,  // Persist add-on leaves
      })));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  

  useEffect(() => {
    fetchEmployees();
  }, [selectedMonth]);
  

  const calculatePayable = (emp) => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const dailySalary = emp.salary / daysInMonth;
    return emp.salary - Math.max(emp.unpaidLeaves, 0) * dailySalary;
  };

  const calculateAddOnLeaves = (emp) => {
    return (prevAddOnLeaves[emp.id] || 0) + (2 - emp.availedLeaves);
  };

  const handleAvailedLeaveChange = (id, value) => {
    setAttendanceData(prevData => {
      return prevData.map(emp => {
        if (emp.id === id) {
          const paidLeaves = 2; // Default paid leaves
          const addOnLeaves = emp.addOnLeaves || 0; // Use the actual add-on leaves from state
          const maxAvailedLeaves = paidLeaves + addOnLeaves; // Dynamic limit
          const newValue = Math.min(Math.max(parseInt(value) || 0), maxAvailedLeaves);
  
          // Update the backend with the new values
          updateEmployeeLeaves(id, newValue, addOnLeaves, emp.unpaidLeaves);
  
          return { ...emp, availedLeaves: newValue };
        }
        return emp;
      });
    });
  };
  
  const updateEmployeeLeaves = async (id, availedLeaves, addOnLeaves, unpaidLeaves) => {
    try {
      const response = await fetch('http://localhost:8080/api/employees/update-leaves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: id,
          month: selectedMonth,
          year: selectedYear,
          availed_leaves: availedLeaves,
          add_on_leaves: addOnLeaves,
          unpaid_leaves: unpaidLeaves
        }),
      });
  
      if (!response.ok) throw new Error('Failed to update leaves');
      console.log('Leave data updated successfully');
    } catch (error) {
      console.error('Error updating leaves:', error);
    }
  };
  

  const handleUnpaidLeaveChange = (id, value) => {
    const emp = attendanceData.find(emp => emp.id === id);
    if (!emp) return;
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const maxUnpaidLeaves = daysInMonth - (2 + emp.addOnLeaves);
    const newValue = Math.min(Math.max(parseInt(value) || 0, 0), maxUnpaidLeaves);
  
    setAttendanceData(prevData =>
      prevData.map(emp =>
        emp.id === id ? { ...emp, unpaidLeaves: newValue } : emp
      )
    );
  
    updateEmployeeLeaves(id, emp.availedLeaves, emp.addOnLeaves, newValue);
  };

  useEffect(() => {
    const newPrevAddOnLeaves = {};
    attendanceData.forEach(emp => {
      newPrevAddOnLeaves[emp.id] = calculateAddOnLeaves(emp);
    });
    setPrevAddOnLeaves(newPrevAddOnLeaves);
  }, [selectedMonth]);

  const filteredEmployees = useMemo(() => {
    return attendanceData.map((emp) => ({
      ...emp,
      addOnLeaves: prevAddOnLeaves[emp.id] || 0
    })).filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [attendanceData, searchTerm, prevAddOnLeaves]);

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="div1">
          <h1 className="header">Employee Attendance</h1>
          <p className="subtext">All the employees of the company are listed here</p>
        </div>
        <div className="div2">
          <button className="download-btn"><FaDownload /></button>
          <button className="Add">+ Add Employee</button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Employee Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-dropdown"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-dropdown"
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="attendance-table">
        <div>
          <h2>{selectedMonth}</h2>
        </div>
        <div>
          <table>
            <thead className='table-head'>
              <tr>
                <th>Employee Name</th>
                <th>Days in Month</th>
                <th>Paid Leaves</th>
                <th>Availed Leaves</th>
                <th>Add-on Leaves</th>
                <th>Unpaid Leaves</th>
                <th>Present Days</th>
                <th>Payable Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{getDaysInMonth(selectedMonth, selectedYear)}</td>
                  <td>2</td>
                  <td>
                    <input
                      type="number"
                      value={emp.availedLeaves}
                      onChange={(e) => handleAvailedLeaveChange(emp.id, e.target.value)}
                      min="0"
                      max="2"
                      className="unpaid-leave-input"
                    />
                  </td>
                  <td>{emp.addOnLeaves}</td>
                  <td>
                    <input
                      type="number"
                      value={emp.unpaidLeaves}
                      onChange={(e) => handleUnpaidLeaveChange(emp.id, e.target.value)}
                      min="0"
                      className="unpaid-leave-input"
                    />
                  </td>
                  <td>{getDaysInMonth(selectedMonth, selectedYear) - emp.unpaidLeaves}</td>
                  <td>₹ {calculatePayable(emp).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
