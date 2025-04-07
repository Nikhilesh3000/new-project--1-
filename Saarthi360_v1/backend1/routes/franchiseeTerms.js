const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all franchisee terms
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM franchisee_terms");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
