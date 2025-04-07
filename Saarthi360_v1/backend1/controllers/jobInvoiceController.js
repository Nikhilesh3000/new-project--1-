import db from "../config/db.js";
import fs from "fs";
import { formatDate } from "../utils/formatDate.js";

export const createJobInvoice = (req, res) => {
  const {
    kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
    detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
    amountPaidWithoutGst, gstAmount, totalAmountPaid,
    dateOfPayment, billDate, billNo,
  } = req.body;

  const paymentScreenshotPath = req.file ? req.file.path : null;

  const sql = `
    INSERT INTO jobinvoice (
      kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
      detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
      amountPaidWithoutGst, gstAmount, totalAmountPaid,
      dateOfPayment, paymentScreenshotPath, billDate, billNo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
    detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
    amountPaidWithoutGst, gstAmount, totalAmountPaid,
    formatDate(dateOfPayment), paymentScreenshotPath, formatDate(billDate), billNo,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Invoice added", id: result.insertId });
  });
};

export const getAllJobInvoices = (req, res) => {
  db.query("SELECT * FROM jobinvoice ORDER BY createdAt DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getSingleJobInvoice = (req, res) => {
  db.query("SELECT * FROM jobinvoice WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(results[0]);
  });
};

export const updateJobInvoice = (req, res) => {
  const id = req.params.id;
  const {
    kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
    detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
    amountPaidWithoutGst, gstAmount, totalAmountPaid,
    dateOfPayment, billDate, billNo,
  } = req.body;

  const newScreenshot = req.file ? req.file.path : null;

  const sql = `
    UPDATE jobinvoice SET
      kindlyShareName=?, contactPerson=?, nameOfTeamLeader=?, doYouHaveGstNo=?, gstNo=?,
      detailsOfJobPortal=?, noOfLoginForNaukri=?, noOfJobSlotForLinkedin=?,
      amountPaidWithoutGst=?, gstAmount=?, totalAmountPaid=?,
      dateOfPayment=?, paymentScreenshotPath=IFNULL(?, paymentScreenshotPath),
      billDate=?, billNo=?
    WHERE id=?`;

  const values = [
    kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
    detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
    amountPaidWithoutGst, gstAmount, totalAmountPaid,
    formatDate(dateOfPayment), newScreenshot, formatDate(billDate), billNo, id,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Invoice updated" });
  });
};

export const deleteJobInvoice = (req, res) => {
  const id = req.params.id;

  db.query("SELECT paymentScreenshotPath FROM jobinvoice WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const filePath = result[0]?.paymentScreenshotPath;

    db.query("DELETE FROM jobinvoice WHERE id = ?", [id], (delErr) => {
      if (delErr) return res.status(500).json({ error: delErr.message });

      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: "Invoice deleted successfully" });
    });
  });
};
