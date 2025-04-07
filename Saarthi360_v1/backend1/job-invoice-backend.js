import express from "express";
import mysql from "mysql";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@12345", // Change this as needed
  database: "crm_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only jpeg, jpg, png, pdf files allowed"));
  },
});

// Date formatter helper
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// 📌 CREATE
app.post("/api/jobinvoice", upload.single("paymentScreenshot"), (req, res) => {
  const {
    kindlyShareName,
    contactPerson,
    nameOfTeamLeader,
    doYouHaveGstNo,
    gstNo,
    detailsOfJobPortal,
    noOfLoginForNaukri,
    noOfJobSlotForLinkedin,
    amountPaidWithoutGst,
    gstAmount,
    totalAmountPaid,
    dateOfPayment,
    billDate,
    billNo,
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
});

// 📌 READ all
app.get("/api/jobinvoice", (req, res) => {
  db.query("SELECT * FROM jobinvoice ORDER BY createdAt DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 📌 READ single
app.get("/api/jobinvoice/:id", (req, res) => {
  db.query("SELECT * FROM jobinvoice WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(results[0]);
  });
});

// 📌 UPDATE
app.put("/api/jobinvoice/:id", upload.single("paymentScreenshot"), (req, res) => {
  const id = req.params.id;
  const {
    kindlyShareName,
    contactPerson,
    nameOfTeamLeader,
    doYouHaveGstNo,
    gstNo,
    detailsOfJobPortal,
    noOfLoginForNaukri,
    noOfJobSlotForLinkedin,
    amountPaidWithoutGst,
    gstAmount,
    totalAmountPaid,
    dateOfPayment,
    billDate,
    billNo,
  } = req.body;

  const newScreenshot = req.file ? req.file.path : null;

  const updateSql = `
    UPDATE jobinvoice SET
      kindlyShareName = ?, contactPerson = ?, nameOfTeamLeader = ?, doYouHaveGstNo = ?, gstNo = ?,
      detailsOfJobPortal = ?, noOfLoginForNaukri = ?, noOfJobSlotForLinkedin = ?,
      amountPaidWithoutGst = ?, gstAmount = ?, totalAmountPaid = ?,
      dateOfPayment = ?, paymentScreenshotPath = IFNULL(?, paymentScreenshotPath),
      billDate = ?, billNo = ?
    WHERE id = ?`;

  const values = [
    kindlyShareName, contactPerson, nameOfTeamLeader, doYouHaveGstNo, gstNo,
    detailsOfJobPortal, noOfLoginForNaukri, noOfJobSlotForLinkedin,
    amountPaidWithoutGst, gstAmount, totalAmountPaid,
    formatDate(dateOfPayment), newScreenshot,
    formatDate(billDate), billNo,
    id,
  ];

  db.query(updateSql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Invoice updated" });
  });
});

// 📌 DELETE
app.delete("/api/jobinvoice/:id", (req, res) => {
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
  });b  
});

// Server start
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
