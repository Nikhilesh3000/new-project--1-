import React, { useEffect, useState } from "react";

const TDSTable = () => {
  const [tdsData, setTdsData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tds-rates") // ✅ Backend API Call
      .then((res) => res.json())
      .then((data) => setTdsData(data))
      .catch((err) => console.error("Error fetching TDS data:", err));
  }, []);

  return (
    <div>
      <h2>TDS Taxation</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Income/Exp Head</th>
            <th>TDS Rate (%)</th>
            <th>Applicable Limit</th>
          </tr>
        </thead>
        <tbody>
          {tdsData.length > 0 ? (
            tdsData.map((tds) => (
              <tr key={tds.id}>
                <td>{tds.income_exp_head}</td>
                <td>{tds.tds_rate}</td>
                <td>{tds.applicable_limit}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No TDS Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TDSTable;
