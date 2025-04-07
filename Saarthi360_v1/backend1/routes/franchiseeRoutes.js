import express from "express";
import {
  createFranchisee,
  getFranchisees,
  getFranchiseeById,
  updateFranchisee,
  deleteFranchisee,
} from "../controllers/franchiseeController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Setup upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.fields([
  { name: "agreementDocument" },
  { name: "aadharCard" },
  { name: "panCard" },
  { name: "gstCertificate" },
  { name: "breakLetterUpload" },
]), createFranchisee);

router.get("/", getFranchisees);
router.get("/:id", getFranchiseeById);
router.put("/:id", upload.fields([
  { name: "agreementDocument" },
  { name: "aadharCard" },
  { name: "panCard" },
  { name: "gstCertificate" },
  { name: "breakLetterUpload" },
]), updateFranchisee);
router.delete("/:id", deleteFranchisee);

export default router;
