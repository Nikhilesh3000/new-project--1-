const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Database connection file

router.get("/salary-data", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM salary_data"); // Use async/await
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the router
module.exports = router;