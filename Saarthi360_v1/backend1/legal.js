import express from "express"
import mysql from "mysql"
import cors from "cors"
import bodyParser from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage: storage })

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if using a different user
  password: "Root@12345", // Add your MySQL password
  database: "crm_db", // Change to your actual database name
  port: 3306, // Default MySQL port
})

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err)
    return
  }
  console.log("Connected to MySQL database")
})

// Create a new legal client entry
app.post("/legals_info", (req, res) => {
  const data = req.body
  const sql = `INSERT INTO legals_info SET ?`
  db.query(sql, data, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err)
      return res.status(500).json({ error: "Database error", details: err.message })
    }
    res.status(201).json({ message: "Legal data added successfully", id: result.insertId })
  })
})

// Get all legal clients
app.get("/legals_info", (req, res) => {
  const sql = "SELECT * FROM legals_info ORDER BY created_at DESC"
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).json({ error: "Database error", details: err.message })
    }
    res.json(results)
  })
})

// Get a single legal client by ID
app.get("/legals_info/:id", (req, res) => {
  const sql = "SELECT * FROM legals_info WHERE id = ?"
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).json({ error: "Database error", details: err.message })
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Legal data not found" })
    }
    res.json(result[0])
  })
})

// Update a legal client entry
app.put("/legals_info/:id", (req, res) => {
  const data = req.body
  const sql = "UPDATE legals_info SET ? WHERE id = ?"
  db.query(sql, [data, req.params.id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err)
      return res.status(500).json({ error: "Database error", details: err.message })
    }
    res.json({ message: "Legal data updated successfully" })
  })
})

// Delete a legal client entry
app.delete("/legals_info/:id", (req, res) => {
  const sql = "DELETE FROM legals_info WHERE id = ?"
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err)
      return res.status(500).json({ error: "Database error", details: err.message })
    }
    res.json({ message: "Legal data deleted successfully" })
  })
})

// File upload endpoint
app.post(
  "/upload",
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "contractEmail", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files
      const fileData = {}

      if (files.gstCertificate) {
        fileData.gstCertificateFile = files.gstCertificate[0].filename
      }

      if (files.contractEmail) {
        fileData.contractEmailFile = files.contractEmail[0].filename
      }

      res.status(200).json({
        message: "Files uploaded successfully",
        files: fileData,
      })
    } catch (error) {
      console.error("Error uploading files:", error)
      res.status(500).json({ error: "File upload failed", details: error.message })
    }
  },
)

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

