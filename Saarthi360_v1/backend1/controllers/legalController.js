import db from "../config/db.js";

export const addLegal = (req, res) => {
  const data = req.body;
  const sql = `INSERT INTO legals_info SET ?`;
  db.query(sql, data, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    res.status(201).json({ message: "Legal data added", id: result.insertId });
  });
};

export const getAllLegals = (req, res) => {
  db.query("SELECT * FROM legals_info ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    res.json(results);
  });
};

export const getLegalById = (req, res) => {
  db.query("SELECT * FROM legals_info WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Legal data not found" });
    res.json(result[0]);
  });
};

export const updateLegal = (req, res) => {
  const data = req.body;
  db.query("UPDATE legals_info SET ? WHERE id = ?", [data, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    res.json({ message: "Legal data updated" });
  });
};

export const deleteLegal = (req, res) => {
  db.query("DELETE FROM legals_info WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    res.json({ message: "Legal data deleted" });
  });
};
