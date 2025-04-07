import { useEffect } from 'react';
import axios from 'axios';

const TaxSchemeComparison = ({ setTableData }) => {
  useEffect(() => {
    // Fetch employee data from the backend
    axios
      .get('http://localhost:8080/api/employees') // Replace with your API endpoint
      .then((response) => {
        const employees = response.data || [];
        const rowData = employees.map(calculateRowData);
        setTableData(rowData);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  }, [setTableData]);

  const calculateRowData = (employee) => {
    // Old Scheme Calculation
    const oldSchemeTax = calculateOldSchemeTax(employee);

    // New Scheme Calculation
    const newSchemeTax = calculateNewSchemeTax(employee);

    // Determine the better scheme
    const betterScheme = oldSchemeTax < newSchemeTax ? 'Old Scheme' : 'New Scheme';

    // Calculate Tax Saving
    const taxSaving = Math.abs(oldSchemeTax - newSchemeTax);

    return {
      id: employee.id,
      name: employee.name,
      pan: employee.pan_number || '-',
      oldSchemeTax,
      newSchemeTax,
      betterScheme,
      taxSaving,
    };
  };

  const calculateOldSchemeTax = (employee) => {
    const salary = (employee.salary * 12) || 0;
    const bonus = employee.bonus || 0;
    const stdDeduction = salary > 0 ? 50000 : 0;
    const professionTax = -2500;

    const basic50 = salary * 0.5;
    const hra50 = basic50;
    const rentPaid = employee.rentPaid || 0;
    const rentPaidAdjusted = rentPaid > 0 ? rentPaid - (basic50 * 0.1) : 0;
    const hraDeduction = Math.min(basic50 / 2, hra50, rentPaidAdjusted);

    const interestOnHousingLoan = employee.housingLoan || 0;
    const deduction = -Math.min(interestOnHousingLoan, 200000);

    const lic80c = employee.lic80c || 150000;
    const elss80c = employee.elss80c || 50000;
    const ppf80c = employee.ppf80c || 0;
    const deduction80c = Math.min(lic80c + elss80c + ppf80c, 150000);

    const mediclaim80d = employee.mediclaim80d || 0;
    const parentsMediclaim = employee.parentsMediclaim || 0;
    const deduction80d = Math.min(mediclaim80d + parentsMediclaim, 75000);

    const totalChpViaDeduction = -deduction80c - deduction80d;

    const netIncome =
      salary +
      bonus +
      stdDeduction +
      professionTax +
      deduction +
      hraDeduction +
      totalChpViaDeduction;

    const tax =
      netIncome > 1000000
        ? (netIncome - 1000000) * 0.3 + 112500
        : netIncome > 500000
        ? (netIncome - 500000) * 0.2 + 12500
        : netIncome > 250000
        ? (netIncome - 250000) * 0.05
        : 0;

    const rebate87A = netIncome <= 500000 ? -Math.min(tax, 12500) : 0;

    const netTaxCess = tax + rebate87A + (tax + rebate87A > 0 ? (tax + rebate87A) * 0.04 : 0);

    return netTaxCess;
  };

  const calculateNewSchemeTax = (employee) => {
    const salary = (employee.salary * 12) || 0;
    const bonus = employee.bonus || 0;

    const netIncome = salary + bonus;

    const tax =
      netIncome > 1500000
        ? (netIncome - 1500000) * 0.3 + 187500
        : netIncome > 1250000
        ? (netIncome - 1250000) * 0.25 + 125000
        : netIncome > 1000000
        ? (netIncome - 1000000) * 0.2 + 75000
        : netIncome > 750000
        ? (netIncome - 750000) * 0.15 + 37500
        : netIncome > 500000
        ? (netIncome - 500000) * 0.1 + 12500
        : netIncome > 250000
        ? (netIncome - 250000) * 0.05
        : 0;

    const rebate87A = netIncome <= 700000 ? -Math.min(tax, 25000) : 0;

    const netTaxCess = tax + rebate87A + (tax + rebate87A > 0 ? (tax + rebate87A) * 0.04 : 0);

    return netTaxCess;
  };

  const particulars = [
    { label: 'PAN Number', key: 'pan' },
    { label: 'Old Scheme Tax', key: 'oldSchemeTax' },
    { label: 'New Scheme Tax', key: 'newSchemeTax' },
    { label: 'Better Scheme', key: 'betterScheme' },
    { label: 'Tax Saving', key: 'taxSaving' },
  ];

  return null;
};

export default TaxSchemeComparison;