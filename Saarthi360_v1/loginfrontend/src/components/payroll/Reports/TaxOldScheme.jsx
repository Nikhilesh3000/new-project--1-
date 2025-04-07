import { useEffect } from 'react';
import axios from 'axios';

const TaxOldScheme = ({ setTableData }) => {
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
    const salary = (employee.salary * 12) || 0;
    const bonus = employee.bonus || 0;
    const stdDeduction = salary > 0 ? 50000 : 0;
    const professionTax = -2500;

    // HRA Calculation
    const basic50 = salary * 0.5;
    const hra50 = basic50;
    const rentPaid = employee.rentPaid || 0;
    const basic502 = basic50 / 2;
    const rentPaidAdjusted = rentPaid > 0 ? rentPaid - (basic50 * 0.1) : 0;
    const hraDeduction = Math.min(basic50 / 2, hra50, rentPaidAdjusted);

    // Interest on Housing Loan
    const interestOnHousingLoan = employee.housingLoan || 0;
    const deduction = -Math.min(interestOnHousingLoan, 200000);

    // Chapter VIA Deductions
    const lic80c = employee.lic80c || 150000;
    const elss80c = employee.elss80c || 50000;
    const ppf80c = employee.ppf80c || 0;
    const deduction80c = Math.min(lic80c + elss80c + ppf80c, 150000);

    const mediclaim80d = employee.mediclaim80d || 0;
    const parentsMediclaim = employee.parentsMediclaim || 0;
    const deduction80d = Math.min(mediclaim80d + parentsMediclaim, 75000);

    const totalChpViaDeduction = -deduction80c - deduction80d;

    // Net Income
    const netIncome =
      salary +
      bonus +
      stdDeduction +
      professionTax +
      deduction +
      hraDeduction +
      totalChpViaDeduction;

    // Tax Calculation
    const tax =
      netIncome > 1000000
        ? (netIncome - 1000000) * 0.3 + 112500
        : netIncome > 500000
        ? (netIncome - 500000) * 0.2 + 12500
        : netIncome > 250000
        ? (netIncome - 250000) * 0.05
        : 0;

    // Rebate u/s 87A
    const rebate87A = netIncome <= 500000 ? -Math.min(tax, 12500) : 0;

    // Net Tax + Cess
    const netTaxCess = tax + rebate87A + (tax + rebate87A > 0 ? (tax + rebate87A) * 0.04 : 0);

    // TDS p.m. plus Bonus
    const tdsPmPlusBonus = netTaxCess / 12;

    return {
      id: employee.id,
      name: employee.name,
      pan: employee.pan_number || '-',
      salary,
      bonus,
      stdDeduction,
      professionTax,
      basic50,
      hra50,
      rentPaid,
      basic502,
      rentPaidAdjusted,
      hraDeduction,
      interestOnHousingLoan,
      deduction,
      lic80c,
      elss80c,
      ppf80c,
      deduction80c,
      mediclaim80d,
      parentsMediclaim,
      deduction80d,
      totalChpViaDeduction,
      netIncome,
      tax,
      rebate87A,
      netTaxCess,
      tdsPmPlusBonus,
    };
  };

  const particulars = [
    { label: 'PAN Number', key: 'pan' },
    { label: 'Salary (April 2023 - March 2024)', key: 'salary' },
    { label: 'Bonus/Incentives', key: 'bonus' },
    { label: 'Std Deduction', key: 'stdDeduction' },
    { label: 'Profession Tax', key: 'professionTax' },
    { label: 'Basic (50%)', key: 'basic50' },
    { label: 'HRA (50%)', key: 'hra50' },
    { label: 'Rent Paid', key: 'rentPaid' },
    { label: '50% of Basic', key: 'basic502' },
    { label: 'Rent Paid - 10% Basic', key: 'rentPaidAdjusted' },
    { label: 'HRA Deduction', key: 'hraDeduction' },
    { label: 'Interest on Housing Loan', key: 'interestOnHousingLoan' },
    { label: 'Deduction', key: 'deduction' },
    { label: 'LIC (80C)', key: 'lic80c' },
    { label: 'ELSS (80C)', key: 'elss80c' },
    { label: 'PPF (80C)', key: 'ppf80c' },
    { label: '80C Deduction', key: 'deduction80c' },
    { label: 'Mediclaim (80D)', key: 'mediclaim80d' },
    { label: 'Parents Mediclaim', key: 'parentsMediclaim' },
    { label: '80D Deduction', key: 'deduction80d' },
    { label: 'Total Chp VIA Deduction', key: 'totalChpViaDeduction' },
    { label: 'Net Income', key: 'netIncome' },
    { label: 'Tax', key: 'tax' },
    { label: 'Less: Rebate u/s 87A', key: 'rebate87A' },
    { label: 'Net Tax + Cess', key: 'netTaxCess' },
    { label: 'TDS p.m. plus Bonus', key: 'tdsPmPlusBonus' },
  ];

  return null;
};

export default TaxOldScheme;