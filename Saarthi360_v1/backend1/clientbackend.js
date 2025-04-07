import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()
app.use(cors()),
app.use(express.json())

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@12345", // Use your actual MySQL password
  database: "crm_db",
  port: 3306,
})

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err)
    process.exit(1)
  }
  console.log("✅ Connected to MySQL Database!")
})

// Helper function to format dates from DD/MM/YYYY to MySQL format (YYYY-MM-DD)
function formatDateForMySQL(dateString) {
  if (!dateString) return null

  // Check if the date is in DD/MM/YYYY format
  const parts = dateString.split("/")
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}` // YYYY-MM-DD
  }

  return dateString // Return as is if not in expected format
}

// Helper function to format dates from MySQL to DD/MM/YYYY for frontend
function formatDateForFrontend(mysqlDate) {
  if (!mysqlDate) return ""

  const date = new Date(mysqlDate)
  if (isNaN(date.getTime())) return ""

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Add a new client
app.post("/api/clients_info", (req, res) => {
  // Format director names if it's an array
  let directorNames = req.body.directorNames
  if (Array.isArray(directorNames)) {
    directorNames = directorNames.filter((name) => name).join(";")
  }

  const sql = `INSERT INTO clients_info (
    companyName, bdMembersName, address, country, pinCode, city, state, industry, 
    subIndustry, website, gstNumber, establishmentYear, numberOfEmployees, 
    contactPersonName, contactDesignation, contactPhone, contactEmail, 
    additionalName, additionalDesignation, additionalPhone, additionalLandline, additionalEmail, 
    placementFees, creditPeriod, replacementPeriod, companyStatus, status, directorNames, 
    teamLeader, franchiseeName, dateClientAcquired, dateOfClientAllocation, 
    reallocationStatus, dateOfClientReallocation, newFranchisee, newTeamLeader
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

  const values = [
    req.body.companyName,
    req.body.bdMembersName,
    req.body.address,
    req.body.country,
    req.body.pinCode,
    req.body.city,
    req.body.state,
    req.body.industry,
    req.body.subIndustry,
    req.body.website,
    req.body.gstNumber,
    req.body.establishmentYear,
    req.body.numberOfEmployees,
    req.body.contactPersonName,
    req.body.contactDesignation,
    req.body.contactPhone,
    req.body.contactEmail,
    req.body.additionalName,
    req.body.additionalDesignation,
    req.body.additionalPhone,
    req.body.additionalLandline,
    req.body.additionalEmail,
    req.body.placementFees,
    req.body.creditPeriod,
    req.body.replacementPeriod,
    req.body.companyStatus,
    req.body.status || "pending",
    directorNames,
    req.body.teamLeader,
    req.body.franchiseeName,
    formatDateForMySQL(req.body.dateClientAcquired),
    formatDateForMySQL(req.body.dateOfClientAllocation),
    req.body.reallocationStatus || "No",
    formatDateForMySQL(req.body.dateOfClientReallocation),
    req.body.newFranchisee,
    req.body.newTeamLeader,
  ]

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client added successfully!", clientId: result.insertId })
  })
})

// Get all clients
app.get("/api/clients_info", (req, res) => {
  db.query("SELECT * FROM clients_info", (err, results) => {
    if (err) return res.status(500).json({ error: err.message })

    // Format the data for frontend
    const formattedResults = results.map((client) => ({
      ...client,
      directorNames: client.directorNames ? client.directorNames.split(";") : [],
      dateClientAcquired: formatDateForFrontend(client.dateClientAcquired),
      dateOfClientAllocation: formatDateForFrontend(client.dateOfClientAllocation),
      dateOfClientReallocation: formatDateForFrontend(client.dateOfClientReallocation),
    }))

    res.json(formattedResults)
  })
})

// Get a specific client
app.get("/api/clients_info/:id", (req, res) => {
  db.query("SELECT * FROM clients_info WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.length === 0) return res.status(404).json({ error: "Client not found" })

    // Format the data for frontend
    const client = result[0]
    client.directorNames = client.directorNames ? client.directorNames.split(";") : []
    client.dateClientAcquired = formatDateForFrontend(client.dateClientAcquired)
    client.dateOfClientAllocation = formatDateForFrontend(client.dateOfClientAllocation)
    client.dateOfClientReallocation = formatDateForFrontend(client.dateOfClientReallocation)

    res.json(client)
  })
})

// Update client details
app.put("/api/clients_info/:id", (req, res) => {
  // Format director names if it's an array
  let directorNames = req.body.directorNames
  if (Array.isArray(directorNames)) {
    directorNames = directorNames.filter((name) => name).join(";")
  }

  const sql = `UPDATE clients_info SET
    companyName=?, bdMembersName=?, address=?, country=?, pinCode=?, city=?, state=?, 
    industry=?, subIndustry=?, website=?, gstNumber=?, establishmentYear=?, numberOfEmployees=?, 
    contactPersonName=?, contactDesignation=?, contactPhone=?, contactEmail=?, 
    additionalName=?, additionalDesignation=?, additionalPhone=?, additionalLandline=?, additionalEmail=?, 
    placementFees=?, creditPeriod=?, replacementPeriod=?, companyStatus=?, status=?, directorNames=?, 
    teamLeader=?, franchiseeName=?, dateClientAcquired=?, dateOfClientAllocation=?, 
    reallocationStatus=?, dateOfClientReallocation=?, newFranchisee=?, newTeamLeader=?
    WHERE id=?`

  const values = [
    req.body.companyName,
    req.body.bdMembersName,
    req.body.address,
    req.body.country,
    req.body.pinCode,
    req.body.city,
    req.body.state,
    req.body.industry,
    req.body.subIndustry,
    req.body.website,
    req.body.gstNumber,
    req.body.establishmentYear,
    req.body.numberOfEmployees,
    req.body.contactPersonName,
    req.body.contactDesignation,
    req.body.contactPhone,
    req.body.contactEmail,
    req.body.additionalName,
    req.body.additionalDesignation,
    req.body.additionalPhone,
    req.body.additionalLandline,
    req.body.additionalEmail,
    req.body.placementFees,
    req.body.creditPeriod,
    req.body.replacementPeriod,
    req.body.companyStatus,
    req.body.status || "pending",
    directorNames,
    req.body.teamLeader,
    req.body.franchiseeName,
    formatDateForMySQL(req.body.dateClientAcquired),
    formatDateForMySQL(req.body.dateOfClientAllocation),
    req.body.reallocationStatus || "No",
    formatDateForMySQL(req.body.dateOfClientReallocation),
    req.body.newFranchisee,
    req.body.newTeamLeader,
    req.params.id,
  ]

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client updated successfully!" })
  })
})

// Delete a client
app.delete("/api/clients_info/:id", (req, res) => {
  db.query("DELETE FROM clients_info WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client deleted successfully!" })
  })
})

// Search clients
app.get("/api/clients_info/search/:term", (req, res) => {
  const searchTerm = `%${req.params.term}%`

  const sql = `SELECT * FROM clients_info 
               WHERE companyName LIKE ? 
               OR contactPersonName LIKE ? 
               OR city LIKE ? 
               OR industry LIKE ?`

  db.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })

    // Format the data for frontend
    const formattedResults = results.map((client) => ({
      ...client,
      directorNames: client.directorNames ? client.directorNames.split(";") : [],
      dateClientAcquired: formatDateForFrontend(client.dateClientAcquired),
      dateOfClientAllocation: formatDateForFrontend(client.dateOfClientAllocation),
      dateOfClientReallocation: formatDateForFrontend(client.dateOfClientReallocation),
    }))

    res.json(formattedResults)
  })
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

