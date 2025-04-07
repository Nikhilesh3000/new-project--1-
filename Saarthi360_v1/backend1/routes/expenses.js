const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all expenses
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM expenses");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add a new expense
router.post("/", async (req, res) => {
  const { category, amount, date, description } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO expenses (category, amount, date, description) VALUES (?, ?, ?, ?)",
      [category, amount, date, description]
    );
    res.json({ message: "Expense added successfully", expenseId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
