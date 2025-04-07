import db from "../config/db.js"

// Helper functions
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null
  const parts = dateString.split("/")
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateString
}

const formatDateForFrontend = (mysqlDate) => {
  if (!mysqlDate) return ""
  const date = new Date(mysqlDate)
  if (isNaN(date.getTime())) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${date.getFullYear()}`
}

// Add client
export const addClient = (req, res) => {
  let directorNames = Array.isArray(req.body.directorNames)
    ? req.body.directorNames.filter(Boolean).join(";")
    : req.body.directorNames

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
    req.body.companyName, req.body.bdMembersName, req.body.address, req.body.country, req.body.pinCode,
    req.body.city, req.body.state, req.body.industry, req.body.subIndustry, req.body.website,
    req.body.gstNumber, req.body.establishmentYear, req.body.numberOfEmployees,
    req.body.contactPersonName, req.body.contactDesignation, req.body.contactPhone, req.body.contactEmail,
    req.body.additionalName, req.body.additionalDesignation, req.body.additionalPhone, req.body.additionalLandline, req.body.additionalEmail,
    req.body.placementFees, req.body.creditPeriod, req.body.replacementPeriod, req.body.companyStatus,
    req.body.status || "pending", directorNames, req.body.teamLeader, req.body.franchiseeName,
    formatDateForMySQL(req.body.dateClientAcquired), formatDateForMySQL(req.body.dateOfClientAllocation),
    req.body.reallocationStatus || "No", formatDateForMySQL(req.body.dateOfClientReallocation),
    req.body.newFranchisee, req.body.newTeamLeader
  ]

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client added successfully!", clientId: result.insertId })
  })
}

// Get all clients
export const getAllClients = (req, res) => {
  db.query("SELECT * FROM clients_info", (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    const formatted = results.map((client) => ({
      ...client,
      directorNames: client.directorNames?.split(";") || [],
      dateClientAcquired: formatDateForFrontend(client.dateClientAcquired),
      dateOfClientAllocation: formatDateForFrontend(client.dateOfClientAllocation),
      dateOfClientReallocation: formatDateForFrontend(client.dateOfClientReallocation),
    }))
    res.json(formatted)
  })
}

// Get single client
export const getClientById = (req, res) => {
  db.query("SELECT * FROM clients_info WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.length === 0) return res.status(404).json({ error: "Client not found" })

    const client = result[0]
    client.directorNames = client.directorNames?.split(";") || []
    client.dateClientAcquired = formatDateForFrontend(client.dateClientAcquired)
    client.dateOfClientAllocation = formatDateForFrontend(client.dateOfClientAllocation)
    client.dateOfClientReallocation = formatDateForFrontend(client.dateOfClientReallocation)

    res.json(client)
  })
}

// Update client
export const updateClient = (req, res) => {
  let directorNames = Array.isArray(req.body.directorNames)
    ? req.body.directorNames.filter(Boolean).join(";")
    : req.body.directorNames

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
    req.body.companyName, req.body.bdMembersName, req.body.address, req.body.country, req.body.pinCode,
    req.body.city, req.body.state, req.body.industry, req.body.subIndustry, req.body.website,
    req.body.gstNumber, req.body.establishmentYear, req.body.numberOfEmployees,
    req.body.contactPersonName, req.body.contactDesignation, req.body.contactPhone, req.body.contactEmail,
    req.body.additionalName, req.body.additionalDesignation, req.body.additionalPhone, req.body.additionalLandline, req.body.additionalEmail,
    req.body.placementFees, req.body.creditPeriod, req.body.replacementPeriod, req.body.companyStatus,
    req.body.status || "pending", directorNames, req.body.teamLeader, req.body.franchiseeName,
    formatDateForMySQL(req.body.dateClientAcquired), formatDateForMySQL(req.body.dateOfClientAllocation),
    req.body.reallocationStatus || "No", formatDateForMySQL(req.body.dateOfClientReallocation),
    req.body.newFranchisee, req.body.newTeamLeader, req.params.id
  ]

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client updated successfully!" })
  })
}

// Delete client
export const deleteClient = (req, res) => {
  db.query("DELETE FROM clients_info WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Client deleted successfully!" })
  })
}

// Search client
export const searchClients = (req, res) => {
  const searchTerm = `%${req.params.term}%`
  const sql = `SELECT * FROM clients_info 
               WHERE companyName LIKE ? 
               OR contactPersonName LIKE ? 
               OR city LIKE ? 
               OR industry LIKE ?`

  db.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    const formatted = results.map((client) => ({
      ...client,
      directorNames: client.directorNames?.split(";") || [],
      dateClientAcquired: formatDateForFrontend(client.dateClientAcquired),
      dateOfClientAllocation: formatDateForFrontend(client.dateOfClientAllocation),
      dateOfClientReallocation: formatDateForFrontend(client.dateOfClientReallocation),
    }))
    res.json(formatted)
  })
}
