const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Ensure correct database connection

// ✅ Fetch all GST data
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM gst_table"); // Ensure `gst_table` exists in MySQL
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new GST entry
router.post("/", async (req, res) => {
  const { income_exp_head, gst_rate, hsn_code, vendor_status, tds_rate, threshold_gst } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO gst_table (income_exp_head, gst_rate, hsn_code, vendor_status, tds_rate, threshold_gst) VALUES (?, ?, ?, ?, ?, ?)",
      [income_exp_head, gst_rate, hsn_code, vendor_status, tds_rate, threshold_gst]
    );
    res.json({ message: "GST entry added successfully", gstId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a GST entry by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM gst_table WHERE id = ?", [id]);
    res.json({ message: "GST entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
