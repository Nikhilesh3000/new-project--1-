import express from "express";
import { addEnquiry, addCandidateForm1, addCandidateForm2, addCandidateForm3, addCancellationData } from "../controllers/authController.js";

const router = express.Router();

router.post("/enquiries", addEnquiry);
router.post("/candidate-form1", addCandidateForm1);
router.post("/candidate-form2", addCandidateForm2);
router.post("/candidate-form3", addCandidateForm3);
router.post("/cancellations", addCancellationData);

export default router;