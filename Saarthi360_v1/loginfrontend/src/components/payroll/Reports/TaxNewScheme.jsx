import { useEffect } from 'react';
import axios from 'axios';

const TaxNewScheme = ({ setTableData }) => {
  useEffect(() => {
    // Fetch employee data from the backend
    axios
      .get('http://localhost:8080/api/employees') // Replace with your API endpoint
      .then((response) => {
        const employees =  response.data || []; // Ensure employees is an array
        const rowData = employees.map(calculateRowData); // Map over the array
        setTableData(rowData); // Pass both rowData and particulars
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  }, [setTableData]);

  const calculateRowData = (employee) => {
    const salary = (employee.salary * 12) || 0; // Annual salary
    const bonus = 0; // Bonus is always 0
    const stdDeduction = salary > 0 ? 50000 : 0; // Standard deduction
    const netIncome = salary - stdDeduction; // Net income calculation

    // Tax calculation based on the new scheme
    const tax =
      netIncome > 1500000
        ? (netIncome - 1500000) * 0.3 + 150000
        : netIncome > 1200000
        ? (netIncome - 1200000) * 0.2 + 90000
        : netIncome > 900000
        ? (netIncome - 900000) * 0.15 + 45000
        : netIncome > 600000
        ? (netIncome - 600000) * 0.1 + 15000
        : netIncome > 300000
        ? (netIncome - 300000) * 0.05
        : 0;

    // Less Rebate u/s 87A
    const rebate87A = netIncome <= 700000 ? Math.min(tax, 25000) : 0;

    // Net Tax + Cess
    const netTaxCess =
      tax +
      rebate87A +
      (tax + rebate87A > 0 ? (tax + rebate87A) * 0.04 : 0);

    // TDS p.m. plus Bonus
    const tdsPmPlusBonus = netTaxCess / 12;

    return {
      id: employee.id,
      name: employee.name,
      pan: employee.pan_number || '-', // PAN number
      salary, // Annual salary
      bonus, // Bonus
      stdDeduction, // Standard deduction
      netIncome, // Net income
      tax, // Calculated tax
      rebate87A, // Less Rebate u/s 87A
      netTaxCess, // Net Tax + Cess
      tdsPmPlusBonus, // TDS p.m. plus Bonus
    };
  };

  const particulars = [
    { label: 'PAN Number', key: 'pan' },
    { label: 'Salary (April 2023 - March 2024)', key: 'salary' },
    { label: 'Bonus/Incentives', key: 'bonus' },
    { label: 'Std Deduction', key: 'stdDeduction' },
    { label: 'Net Income', key: 'netIncome' },
    { label: 'Tax', key: 'tax' },
    { label: 'Less: Rebate u/s 87A', key: 'rebate87A' },
    { label: 'Net Tax + Cess', key: 'netTaxCess' },
    { label: 'TDS p.m. plus Bonus', key: 'tdsPmPlusBonus' },
  ];

  return null; // This component only fetches and calculates data
};

export default TaxNewScheme;