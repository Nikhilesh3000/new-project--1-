import React, { useEffect, useState } from "react";

const SalaryDeduction = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/salary-deduction")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching salary deductions:", error));
  }, []);

  return (
    <div>
      <h2>Salary Deductions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Head Component</th>
            <th>Eligibility</th>
            <th>Limit Description</th>
            <th>Period</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.head_component}</td>
              <td>{item.eligibility}</td>
              <td>{item.limit_description}</td>
              <td>{item.period}</td>
              <td>{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryDeduction;