import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import "./Taxation.css";

const Taxation = () => {
  const [gstData, setGstData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("FY 2022-23");

  // ✅ Fetch GST Data from MySQL Backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/gst-rates")
      .then((response) => {
        setGstData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching GST data:", error);
      });
  }, []);

  return (
    <div className="taxation-container">
      <h2 className="header">Talent Corner HR Services Pvt. Ltd</h2>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button className="tab">Income Tax</button>
        <button className="tab active">GST</button>
        <button className="tab">TDS</button>
      </div>

      {/* Year Selection Dropdown */}
      <div className="year-selector">
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option>FY 2022-23</option>
          <option>FY 2023-24</option>
        </select>
      </div>

      {/* GST Data Table */}
      <div className="table-container">
        <table className="tax-table">
          <thead>
            <tr>
              <th>INCOME / EXP HEAD</th>
              <th>GST RATE</th>
              <th>HSN CODE</th>
              <th>VENDOR STATUS</th>
              <th>TDS RATE</th>
              <th>THRESHOLD FOR GST</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gstData.length > 0 ? (
              gstData.map((row, index) => (
                <tr key={index}>
                  <td>{row.income_exp_head}</td>
                  <td>{row.gst_rate}%</td>
                  <td>{row.hsn_code}</td>
                  <td>{row.vendor_status}%</td>
                  <td>{row.tds_rate}%</td>
                  <td>{row.threshold_gst}</td>
                  <td>
                    <FiTrash className="delete-icon" onClick={() => console.log("Delete", row.income_exp_head)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Taxation;
