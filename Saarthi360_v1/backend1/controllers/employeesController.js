import db from "../config/db.js"; // ✅ correct: assuming db.js is in backend1/
import { processEmployeeData } from "../utils/formatHelpers.js";

export const getAllEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
};

export const getEmployeeById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: rows[0] });
  });
};

export const addEmployee = async (req, res) => {
  try {
    const employee = await processEmployeeData(req.body);
    if (!employee) return res.status(400).json({ error: "Invalid data" });

    db.query("INSERT INTO employees SET ?", employee, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query("SELECT * FROM employees WHERE id = ?", [result.insertId], (err, rows) => {
        if (err) return res.status(201).json({ message: "Created", id: result.insertId });
        res.status(201).json({ message: "Created", employee: rows[0] });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await processEmployeeData(req.body);

    db.query("UPDATE employees SET ? WHERE id = ?", [employee, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });

      db.query("SELECT * FROM employees WHERE id = ?", [id], (err, rows) => {
        if (err) return res.status(200).json({ message: "Updated" });
        res.status(200).json({ message: "Updated", employee: rows[0] });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted" });
  });
};
