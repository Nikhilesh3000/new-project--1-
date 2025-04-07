import express from "express";
import {
  addLegal,
  getAllLegals,
  getLegalById,
  updateLegal,
  deleteLegal,
} from "../controllers/legalController.js";

const router = express.Router();

router.post("/", addLegal);
router.get("/", getAllLegals);
router.get("/:id", getLegalById);
router.put("/:id", updateLegal);
router.delete("/:id", deleteLegal);

export default router;
