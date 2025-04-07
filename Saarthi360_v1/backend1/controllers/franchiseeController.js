import db from "../config/db.js";
import fs from "fs";

// Helper: Delete files
const deleteFiles = (paths) => {
  paths.forEach((filePath) => {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }
  });
};

export const createFranchisee = (req, res) => {
  const data = req.body;
  const files = req.files;

  const values = [
    data.nameAsPerAgreement,
    data.nameOfFranchiseeOwner,
    files.agreementDocument?.[0]?.path || null,
    data.phoneNumber,
    data.alternateNumber,
    data.emailId,
    data.dateOfBirth,
    data.typeOfBusiness,
    data.country,
    data.addressAsPerAadhar,
    data.pinCode,
    data.area,
    data.city,
    data.state,
    data.dateOfStartOfFranchisee,
    data.aadharNo,
    files.aadharCard?.[0]?.path || null,
    data.panNo,
    files.panCard?.[0]?.path || null,
    data.gstStatus,
    data.gstNumber,
    files.gstCertificate?.[0]?.path || null,
    data.franchiseeDeveloperName,
    data.teamLeaderName,
    data.franchiseeFees,
    data.franchiseePaymentReceivedOn,
    data.receivedDetails,
    data.modeOfReceipt,
    data.targetMonth,
    data.profitSharingPercentage,
    data.gstCharges,
    data.tdsPercentage,
    data.officialEmailCreated,
    data.officialEmailId,
    data.officialNumber,
    data.dateOfCreation,
    data.status,
    data.breakFrom === "null" ? null : data.breakFrom,
    data.breakTo === "null" ? null : data.breakTo,
    data.breakReason,
    files.breakLetterUpload?.[0]?.path || null,
    data.emailDeactivated,
  ];

  const sql = `INSERT INTO franchisees_forms (
    nameAsPerAgreement, nameOfFranchiseeOwner, agreementDocument, phoneNumber, alternateNumber, emailId, 
    dateOfBirth, typeOfBusiness, country, addressAsPerAadhar, pinCode, area, city, state, dateOfStartOfFranchisee, 
    aadharNo, aadharCard, panNo, panCard, gstStatus, gstNumber, gstCertificate, franchiseeDeveloperName, 
    teamLeaderName, franchiseeFees, franchiseePaymentReceivedOn, receivedDetails, modeOfReceipt, 
    targetMonth, profitSharingPercentage, gstCharges, tdsPercentage, officialEmailCreated, officialEmailId, 
    officialNumber, dateOfCreation, status, breakFrom, breakTo, breakReason, breakLetterUpload, emailDeactivated
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
    res.status(201).json({ message: "Franchisee created", franchiseeId: result.insertId });
  });
};

export const getFranchisees = (req, res) => {
  db.query("SELECT * FROM franchisees_forms", (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

export const getFranchiseeById = (req, res) => {
  db.query("SELECT * FROM franchisees_forms WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json(result[0]);
  });
};

export const updateFranchisee = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const files = req.files;

  db.query("SELECT * FROM franchisees_forms WHERE id = ?", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ error: "Fetch error" });

    const updateData = {
      ...data,
      agreementDocument: files.agreementDocument?.[0]?.path || result[0].agreementDocument,
      aadharCard: files.aadharCard?.[0]?.path || result[0].aadharCard,
      panCard: files.panCard?.[0]?.path || result[0].panCard,
      gstCertificate: files.gstCertificate?.[0]?.path || result[0].gstCertificate,
      breakLetterUpload: files.breakLetterUpload?.[0]?.path || result[0].breakLetterUpload,
    };

    db.query("UPDATE franchisees_forms SET ? WHERE id = ?", [updateData, id], (err) => {
      if (err) return res.status(500).json({ error: "Update failed", details: err.sqlMessage });
      res.status(200).json({ message: "Franchisee updated" });
    });
  });
};

export const deleteFranchisee = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM franchisees_forms WHERE id = ?", [id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ error: "Fetch error" });

    const files = [
      result[0].agreementDocument,
      result[0].aadharCard,
      result[0].panCard,
      result[0].gstCertificate,
      result[0].breakLetterUpload,
    ];

    db.query("DELETE FROM franchisees_forms WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Delete failed" });
      deleteFiles(files);
      res.status(200).json({ message: "Franchisee deleted" });
    });
  });
};
