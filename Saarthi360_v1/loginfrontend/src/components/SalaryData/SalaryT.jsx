import React, { useEffect, useState } from "react";

const SalaryTable = () => {
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/salary-data") // ✅ API Call
      .then((res) => res.json())
      .then((data) => setSalaryData(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div>
      <h2>Salary Data</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Head Component</th>
            <th>Eligibility</th>
            <th>Limit</th>
            <th>Period</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {salaryData.map((item) => (
            <tr key={item.id}>
              <td>{item.head_component}</td>
              <td>{item.eligibility}</td>
              <td>{item.limit}</td>
              <td>{item.period}</td>
              <td>{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;