const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all client terms
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM client_terms");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
