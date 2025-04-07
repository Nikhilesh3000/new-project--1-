import express from "express";
const router = express.Router();
import db from "./config/db.js"; // if db.js is inside backend1/config/
 // Adjust path as needed

// ✅ Fetch all salary deductions
router.get("/", (req, res) => {
  db.query("SELECT * FROM salary_deduction", (err, results) => {
    if (err) {
      console.error("❌ Error fetching salary deductions:", err);
      return res.status(500).json({ error: "Database Error" });
    }
    res.json(results);
  });
});

// ✅ Add a new salary deduction entry
router.post("/", (req, res) => {
  const { employee_id, deduction_type, amount, deduction_date, reason } = req.body;

  db.query(
    "INSERT INTO salary_deduction (employee_id, deduction_type, amount, deduction_date, reason) VALUES (?, ?, ?, ?, ?)",
    [employee_id, deduction_type, amount, deduction_date, reason],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting salary deduction:", err);
        return res.status(500).json({ error: "Database Error" });
      }
      res.json({ message: "Salary deduction added successfully", deductionId: result.insertId });
    }
  );
});

// ✅ Delete a salary deduction entry by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM salary_deduction WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Error deleting salary deduction:", err);
      return res.status(500).json({ error: "Database Error" });
    }
    res.json({ message: "Salary deduction deleted successfully" });
  });
});

export default router;
