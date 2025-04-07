import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SalaryPaymentsBulk.css';

function CustomTable({ columns, data, onCheckboxChange }) {

  const location = useLocation();
    const containerHeight = location.pathname === '/pay-sheet' 
    ? { height: '60vh' } 
    : {}; 

  return (
    <div className="custom-table-container" style={containerHeight}>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${row.status === 'Paid' ? 'row-paid' : ''} ${
                row.isSelected ? 'row-selected' : ''
              }`} 
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className}>
                  {column.accessor === 'isSelected' ? (
                    <input
                      type="checkbox"
                      checked={row.isSelected}
                      onChange={() => onCheckboxChange(rowIndex)}
                    />
                  ) : column.accessor === 'status' ? (
                    row.status // Display the status directly
                  ) : column.accessor === 'action' ? (
                    <div className="salary-payment-action">
                      <i className="fas fa-edit edit-icon" title="Edit"></i>
                      <i className="fas fa-trash delete-icon" title="Delete"></i>
                    </div>
                  ) : (
                    row[column.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*
export const payrolls = [
  { name: 'Aagam Sheth', salary: 29254, status: 'Unpaid' },
  { name: 'Avadai Marthuvar', salary: 29254, status: 'Unpaid' },
  { name: 'Hrutika Mohal', salary: 22570, status: 'Paid' },
  { name: 'Jahnvi Thakker', salary: 50000, status: 'Unpaid' },
  { name: 'Joyeeta Khaskel', salary: 68550, status: 'Unpaid' },
  { name: 'Komal Bhanushali', salary: 68550, status: 'Unpaid' },
  { name: 'Preshita Rane', salary: 51950, status: 'Unpaid' },
  { name: 'Priyanka Panjwani', salary: 51950, status: 'Unpaid' },
  { name: 'Rajalaxmi Das', salary: 58786, status: 'Unpaid' },
  { name: 'Rashesh Doshi', salary: 150000, status: 'Unpaid' },
  { name: 'Rushali Rajgor', salary: 17000, status: 'Unpaid' },
  { name: 'Snehal kadu', salary: 51950, status: 'Unpaid' },
  { name: 'Surbhi Jain', salary: 68550, status: 'Unpaid' },
  { name: 'Vaishnavi Bhagat', salary: 43160, status: 'Paid' },
  { name: 'Vedika Tolani', salary: 34254, status: 'Unpaid' },
  { name: 'Jagruti Doshi', salary: 40000, status: 'Unpaid' },
  { name: 'Kajal Khamkar', salary: 18595, status: 'Unpaid' },
  { name: 'Nishi Doshi', salary: 22500, status: 'Unpaid' },
  { name: 'Deepti Singh', salary: 21870, status: 'Paid' },
  { name: 'Bankim Doshi', salary: 150000, status: 'Unpaid' },
  { name: 'Nita Doshi', salary: 40000, status: 'Unpaid' },
  { name: 'Pragya Doshi', salary: 50000, status: 'Unpaid' },
  { name: 'Chaitali Doshi', salary: 50000, status: 'Unpaid' },
  { name: 'Preeti Doshi', salary: 50000, status: 'Unpaid' },
  { name: 'Kinjal Patel', salary: 40000, status: 'Unpaid' },
  { name: 'Minal Sanghvi', salary: 100000, status: 'Unpaid' },
  { name: 'Jigna Sanghvi', salary: 100000, status: 'Paid' },
  { name: 'SAUMYA KIRIT GALA', salary: 100000, status: 'Unpaid' },
  { name: 'Shreya Santosh Talashilkar', salary: 29454, status: 'Unpaid' },
];
*/

function Payroll({ month, year, filteredPayrollData, onSelectedRowsChange }) {

  const [payrollData, setPayrollData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // used further, don't delete

  const generatePayrollData = (employees = []) => {
    return employees.map((payroll) => {
      const daysInMonth = new Date(year, new Date(Date.parse(month + " 1")).getMonth() + 1, 0).getDate();
      const paidDays = daysInMonth - (payroll.unpaid_leaves || 0);
      const fixedGrossSalary = (payroll.salary / daysInMonth) * paidDays;
      const basicDA = Math.round(payroll.salary * 0.5);
      const hra = Math.round(basicDA * 0.5);
      const conveyance = 1200;
      const medicalAllow = 1000;
      const otherAllowance = payroll.salary - hra - basicDA - conveyance - medicalAllow;
      const gross = basicDA + hra + conveyance + medicalAllow + otherAllowance;
      const earnBasic = Math.round((basicDA / daysInMonth) * paidDays);
      const earnHRA = Math.round((hra / daysInMonth) * paidDays);
      const earnConveyance = Math.round((conveyance / daysInMonth) * paidDays);
      const earnMedicalAllow = Math.round((medicalAllow / daysInMonth) * paidDays);
      const incentive = 0;
      const earnOtherAllo = Math.round((otherAllowance / daysInMonth) * paidDays);
      const earnGross = earnBasic + earnHRA + earnConveyance + earnMedicalAllow + earnOtherAllo;
      const pfWages = earnGross - earnHRA;
      const pf = Math.round(pfWages >= 15000 ? 1800 : pfWages * 0.12);
      const esic = Math.ceil(gross >= 21001 ? 0 : earnGross * 0.0075);
      const pt = 200;
      const lwf = 25;
      const advance = 0;
      const totalDeduction = pf + esic + pt + lwf + advance;
      const netPayable = earnGross - totalDeduction;
      const graduity = Math.round(earnBasic * 0.0481) + 1;
      const employerPF = Math.round(pf);
      const employerESIC = Math.ceil(gross >= 21001 ? 0 : earnGross * 0.0325);
      const bonus = Math.round(basicDA * 0.0833);
      const employerLWF = lwf * 3;
      const ctc = earnGross + employerPF + employerESIC + graduity + employerLWF;

      return {
        id: payroll.id || 0,
        name: payroll.name || '',
        dateOfJoining: payroll.date_of_joining || '-',
        salary: payroll.salary || 0,
        daysInMonth,
        paidDays,
        fixedGrossSalary: `${fixedGrossSalary}`,
        basicDA: `${basicDA}`,
        hra: `${hra}`,
        conveyance: `${conveyance}`,
        medicalAllow: `${medicalAllow}`,
        otherAllowance: `${otherAllowance.toFixed(2)}`,
        gross: `${gross.toFixed(2)}`,
        earnBasic: `${earnBasic}`,
        earnHRA: `${earnHRA}`,
        earnConveyance: `${earnConveyance}`,
        earnMedicalAllow: `${earnMedicalAllow}`,
        incentive: `${incentive}`,
        earnOtherAllo: `${earnOtherAllo}`,
        earnGross: `${earnGross}`,
        pfWages: `${pfWages}`,
        pf: `${pf}`,
        esic: `${esic}`,
        pt: `${pt}`,
        lwf: `${lwf}`,
        advance: `${advance}`,
        totalDeduction: `${totalDeduction}`,
        netPayable: `${netPayable}`,
        graduity: `${graduity}`,
        employerPF: `${employerPF}`,
        employerESIC: `${employerESIC}`,
        bonus: `${bonus}`,
        employerLWF: `${employerLWF}`,
        ctc: `${ctc}`,
        remark: '-',
        remark2: '-',
        isSelected: false,
        status: payroll.status || 'Unpaid',
        action: '',
      };
    });
  };

  useEffect(() => {
    setPayrollData(generatePayrollData(filteredPayrollData));
  }, [filteredPayrollData]);

  useEffect(() => {
    const generatedData = generatePayrollData(filteredPayrollData);

    const updatedData = generatedData.map((newRow) => {
      const existingRow = payrollData.find((row) => row.id === newRow.id);
      return existingRow ? { ...newRow, isSelected: existingRow.isSelected } : newRow;
    });

    setPayrollData(updatedData);
  }, [filteredPayrollData]);

  const handleCheckboxChange = (index) => {
    const updatedData = [...payrollData];
    const employeeId = updatedData[index].id;
  
    // Toggle the selection state
    let updatedSelectedRows;
    if (selectedRows.includes(employeeId)) {
      updatedSelectedRows = selectedRows.filter((id) => id !== employeeId); // Remove ID if already selected
    } else {
      updatedSelectedRows = [...selectedRows, employeeId]; // Add ID if not selected
    }
  
    // Update the isSelected property in payrollData based on selectedRows
    updatedData.forEach((row) => {
      row.isSelected = updatedSelectedRows.includes(row.id);
    });
    
    console.log('Updated payrollData:', updatedData); // Debugging: Check isSelected updates
  
    setPayrollData(updatedData); // Update payrollData state
    setSelectedRows(updatedSelectedRows); // Update selectedRows array
    console.log('Selected Employee IDs:', updatedSelectedRows); // Debugging
  
    onSelectedRowsChange(updatedSelectedRows); // Notify parent component
  };
  
  const columns = [
    { header: 'Sr. No', accessor: 'id', className: 'sticky-column-left' },
    { header: 'Employee Name', accessor: 'name', className: 'sticky-column-left' },
    { header: 'Date of Joining', accessor: 'dateOfJoining' },
    { header: 'Days in month', accessor: 'daysInMonth' },
    { header: 'Paid Days', accessor: 'paidDays' },
    { header: 'Fixed GROSS Salary (NEW)', accessor: 'fixedGrossSalary' },
    { header: 'Basic + DA', accessor: 'basicDA' },
    { header: 'HRA', accessor: 'hra' },
    { header: 'Conveyance', accessor: 'conveyance' },
    { header: 'Medical Allow', accessor: 'medicalAllow' },
    { header: 'Other ALLOWANCE', accessor: 'otherAllowance' },
    { header: 'Gross', accessor: 'gross' },
    { header: 'Earn basic', accessor: 'earnBasic' },
    { header: 'Earn HRA', accessor: 'earnHRA' },
    { header: 'Conveyance', accessor: 'earnConveyance' },
    { header: 'Medical Allow', accessor: 'earnMedicalAllow' },
    { header: 'Incentive', accessor: 'incentive' },
    { header: 'Earn OTHER Allo', accessor: 'earnOtherAllo' },
    { header: 'Earn Gross', accessor: 'earnGross' },
    { header: 'PF WAGES', accessor: 'pfWages' },
    { header: 'PF', accessor: 'pf' },
    { header: 'ESIC', accessor: 'esic' },
    { header: 'PT', accessor: 'pt' },
    { header: 'LWF', accessor: 'lwf' },
    { header: 'Advance', accessor: 'advance' },
    { header: 'Total Deduction', accessor: 'totalDeduction' },
    { header: 'Net Payable', accessor: 'netPayable' },
    { header: 'Graduity', accessor: 'graduity' },
    { header: 'EMPYER PF', accessor: 'employerPF' },
    { header: 'EMPYER ESIC', accessor: 'employerESIC' },
    { header: 'Bonus', accessor: 'bonus' },
    { header: 'EMPLOYER LWF', accessor: 'employerLWF' },
    { header: 'CTC', accessor: 'ctc' },
    { header: 'Remark', accessor: 'remark' },
    { header: 'Remark2', accessor: 'remark2' },
    { header: '', accessor: 'isSelected', className: 'sticky-column-right' },
    { header: 'Status', accessor: 'status', className: 'sticky-column-right' },
    { header: 'Action', accessor: 'action', className: 'sticky-column-right' },
  ];

  return (
    <div>
      <CustomTable
        columns={columns}
        data={payrollData}
        onCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}

export default Payroll;