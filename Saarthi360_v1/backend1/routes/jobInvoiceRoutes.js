import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createJobInvoice,
  getAllJobInvoices,
  getSingleJobInvoice,
  updateJobInvoice,
  deleteJobInvoice,
} from "../controllers/jobInvoiceController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only jpeg, jpg, png, pdf files allowed"));
  },
});

router.post("/", upload.single("paymentScreenshot"), createJobInvoice);
router.get("/", getAllJobInvoices);
router.get("/:id", getSingleJobInvoice);
router.put("/:id", upload.single("paymentScreenshot"), updateJobInvoice);
router.delete("/:id", deleteJobInvoice);

export default router;
