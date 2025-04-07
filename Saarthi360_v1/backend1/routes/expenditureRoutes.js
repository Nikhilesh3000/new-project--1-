import express from "express"
import multer from "multer"
import path from "path"
import {
  saveExpenditure,
  getExpenditures,
  updateExpenditure,
  deleteExpenditure
} from "../controllers/expenditureController.js"

const router = express.Router()

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

router.post("/", upload.single("file"), saveExpenditure)
router.get("/", getExpenditures)
router.put("/:id", upload.single("file"), updateExpenditure)
router.delete("/:id", deleteExpenditure)

export default router
