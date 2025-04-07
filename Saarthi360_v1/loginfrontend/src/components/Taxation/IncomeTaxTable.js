import React, { useEffect, useState } from "react";

const GSTTable = () => {
  const [gstData, setGstData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/income-tax-slabs") // ✅ Backend API Call
      .then((res) => res.json())
      .then((data) => setGstData(data))
      .catch((err) => console.error("Error fetching GST data:", err));
  }, []);

  return (
    <div>
      <h2>GST Taxation</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Income/Exp Head</th>
            <th>GST Rate (%)</th>
            <th>HSN Code</th>
            <th>Vendor Status (%)</th>
            <th>TDS Rate (%)</th>
            <th>Threshold for GST</th>
          </tr>
        </thead>
        <tbody>
          {gstData.length > 0 ? (
            gstData.map((gst) => (
              <tr key={gst.id}>
                <td>{gst.income_exp_head}</td>
                <td>{gst.gst_rate}</td>
                <td>{gst.hsn_code}</td>
                <td>{gst.vendor_status}</td>
                <td>{gst.tds_rate}</td>
                <td>{gst.threshold_gst}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No GST Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GSTTable;
