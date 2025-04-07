const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Ensure correct database connection

// ✅ Fetch all TDS data
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tds_table"); // Ensure `tds_table` exists in MySQL
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new TDS entry
router.post("/", async (req, res) => {
  const { income_exp_head, tds_rate, applicable_limit } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO tds_table (income_exp_head, tds_rate, applicable_limit) VALUES (?, ?, ?)",
      [income_exp_head, tds_rate, applicable_limit]
    );
    res.json({ message: "TDS entry added successfully", tdsId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a TDS entry by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM tds_table WHERE id = ?", [id]);
    res.json({ message: "TDS entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
