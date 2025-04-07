import db from "../config/db.js"
import { v4 as uuidv4 } from "uuid"

export const saveExpenditure = (req, res) => {
  const { vendorId, expensesHead, date, amount, gst, tds, net, remarks } = req.body
  const file = req.file
  const filePath = file ? file.filename : null
  const uuid = uuidv4()

  const sql = `
    INSERT INTO expenditure 
    (uuid, vendorId, expensesHead, date, amount, gst, tds, net, remarks, filePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [uuid, vendorId, expensesHead, date, amount, gst, tds, net, remarks, filePath],
    (error, results) => {
      if (error) return res.status(500).json({ error: "Failed to save expenditure" })
      res.json({ message: "Expenditure saved successfully", id: uuid })
    }
  )
}

export const getExpenditures = (req, res) => {
  const sql = `
    SELECT e.*, v.vendorName 
    FROM expenditure e 
    JOIN vendor v ON e.vendorId = v.id
    ORDER BY e.date DESC
  `
  db.query(sql, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch expenditures" })
    res.json(results)
  })
}

export const updateExpenditure = (req, res) => {
  const { id } = req.params
  const { vendorId, expensesHead, date, amount, gst, tds, net, remarks } = req.body
  const file = req.file
  const filePath = file ? file.filename : null

  const sql = `
    UPDATE expenditure 
    SET vendorId = ?, expensesHead = ?, date = ?, amount = ?, gst = ?, tds = ?, net = ?, remarks = ?, filePath = ?
    WHERE uuid = ?
  `
  db.query(
    sql,
    [vendorId, expensesHead, date, amount, gst, tds, net, remarks, filePath, id],
    (error, results) => {
      if (error) return res.status(500).json({ error: "Failed to update expenditure" })
      res.json({ message: "Expenditure updated successfully" })
    }
  )
}

export const deleteExpenditure = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM expenditure WHERE uuid = ?", [id], (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to delete expenditure" })
    res.json({ message: "Expenditure deleted successfully" })
  })
}
